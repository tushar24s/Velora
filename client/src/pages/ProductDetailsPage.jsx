import { motion } from "framer-motion";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { pageVariants } from "../animations/pageVariants";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import RatingStars from "../components/RatingStars";
import SectionHeading from "../components/SectionHeading";
import {
  getFallbackProductById,
  getFallbackRelatedProducts,
} from "../data/fallbackProducts";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCartMotion } from "../context/CartMotionContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { formatCurrency } from "../utils/currency";
import { getErrorMessage, saveRecentlyViewedProduct } from "../utils/helpers";
import AppImage from "../components/AppImage";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { animateAddToCart } = useCartMotion();
  const { user, isWishlisted, toggleWishlist } = useAuth();
  const { notify } = useToast();
  const primaryImageRef = useRef(null);
  const motionKey = product?.slug || product?._id || id;

  const loadProduct = async () => {
    setLoading(true);

    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setRelatedProducts(data.relatedProducts);
      setSelectedImage(data.product.images?.[0] || data.product.image);
      setQty(1);
    } catch (error) {
      const fallbackProduct = getFallbackProductById(id);

      if (fallbackProduct) {
        setProduct(fallbackProduct);
        setRelatedProducts(getFallbackRelatedProducts(fallbackProduct));
        setSelectedImage(fallbackProduct.images?.[0] || fallbackProduct.image);
        setQty(1);
      } else {
        setProduct(null);
        setRelatedProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      saveRecentlyViewedProduct(product);
    }
  }, [product]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmittingReview(true);
      await api.post(`/products/${id}/reviews`, review);
      notify({
        title: "Review posted",
        message: "Thanks for sharing your feedback.",
        type: "success",
      });
      setReview({ rating: 5, comment: "" });
      await loadProduct();
    } catch (error) {
      notify({
        title: "Review failed",
        message: getErrorMessage(error),
        type: "error",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

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
    }
  };

  if (loading) {
    return (
      <div className="section-shell grid gap-6 lg:grid-cols-[1fr_1fr]">
        <ProductSkeleton />
        <ProductSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-shell">
        <div className="surface-card px-6 py-10 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">
            Product not found
          </h2>
          <p className="mt-3 text-soft">The product you requested is not available right now.</p>
          <Link to="/shop" className="btn-primary mt-6">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="section-shell space-y-10 sm:space-y-14"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -18, scale: 0.98 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8"
      >
        <div className="space-y-4">
          <div className="surface-card-strong overflow-hidden p-3 sm:p-4">
            <motion.div
              layoutId={`product-media-${motionKey}`}
              className="overflow-hidden rounded-[20px] bg-[rgba(var(--surface-muted),0.85)] sm:rounded-[28px]"
            >
              <AppImage
                ref={primaryImageRef}
                src={selectedImage}
                alt={product.name}
                label={product.name}
                className="aspect-[4/4.6] w-full object-cover"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(product.images?.length ? product.images : [product.image]).map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`surface-card overflow-hidden p-2 ${
                  selectedImage === image ? "ring-2 ring-[rgb(var(--accent))]" : ""
                }`}
              >
                <AppImage
                  src={image}
                  alt={product.name}
                  label={product.name}
                  className="aspect-square w-full rounded-[18px] object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="surface-card-strong px-4 py-5 sm:px-8 sm:py-8">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[rgba(var(--accent),0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--accent))]">
                {product.category}
              </span>
              <span className="rounded-full border border-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-soft">
                {product.brand}
              </span>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-2.5">
                <motion.h1
                  layoutId={`product-title-${motionKey}`}
                  className="font-display text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl"
                >
                  {product.name}
                </motion.h1>
                <RatingStars rating={product.rating} reviews={product.numReviews} />
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product._id)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-soft bg-[rgba(var(--surface),0.76)]"
              >
                <Heart className={`h-5 w-5 ${isWishlisted(product._id) ? "fill-current text-rose-500" : ""}`} />
              </button>
            </div>

            <motion.p
              layoutId={`product-price-${motionKey}`}
              className="text-2xl font-semibold text-[rgb(var(--accent))]"
            >
              {formatCurrency(product.price)}
            </motion.p>
            <p className="text-sm leading-7 text-soft sm:text-base sm:leading-8">
              {product.description}
            </p>

            <div className="grid gap-3 rounded-[20px] border border-soft bg-[rgba(var(--surface),0.64)] p-4 sm:grid-cols-3 sm:rounded-[26px] sm:p-5">
              {product.specifications?.map((spec) => (
                <div key={spec.label}>
                  <p className="text-xs uppercase tracking-[0.16em] text-soft">{spec.label}</p>
                  <p className="mt-2 text-sm font-semibold">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="inline-flex items-center rounded-full border border-soft bg-[rgba(var(--surface),0.76)] p-1">
                <button
                  type="button"
                  onClick={() => setQty((current) => Math.max(1, current - 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-12 text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((current) => Math.min(product.stock, current + 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-primary flex-1 justify-center rounded-[20px] py-3.5"
              >
                Add to Cart
              </button>
            </div>

            <div className="rounded-[24px] border border-soft bg-[rgba(var(--surface),0.62)] px-5 py-4">
              <p className="text-sm text-soft">
                <span className="font-semibold text-main">{product.stock}</span> pieces available.
                Shipping is free above ₹4,999 and paid orders are marked instantly in the order flow.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:gap-8">
        <div className="surface-card-strong px-4 py-5 sm:px-8 sm:py-8">
          <SectionHeading
            eyebrow="Ratings & reviews"
            title="Feedback designed to feel like a real store, not placeholder content."
            description="Seeded reviews make the product detail view feel complete, and authenticated users can post their own rating."
          />

          <div className="mt-6 space-y-4 sm:mt-8">
            {product.reviews?.length ? (
              product.reviews.map((item) => (
                <div key={item._id || `${item.name}-${item.comment}`} className="surface-card px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-soft">
                        {new Date(item.createdAt || Date.now()).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {item.rating}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-soft">{item.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-soft">No reviews yet.</p>
            )}
          </div>
        </div>

        <div className="surface-card-strong px-4 py-5 sm:px-8 sm:py-8">
          <SectionHeading
            eyebrow="Leave a review"
            title={user ? "Share your product experience." : "Sign in to review this product."}
            description="Authenticated reviews are saved through the backend and update product ratings."
          />

          {user ? (
            <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4 sm:mt-8">
              <label className="block space-y-2 text-sm">
                <span className="font-semibold">Rating</span>
                <select
                  value={review.rating}
                  onChange={(event) =>
                    setReview((current) => ({ ...current, rating: Number(event.target.value) }))
                  }
                  className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.78)] px-4 py-3 outline-none"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} stars
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2 text-sm">
                <span className="font-semibold">Comment</span>
                <textarea
                  rows="5"
                  value={review.comment}
                  onChange={(event) =>
                    setReview((current) => ({ ...current, comment: event.target.value }))
                  }
                  required
                  className="w-full rounded-[24px] border border-soft bg-[rgba(var(--surface),0.78)] px-4 py-3 outline-none"
                  placeholder="Write a concise, useful review."
                />
              </label>

              <button type="submit" disabled={submittingReview} className="btn-primary w-full">
                {submittingReview ? "Posting review..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <Link to="/login" className="btn-primary mt-8 inline-flex">
              Sign in to review
            </Link>
          )}
        </div>
      </div>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Related products"
          title="More products from the same collection."
          description="Related items use the same card system, hover motion, and add-to-cart actions as the primary storefront."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.map((relatedProduct, index) => (
            <ProductCard key={relatedProduct._id} product={relatedProduct} index={index} />
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default ProductDetailsPage;
