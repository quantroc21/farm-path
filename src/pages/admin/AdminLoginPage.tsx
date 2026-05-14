import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/admin/login', { password });
      setToken(response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Mật khẩu không chính xác. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full">
        <FadeIn>
          <div className="bg-card rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mb-8">Dành cho nhân viên kiểm duyệt nội dung Daklink</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative text-left">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 mb-2 block">
                  Mật khẩu Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-muted border-2 border-transparent focus:border-primary/30 rounded-2xl py-3.5 pl-12 pr-4 text-foreground outline-none transition-all"
                    placeholder="Nhập mật khẩu truy cập"
                  />
                </div>
                {error && <p className="text-destructive text-xs mt-2 font-medium pl-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          <button 
            onClick={() => navigate('/')} 
            className="mt-8 text-white/40 hover:text-white/70 text-sm font-medium transition-colors mx-auto block"
          >
            ← Quay về trang chủ
          </button>
        </FadeIn>
      </div>
    </div>
  );
};

export default AdminLoginPage;
