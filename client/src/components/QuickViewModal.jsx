import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCartMotion } from "../context/CartMotionContext";
import { formatCurrency } from "../utils/currency";
import AppImage from "./AppImage";
import RatingStars from "./RatingStars";

const QuickViewModal = ({ product, onClose }) => {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const { addToCart } = useCart();
  const { animateAddToCart } = useCartMotion();
  const { isWishlisted, toggleWishlist } = useAuth();
  const productPath = product ? `/products/${product.slug || product._id}` : "/shop";
  const primaryImageRef = useRef(null);
  const mediaMotionKey = product?.slug || product?._id || "quick-view";

  useEffect(() => {
    setQty(1);
    setSelectedImage(product?.images?.[0] || product?.image || "");
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    const added = await addToCart(product, qty);

    if (added) {
      animateAddToCart({
        sourceEl: primaryImageRef.current,
        imageSrc: selectedImage || product.image,
        label: product.name,
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(5,5,5,0.76)] p-4 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="quick-view-panel relative grid max-h-[90vh] w-full max-w-5xl gap-6 overflow-y-auto p-5 lg:grid-cols-[0.98fr_1.02fr] lg:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft bg-[rgba(var(--surface),0.92)] text-main shadow-[0_12px_32px_-20px_rgba(0,0,0,0.3)]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-3">
              <motion.div
                layoutId={`product-media-${mediaMotionKey}`}
                className="overflow-hidden rounded-[28px] bg-[rgba(var(--surface-muted),0.82)]"
              >
                <AppImage
                  ref={primaryImageRef}
                  src={selectedImage}
                  alt={product.name}
                  label={product.name}
                  className="aspect-[4/4.4] h-full w-full object-cover"
                />
              </motion.div>
              <div className="grid grid-cols-3 gap-3">
                {(product.images?.length ? product.images : [product.image]).map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`overflow-hidden rounded-[20px] border p-1.5 transition ${
                      selectedImage === image
                        ? "border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.12)]"
                        : "border-soft bg-[rgba(var(--surface),0.7)]"
                    }`}
                  >
                    <AppImage
                      src={image}
                      alt={product.name}
                      label={product.name}
                      className="aspect-square w-full rounded-[16px] object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="quick-view-info flex flex-col justify-between gap-6 pt-8 lg:pt-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-soft">{product.category}</p>
                    <motion.h3
                      layoutId={`product-title-${mediaMotionKey}`}
                      className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em]"
                    >
                      {product.name}
                    </motion.h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product._id)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-soft bg-[rgba(var(--surface),0.9)] text-main"
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted(product._id) ? "fill-current text-rose-500" : ""}`} />
                  </button>
                </div>

                <RatingStars rating={product.rating} reviews={product.numReviews} />
                <motion.p
                  layoutId={`product-price-${mediaMotionKey}`}
                  className="text-xl font-semibold text-[rgb(var(--accent))]"
                >
                  {formatCurrency(product.price)}
                </motion.p>
                <p className="max-w-xl text-base leading-8 text-[rgba(var(--text),0.9)] dark:text-[rgba(245,245,245,0.88)]">
                  {product.description}
                </p>
                {product.specifications?.length ? (
                  <div className="grid gap-3 rounded-[24px] border border-soft bg-[rgba(var(--surface),0.88)] p-4 sm:grid-cols-2 dark:bg-[rgba(var(--surface-muted),0.74)]">
                    {product.specifications.slice(0, 4).map((spec) => (
                      <div key={spec.label}>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-soft">
                          {spec.label}
                        </p>
                        <p className="mt-1.5 text-sm font-semibold">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-soft bg-[rgba(var(--surface),0.76)] p-1">
                    <button
                      type="button"
                      onClick={() => setQty((current) => Math.max(1, current - 1))}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((current) => Math.min(product.stock, current + 1))}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-soft">{product.stock} units in stock</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn-primary w-full rounded-[20px] py-3.5"
                  >
                    Add {qty} to Cart
                  </button>
                  <Link
                    to={productPath}
                    onClick={onClose}
                    className="btn-secondary w-full rounded-[20px] py-3.5 text-center"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default QuickViewModal;
