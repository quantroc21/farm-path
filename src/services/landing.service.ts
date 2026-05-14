import axios from "axios";

export interface TraceableProduct {
  batchNumber: string;
  productName: string;
  areaName: string;
  harvestDate: string;
}

export interface OrderItem {
  id: string;
  order_id?: number;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  payment_status: 'UNPAID' | 'PAID' | 'REFUNDED';
  payment_method: string;
  created_at: string;
  items?: OrderItem[];
}

const API_BASE_URL = "/api";

const getAuthHeader = () => {
  const token = localStorage.getItem('daklink-auth-storage');
  if (token) {
    try {
      const parsed = JSON.parse(token);
      return { Authorization: `Bearer ${parsed.state.token}` };
    } catch (e) {
      return {};
    }
  }
  return {};
};

export const LandingService = {
  async getFeaturedProducts(): Promise<TraceableProduct[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/featured-products`);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured products from API:", error);
      return [];
    }
  },

  async createOrder(orderData: any): Promise<{ success: boolean; orderId?: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false };
    }
  },

  async getAdminOrders(): Promise<Order[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      return [];
    }
  },

  async updateOrderStatus(id: number, data: { status?: string; payment_status?: string }): Promise<boolean> {
    try {
      await axios.patch(`${API_BASE_URL}/admin/orders/${id}`, data, {
        headers: getAuthHeader()
      });
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  },

  async deleteOrder(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/admin/orders/${id}`, {
        headers: getAuthHeader()
      });
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      return false;
    }
  }
};
