import { Link } from "react-router-dom";
import { type Product, formatPrice } from "@/lib/productData";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Link to={`/product/${product.slug}`} className="group block h-full">
      <div className="card-hover bg-card rounded-2xl overflow-hidden shadow-sm border border-border/60 hover:border-primary/20 flex flex-col h-full group-hover:shadow-md transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-[#FBFBFB]">
          {product.badge && (
            <span className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm uppercase tracking-widest">
              {product.badge}
            </span>
          )}
          <img
            src={product.image}
            alt={`${product.name} \u2013 mua n\u00f4ng s\u1ea3n s\u1ea1ch t\u1ea1i Daklink`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="p-4 flex flex-col flex-1 gap-1">
          <h3 className="font-bold text-[16px] text-foreground leading-snug line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-primary font-semibold text-lg leading-tight">
                {formatPrice(product.price)}
              </span>
              <span className="text-muted-foreground/70 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                Đã bao gồm Thuế
              </span>
            </div>
            <button
              className="bg-primary/10 text-primary p-2.5 rounded-xl hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-95 transition-all z-10 shadow-none border-none outline-none cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product);
              }}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
