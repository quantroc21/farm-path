import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, LogOut, Plus, Pencil, Trash2, Loader2, Sprout, ExternalLink, Eye, EyeOff, X, Save, Package, Image as ImageIcon, ClipboardCheck, CheckCircle, XCircle, Clock, MapPin, ShoppingBag } from 'lucide-react';
import { LandingService, type Order } from '@/services/landing.service';
import FadeIn from '@/components/FadeIn';

const API = '/api';

interface Product {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  price: number;
  images: string[];
  badge: string;
  category: string;
  size: string;
  description: string;
  origin: {
    country: string;
    region: string;
    farmer: string;
    farm: string;
    altitude?: string;
    variety?: string;
    process?: string;
  };
  flavorNotes?: string;
  story: string;
  batchNumber: string;
  isPublished: boolean;
  options?: { size: string; price: number }[];
  pairings?: { name: string; image: string; tip?: string }[];
  _traceType?: 'daklink' | 'edenhub' | 'none';
}

interface Batch {
  batchNumber: string;
  productName: string;
  areaName: string;
  harvestDate: string;
  farmerEmail: string;
}

const emptyProduct = {
  slug: '', sku: '', name: '', price: 0, images: [] as string[], badge: '', category: 'trai-cay', size: '',
  description: '', origin: { country: 'Việt Nam', region: 'Bình Thuận', farmer: '', farm: '' },
  story: '', batchNumber: '', isPublished: true, options: [] as { size: string; price: number }[],
};

