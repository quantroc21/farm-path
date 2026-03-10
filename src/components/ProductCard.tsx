import { Link } from "react-router-dom";
import { type Product, formatPrice } from "@/lib/productData";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="card-hover bg-card rounded-lg overflow-hidden shadow-card border border-border">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <span className="badge-new absolute top-3 left-3 z-10">{product.badge}</span>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 min-h-[2.5rem]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {product.name}
          </h3>
          <div className="border-t border-border my-2" />
          <p className="text-primary font-bold text-base">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground text-xs mt-0.5">Đã bao gồm Thuế</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
