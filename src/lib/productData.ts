import axios from "axios";

export interface ProductOption {
  size: string;
  price: number;
}

export interface ProductPairing {
  name: string;
  image: string;
  tip?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
   image: string;
   images?: string[];
   badge: string;
  category: "tuoi" | "kho" | "all";
  size: string;
  description: string;
  origin: {
    country: string;
    region: string;
    farmer: string;
    altitude: string;
    farm: string;
    variety: string;
    process: string;
  };
  flavorNotes: string;
  story: string;
  batchNumber: string;
  options?: ProductOption[];
  pairings?: ProductPairing[];
  traceability?: any[];
}

const API_BASE = "/api";

export const ProductService = {
  async getAll(): Promise<Product[]> {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      return res.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const res = await axios.get(`${API_BASE}/products/${slug}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },
};

const viVNFormatter = new Intl.NumberFormat("vi-VN");

export const formatPrice = (price: number) => {
  return viVNFormatter.format(price) + "đ";
};