interface Traceability {
  id: number;
  batchNumber: string;
  productName: string;
  areaName: string;
  harvestDate: string;
  farmerEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

type Tab = 'products' | 'batches' | 'traceability' | 'orders';

const AdminDashboardPage = () => {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [traces, setTraces] = useState<Traceability[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [activeTraceTab, setActiveTraceTab] = useState<'PENDING' | 'APPROVED'>('PENDING');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, batchRes, traceRes, orderRes] = await Promise.all([
        axios.get(`${API}/admin/products`, { headers }),
        axios.get(`${API}/admin/batches`, { headers }),
        axios.get(`${API}/admin/traceability`, { headers }),
        LandingService.getAdminOrders()
      ]);
      setProducts(prodRes.data);
      setBatches(batchRes.data);
      setTraces(traceRes.data);
      setOrders(orderRes);
    } catch (err) {
      if (axios.isAxiosError(err) && (err.response?.status === 403 || err.response?.status === 401)) {
        logout(); navigate('/admin');
      }
    } finally { setIsLoading(false); }
  };

  const handleUpdateOrderStatus = async (id: number, data: { status?: string, payment_status?: string }) => {
    setIsUpdatingOrder(true);
    try {
      const success = await LandingService.updateOrderStatus(id, data);
      if (success) {
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, ...data } as Order);
        }
        fetchData();
      } else {
        alert('Lỗi khi cập nhật trạng thái đơn hàng');
      }
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      const success = await LandingService.deleteOrder(id);
      if (success) {
        setOrderToDelete(null);
        fetchData();
      } else {
        alert('Lỗi khi xóa đơn hàng');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const openCreateForm = (batch?: Batch) => {
    setEditingProduct({
      ...emptyProduct,
      name: batch?.productName || '',
      batchNumber: batch?.batchNumber || '',
      slug: batch?.productName ? batch.productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : '',
      origin: { ...emptyProduct.origin, region: batch?.areaName || 'Bình Thuận' } as any,
      _traceType: batch?.batchNumber ? 'daklink' : 'none',
    });
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    const traceType = !product.batchNumber ? 'none' : (product.batchNumber.startsWith('http') ? 'edenhub' : 'daklink');
    setEditingProduct({ ...product, _traceType: traceType });
    setShowForm(true);
  };

  const saveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.slug) {
      alert('Tên sản phẩm và Slug không được để trống!');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        slug: editingProduct.slug,
        sku: editingProduct.sku || '',
        name: editingProduct.name,
        price: editingProduct.price || 0,
        images: editingProduct.images || [],
        badge: editingProduct.badge || '',
        category: editingProduct.category || 'tuoi',
        size: editingProduct.size || '',
        description: editingProduct.description || '',
        originCountry: editingProduct.origin?.country || 'Việt Nam',
        originRegion: editingProduct.origin?.region || 'Bình Thuận',
        originFarmer: editingProduct.origin?.farmer || '',
        originAltitude: editingProduct.origin?.altitude || '',
        originFarm: editingProduct.origin?.farm || '',
        originVariety: editingProduct.origin?.variety || '',
        originProcess: editingProduct.origin?.process || '',
        flavorNotes: editingProduct.flavorNotes || '',
        story: editingProduct.story || '',
        batchNumber: editingProduct.batchNumber || '',
        isPublished: editingProduct.isPublished !== false,
        options: editingProduct.options || [],
      };

      if (editingProduct.id) {
        await axios.put(`${API}/admin/products/${editingProduct.id}`, payload, { headers });
      } else {
        await axios.post(`${API}/admin/products`, payload, { headers });
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchData();
    } catch (err: any) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally { setIsSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) { formData.append('images', files[i]); }
    setIsUploading(true);
    try {
      const res = await axios.post(`${API}/admin/upload`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        const currentImages = editingProduct?.images || [];
        setEditingProduct({ ...editingProduct, images: [...currentImages, ...res.data.urls] } as any);
      }
    } catch (err: any) {
      alert('Lỗi upload ảnh: ' + (err.response?.data?.message || err.message));
    } finally { setIsUploading(false); }
  };

  const removeImage = (index: number) => {
    if (!editingProduct?.images) return;
    const newImages = [...editingProduct.images];
    newImages.splice(index, 1);
    setEditingProduct({ ...editingProduct, images: newImages });
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API}/admin/products/${id}`, { headers });
      setDeleteConfirm(null);
      fetchData();
    } catch (err) { alert('Lỗi khi xóa sản phẩm'); }
  };

  const updateTraceStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      if (!confirm(`Bạn có chắc chắn muốn ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} lô hàng này?`)) return;
      await axios.patch(`${API}/admin/traceability/${id}`, { status }, { headers });
      alert(`Đã ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} thành công!`);
      fetchData();
    } catch (err: any) {
      alert('Lỗi cập nhật: ' + (err.response?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Quản lý hệ thống</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/admin'); }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-xl text-sm font-semibold text-muted-foreground transition-colors">
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-10">
        <FadeIn>
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}>
              <Package className="w-4 h-4 inline-block mr-2" /> Sản phẩm ({products.length})
            </button>
            <button onClick={() => setActiveTab('batches')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'batches' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}>
              <Sprout className="w-4 h-4 inline-block mr-2" /> Lô hàng ({batches.length})
            </button>
            <button onClick={() => setActiveTab('traceability')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'traceability' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}>
              <ClipboardCheck className="w-4 h-4 inline-block mr-2" /> Truy xuất ({traces.filter(t => t.status === 'PENDING').length})
            </button>
            <button onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}>
              <ShoppingBag className="w-4 h-4 inline-block mr-2" /> Đơn hàng ({orders.length})
            </button>
            {activeTab === 'products' && (
              <button onClick={() => openCreateForm()}
                className="ml-auto px-5 py-3 bg-foreground text-background rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-foreground/90 transition-all shadow-md">
                <Plus className="w-4 h-4" /> Tạo mới
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'products' && (
            <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      <th className="px-6 py-5">Sản phẩm</th>
                      <th className="px-6 py-5">Giá</th>
                      <th className="px-6 py-5 text-center">Trạng thái</th>
                      <th className="px-6 py-5 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-5 flex items-center gap-3">
                           {p.images?.[0] && <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" />}
                           <span className="font-bold">{p.name}</span>
                        </td>
                        <td className="px-6 py-5">{new Intl.NumberFormat('vi-VN').format(p.price)}đ</td>
                        <td className="px-6 py-5 text-center">
                          {p.isPublished ? <CheckCircle className="w-4 h-4 text-green-500 m-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground m-auto" />}
                        </td>
                        <td className="px-6 py-5 text-right flex justify-end gap-2">
                          <button onClick={() => openEditForm(p)} className="p-2 hover:bg-muted rounded-lg"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'batches' && (
            <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      <th className="px-6 py-5">Lô hàng</th>
                      <th className="px-6 py-5">Sản phẩm</th>
                      <th className="px-6 py-5 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {batches.map((b) => (
                      <tr key={b.batchNumber} className="hover:bg-muted/20">
                        <td className="px-6 py-5 font-mono text-sm font-bold">#{b.batchNumber}</td>
                        <td className="px-6 py-5 font-semibold">{b.productName}</td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => openCreateForm(b)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold">Duyệt sản phẩm</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'traceability' && (
            <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
               <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Duyệt các báo cáo truy xuất nguồn gốc từ nông dân.</p>
                <div className="flex bg-muted/50 p-1 rounded-xl">
                  <button onClick={() => setActiveTraceTab('PENDING')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTraceTab === 'PENDING' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                    Chờ duyệt ({traces.filter(t => t.status === 'PENDING').length})
                  </button>
                  <button onClick={() => setActiveTraceTab('APPROVED')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTraceTab === 'APPROVED' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                    Đã duyệt ({traces.filter(t => t.status === 'APPROVED').length})
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      <th className="px-6 py-5">Sản phẩm</th>
                      <th className="px-6 py-5 text-center">Trạng thái</th>
                      <th className="px-6 py-5 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {traces.filter(t => t.status === (activeTraceTab as any)).map((t) => (
                      <tr key={t.id} className="hover:bg-muted/20">
                        <td className="px-6 py-5 font-bold">{t.productName}</td>
                        <td className="px-6 py-5 text-center">
                           <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${t.status === 'APPROVED' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20'}`}>
                             {t.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-right flex justify-end gap-2">
                          {t.status === 'PENDING' ? (
                            <>
                              <button onClick={() => updateTraceStatus(t.id, 'APPROVED')} className="p-2 text-green-600 hover:bg-green-500/10 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => updateTraceStatus(t.id, 'REJECTED')} className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg"><XCircle className="w-4 h-4" /></button>
                            </>
                          ) : (
                            <a href={`https://daklink.vn/trace/${t.batchNumber}`} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary rounded-lg text-xs"><ExternalLink className="w-4 h-4" /></a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
               <div className="px-6 py-4 bg-muted/30 border-b border-border">
                <p className="text-sm text-muted-foreground">Các đơn hàng khách đặt từ Landing Page.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      <th className="px-6 py-5">Mã đơn</th>
                      <th className="px-6 py-5">Khách hàng</th>
                      <th className="px-6 py-5 text-center">Trạng thái</th>
                      <th className="px-6 py-5 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-muted/20 cursor-pointer" onClick={() => setSelectedOrder(o)}>
                        <td className="px-6 py-5 font-mono font-bold text-primary">#{o.id}</td>
                        <td className="px-6 py-5">
                          <div className="font-bold">{o.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <StatusBadge type="order" status={o.status} />
                        </td>
                        <td className="px-6 py-5 text-right flex justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }} className="p-2 hover:bg-muted rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button onClick={(e) => { e.stopPropagation(); setOrderToDelete(o.id); }} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-20 text-center text-muted-foreground italic">Chưa có đơn hàng nào.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </FadeIn>
      </div>

      {/* Modals */}
      {showForm && editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl shadow-2xl border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">{editingProduct.id ? 'Sửa sản phẩm' : 'Đăng sản phẩm'}</h2>
              <button onClick={() => { setShowForm(false); setEditingProduct(null); }} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase border-b border-primary/10 pb-2">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Tên sản phẩm *" value={editingProduct.name || ''} onChange={(v) => setEditingProduct({ ...editingProduct, name: v })} />
                  <FormField label="Slug *" value={editingProduct.slug || ''} onChange={(v) => setEditingProduct({ ...editingProduct, slug: v })} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <FormField label="Mã hàng KiotViet (SKU)" value={editingProduct.sku || ''} onChange={(v) => setEditingProduct({ ...editingProduct, sku: v })} placeholder="Để trống nếu không đồng bộ KiotViet" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Giá mặc định (VNĐ)" value={String(editingProduct.price || 0)} onChange={(v) => setEditingProduct({ ...editingProduct, price: parseInt(v) || 0 })} type="number" />
                  <FormField label="Quy cách mặc định" value={editingProduct.size || ''} onChange={(v) => setEditingProduct({ ...editingProduct, size: v })} placeholder="vd: 1kg, 500g" />
                </div>
                {/* Options (Variants) */}
                <div className="bg-muted/20 p-4 rounded-xl border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quy cách & Giá bán (Nhiều lựa chọn)</label>
                    <button type="button" onClick={() => {
                      const opts = [...(editingProduct.options || []), { size: '', price: 0 }];
                      setEditingProduct({ ...editingProduct, options: opts });
                    }} className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-bold flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Thêm
                    </button>
                  </div>
                  {(!editingProduct.options || editingProduct.options.length === 0) && (
                    <p className="text-xs text-muted-foreground italic">Chưa có lựa chọn nào. Nếu không thêm, sản phẩm sẽ dùng giá mặc định ở trên.</p>
                  )}
                  {editingProduct.options?.map((opt, idx) => (
                    <div key={idx} className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Quy cách</label>
                        <input type="text" value={opt.size} placeholder="vd: 26 trái/hộp"
                          onChange={(e) => {
                            const opts = [...(editingProduct.options || [])];
                            opts[idx] = { ...opts[idx], size: e.target.value };
                            setEditingProduct({ ...editingProduct, options: opts });
                          }}
                          className="w-full bg-muted/50 border border-border focus:border-primary/50 rounded-xl py-2 px-3 text-foreground outline-none text-sm" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Giá (VNĐ)</label>
                        <input type="number" value={opt.price}
                          onChange={(e) => {
                            const opts = [...(editingProduct.options || [])];
                            opts[idx] = { ...opts[idx], price: parseInt(e.target.value) || 0 };
                            setEditingProduct({ ...editingProduct, options: opts });
                          }}
                          className="w-full bg-muted/50 border border-border focus:border-primary/50 rounded-xl py-2 px-3 text-foreground outline-none text-sm" />
                      </div>
                      <button type="button" onClick={() => {
                        const opts = [...(editingProduct.options || [])];
                        opts.splice(idx, 1);
                        setEditingProduct({ ...editingProduct, options: opts });
                      }} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg mb-0.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Tùy chọn truy xuất</label>
                    <select 
                      value={editingProduct._traceType || 'none'}
                      onChange={(e) => {
                        const val = e.target.value as 'daklink' | 'edenhub' | 'none';
                        let newBatch = editingProduct.batchNumber || '';
                        if (val === 'none') newBatch = '';
                        else if (val === 'edenhub' && !newBatch.startsWith('http')) newBatch = 'https://';
                        else if (val === 'daklink' && newBatch.startsWith('http')) newBatch = '';
                        setEditingProduct({ ...editingProduct, _traceType: val, batchNumber: newBatch });
                      }}
                      className="w-full bg-muted/50 border border-border focus:border-primary/50 rounded-xl py-2 px-3 text-foreground outline-none text-sm"
                    >
                      <option value="daklink">Daklink (Nhập mã lô)</option>
                      <option value="edenhub">Edenhub (Nhập link)</option>
                      <option value="none">Không hiện truy xuất</option>
                    </select>
                  </div>
                  {editingProduct._traceType === 'edenhub' && (
                    <FormField label="Link Edenhub" value={editingProduct.batchNumber || ''} onChange={(v) => setEditingProduct({ ...editingProduct, batchNumber: v })} placeholder="https://..." />
                  )}
                  {editingProduct._traceType === 'daklink' && (
                    <FormField label="Mã lô hàng Daklink" value={editingProduct.batchNumber || ''} onChange={(v) => setEditingProduct({ ...editingProduct, batchNumber: v })} placeholder="Nhập mã lô" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Danh mục</label>
                    <select value={editingProduct.category || 'trai-cay'} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full bg-muted/50 border border-border focus:border-primary/50 rounded-xl py-2 px-3 text-foreground outline-none text-sm">
                      <option value="trai-cay">Trái cây tươi</option>
                      <option value="rau-cu">Rau củ sạch</option>
                      <option value="che-bien">Sản phẩm chế biến</option>
                      <option value="khac">Khác</option>
                    </select>
                  </div>
                  <FormField label="Nhãn (Badge)" value={editingProduct.badge || ''} onChange={(v) => setEditingProduct({ ...editingProduct, badge: v })} placeholder="vd: NEW, HOT, 20% OFF" />
                </div>
              </div>

              {/* Origin Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase border-b border-primary/10 pb-2">Nguồn gốc & Xuất xứ</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Quốc gia" value={editingProduct.origin?.country || 'Việt Nam'} onChange={(v) => setEditingProduct({ ...editingProduct, origin: { ...editingProduct.origin!, country: v } })} />
                  <FormField label="Vùng miền" value={editingProduct.origin?.region || 'Bình Thuận'} onChange={(v) => setEditingProduct({ ...editingProduct, origin: { ...editingProduct.origin!, region: v } })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Nông trại / Cơ sở" value={editingProduct.origin?.farm || ''} onChange={(v) => setEditingProduct({ ...editingProduct, origin: { ...editingProduct.origin!, farm: v } })} />
                  <FormField label="Người sản xuất" value={editingProduct.origin?.farmer || ''} onChange={(v) => setEditingProduct({ ...editingProduct, origin: { ...editingProduct.origin!, farmer: v } })} />
                </div>
              </div>

              {/* Detailed Content */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase border-b border-primary/10 pb-2">Nội dung chi tiết</h3>
                <FormField label="Mô tả sản phẩm" value={editingProduct.description || ''} onChange={(v) => setEditingProduct({ ...editingProduct, description: v })} textarea />
                <FormField label="Câu chuyện thương hiệu" value={editingProduct.story || ''} onChange={(v) => setEditingProduct({ ...editingProduct, story: v })} textarea />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-primary uppercase border-b border-primary/10 pb-2">Hình ảnh</h3>
                <div className="flex flex-wrap gap-2 pt-2">
                   {editingProduct.images?.map((img, i) => (
                     <div key={i} className="w-20 h-20 rounded-lg relative overflow-hidden">
                       <img src={img} className="w-full h-full object-cover" />
                       <button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X className="w-3 h-3" /></button>
                     </div>
                   ))}
                   <label className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted">
                     <Plus className="w-6 h-6 text-muted-foreground" />
                     <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                   </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-muted rounded-xl font-bold text-sm">Hủy</button>
              <button onClick={saveProduct} disabled={isSaving} className="px-8 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg flex items-center gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {editingProduct.id ? 'Cập nhật' : 'Đăng bán'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /> Chi tiết đơn hàng #{selectedOrder.id}</h2>
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Trạng thái đơn</label>
                   <select value={selectedOrder.status} onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, { status: e.target.value })} className="w-full border rounded-lg p-2 font-bold bg-muted text-sm">
                     <option value="PENDING">Chờ xử lý</option>
                     <option value="PROCESSING">Đang xử lý</option>
                     <option value="COMPLETED">Hoàn thành</option>
                     <option value="CANCELLED">Hủy đơn</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Thanh toán</label>
                   <select value={selectedOrder.payment_status} onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, { payment_status: e.target.value })} className="w-full border rounded-lg p-2 font-bold bg-muted text-sm">
                     <option value="UNPAID">Chưa thanh toán</option>
                     <option value="PAID">Đã thanh toán</option>
                   </select>
                 </div>
               </div>
               
               <div className="bg-muted/30 p-4 rounded-2xl space-y-2 border border-border">
                 <div className="flex justify-between text-sm"><span>Khách hàng:</span> <span className="font-bold">{selectedOrder.customer_name}</span></div>
                 <div className="flex justify-between text-sm"><span>Số điện thoại:</span> <span className="font-bold">{selectedOrder.customer_phone}</span></div>
                 <div className="flex justify-between text-sm"><span>Địa chỉ:</span> <span className="font-bold text-right">{selectedOrder.customer_address}</span></div>
               </div>

               <div className="max-h-[30vh] overflow-y-auto space-y-3">
                 {selectedOrder.items?.map((item, i) => (
                   <div key={i} className="flex justify-between items-center text-sm p-3 bg-muted/20 rounded-xl">
                     <span className="font-semibold">{item.product_name} x {item.quantity}</span>
                     <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(item.product_price * item.quantity)}đ</span>
                   </div>
                 ))}
               </div>

               <div className="pt-4 border-t border-border flex justify-between items-center font-bold text-xl">
                 <span>Tổng cộng:</span>
                 <span className="text-primary">{new Intl.NumberFormat('vi-VN').format(selectedOrder.total_amount)}đ</span>
               </div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="w-full mt-8 py-4 bg-foreground text-background rounded-2xl font-bold shadow-xl hover:bg-foreground/90 transition-all">Đóng</button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
           <div className="bg-card rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8" /></div>
              <h3 className="text-lg font-bold">Xác nhận xóa?</h3>
              <p className="text-muted-foreground text-sm mt-1">Sản phẩm sẽ bị xóa vĩnh viễn.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-muted rounded-xl font-bold">Hủy</button>
                <button onClick={() => deleteProduct(deleteConfirm)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Xóa</button>
              </div>
           </div>
        </div>
      )}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
           <div className="bg-card rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8" /></div>
              <h3 className="text-lg font-bold">Xác nhận xóa đơn hàng?</h3>
              <p className="text-muted-foreground text-sm mt-1">Đơn hàng #{orderToDelete} sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setOrderToDelete(null)} className="flex-1 py-3 bg-muted rounded-xl font-bold">Hủy</button>
                <button onClick={() => handleDeleteOrder(orderToDelete)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Xóa</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ type, status }: { type: 'order' | 'payment', status: string }) => {
  if (type === 'order') {
    switch (status) {
      case 'PENDING': return <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 rounded-full text-[10px] font-bold uppercase border border-orange-500/20">Chờ xử lý</span>;
      case 'PROCESSING': return <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 rounded-full text-[10px] font-bold uppercase border border-blue-500/20">Đang xử lý</span>;
      case 'COMPLETED': return <span className="px-2.5 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-bold uppercase border border-green-500/20">Hoàn thành</span>;
      case 'CANCELLED': return <span className="px-2.5 py-1 bg-red-500/10 text-red-600 rounded-full text-[10px] font-bold uppercase border border-red-500/20">Đã hủy</span>;
      default: return null;
    }
  } else {
    switch (status) {
      case 'UNPAID': return <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-bold uppercase border border-border">Chưa trả</span>;
      case 'PAID': return <span className="px-2.5 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-bold uppercase border border-green-500/20">Đã trả</span>;
      default: return null;
    }
  }
};

const FormField = ({ label, value, onChange, placeholder, type, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; textarea?: boolean;
}) => (
  <div>
    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-muted/50 border border-border focus:border-primary/50 rounded-xl py-2 px-3 text-foreground outline-none text-sm min-h-[80px] resize-y" />
    ) : (
      <input type={type || 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-muted/50 border border-border focus:border-primary/50 rounded-xl py-2 px-3 text-foreground outline-none text-sm" />
    )}
  </div>
);

export default AdminDashboardPage;
