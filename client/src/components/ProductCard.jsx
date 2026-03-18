import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productCardReveal } from "../animations/pageVariants";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCartMotion } from "../context/CartMotionContext";
import { formatCurrency } from "../utils/currency";
import AppImage from "./AppImage";
import RatingStars from "./RatingStars";

const handleTiltMove = (event) => {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateY = ((x / rect.width) - 0.5) * 10;
  const rotateX = (0.5 - y / rect.height) * 10;

  element.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
  element.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
  element.style.setProperty("--glow-x", `${((x / rect.width) * 100).toFixed(2)}%`);
  element.style.setProperty("--glow-y", `${((y / rect.height) * 100).toFixed(2)}%`);
};

const resetTilt = (event) => {
  const element = event.currentTarget;
  element.style.setProperty("--rotate-x", "0deg");
  element.style.setProperty("--rotate-y", "0deg");
  element.style.setProperty("--glow-x", "50%");
  element.style.setProperty("--glow-y", "50%");
};

const ProductCard = ({ product, onQuickView, index = 0, badge = null }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { animateAddToCart } = useCartMotion();
  const { isWishlisted, toggleWishlist } = useAuth();
  const wishlisted = isWishlisted(product._id);
  const productPath = `/products/${product.slug || product._id}`;
  const mediaMotionKey = product.slug || product._id;
  const primaryImageRef = useRef(null);

  const handleCardClick = (event) => {
    if (event.target.closest("button, a, input, select, textarea")) {
      return;
    }

    navigate(productPath);
  };

  const handleCardKeyDown = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(productPath);
    }
  };

  const handleAddToCart = async (event, qty = 1) => {
    event.stopPropagation();

    const added = await addToCart(product, qty);

    if (added) {
      animateAddToCart({
        sourceEl: primaryImageRef.current,
        imageSrc: product.image,
        label: product.name,
      });
    }
  };

  return (
    <motion.article
      layout
      variants={productCardReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      custom={index}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
      className="group product-card surface-card-strong cursor-pointer overflow-hidden p-3"
    >
      <div className="tilt-card" onMouseMove={handleTiltMove} onMouseLeave={resetTilt}>
        <div className="tilt-shine" />
        <div
          className="product-card-media relative overflow-hidden rounded-[18px] bg-[rgba(var(--surface-muted),0.7)]"
          style={{ transform: "translateZ(26px)" }}
        >
          <Link to={productPath} className="block aspect-[4/4.8] overflow-hidden">
            <motion.div layoutId={`product-media-${mediaMotionKey}`} className="h-full w-full">
              <AppImage
                ref={primaryImageRef}
                src={product.image}
                alt={product.name}
                label={product.name}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </Link>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <button
            type="button"
            onClick={() => toggleWishlist(product._id)}
            className="absolute left-3 top-3 inline-flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-stone-50 opacity-0 backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-black/35 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-white/10"
            aria-label="Toggle wishlist"
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-current text-rose-500" : ""}`} />
          </button>
          {badge ? (
            <span className="absolute right-3 top-3 inline-flex rounded-full bg-[rgb(var(--button-start))] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[rgb(var(--button-foreground))]">
              {badge}
            </span>
          ) : null}
          <div className="absolute inset-x-0 bottom-3 flex translate-y-3 justify-center opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-2 py-2 shadow-lg backdrop-blur-md dark:bg-white/10">
              {onQuickView ? (
                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/90 px-4 py-2 text-sm font-medium text-stone-900 transition duration-300 hover:scale-105 dark:bg-stone-950/90 dark:text-stone-100"
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4" />
                  Quick View
                </button>
              ) : null}
              <button
                type="button"
                onClick={(event) => handleAddToCart(event, 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--button-start))] text-[rgb(var(--button-foreground))] transition duration-300 hover:scale-105"
                aria-label="Add to cart"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2.5" style={{ transform: "translateZ(18px)" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-soft">{product.category}</p>
              <Link to={productPath} className="mt-1 block">
                <motion.h3
                  layoutId={`product-title-${mediaMotionKey}`}
                  className="text-lg font-semibold leading-6 tracking-[-0.02em]"
                >
                  {product.name}
                </motion.h3>
              </Link>
            </div>
            <motion.p
              layoutId={`product-price-${mediaMotionKey}`}
              className="text-base font-semibold text-[rgb(var(--accent))]"
            >
              {formatCurrency(product.price)}
            </motion.p>
          </div>

          <RatingStars rating={product.rating} reviews={product.numReviews} />

          <button
            type="button"
            onClick={(event) => handleAddToCart(event, 1)}
            className="btn-primary flex w-full items-center gap-2 rounded-[16px] px-4 py-3 text-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
