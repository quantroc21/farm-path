import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/productData';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id && item.size === product.size);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.size === product.size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },
      
      removeItem: (productId, size) => {
        set({
          items: get().items.filter((item) => !(item.id === productId && item.size === (size || item.size))),
        });
      },
      
      updateQuantity: (productId, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        
        set({
          items: get().items.map((item) =>
            item.id === productId && item.size === (size || item.size) ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'daklink-cart-storage',
    }
  )
);
