import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fadeUp, pageVariants } from "../animations/pageVariants";
import AppImage from "../components/AppImage";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import QuickViewModal from "../components/QuickViewModal";
import SectionHeading from "../components/SectionHeading";
import {
  categoryHighlights,
  customerReviews,
  promoHighlights,
} from "../data/highlights";
import {
  getFallbackFeaturedProducts,
  queryFallbackProducts,
} from "../data/fallbackProducts";
import useGsapScenes from "../hooks/useGsapScenes";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { getRecentlyViewedProducts } from "../utils/helpers";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [email, setEmail] = useState("");
  const { notify } = useToast();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const [{ data: bestSellers }, { data: arrivals }] = await Promise.all([
          api.get("/products/featured"),
          api.get("/products", { params: { sort: "newest", limit: 6 } }),
        ]);

        if (!bestSellers.length || !arrivals.products?.length) {
          setFeaturedProducts(getFallbackFeaturedProducts(8));
          setNewArrivals(queryFallbackProducts({ sort: "newest", limit: 6 }).products);
          return;
        }

        setFeaturedProducts(bestSellers);
        setNewArrivals(arrivals.products || []);
      } catch (error) {
        setFeaturedProducts(getFallbackFeaturedProducts(8));
        setNewArrivals(queryFallbackProducts({ sort: "newest", limit: 6 }).products);
      } finally {
        setLoading(false);
      }
    };

    loadHomepageData();
    setRecentlyViewed(getRecentlyViewedProducts());
  }, []);

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      notify({
        title: "Email required",
        message: "Enter your email to subscribe for launches and offers.",
        type: "error",
      });
      return;
    }

    notify({
      title: "Subscribed",
      message: "You will now receive new collection drops and seasonal offers.",
      type: "success",
    });
    setEmail("");
  };

  useGsapScenes(pageRef, ({ gsap, scope }) => {
    const sections = gsap.utils.toArray("[data-gsap='home-section']", scope);

    sections.forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 52,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      });
    });

    const shelves = gsap.utils.toArray("[data-gsap='home-shelf']", scope);

    shelves.forEach((shelf) => {
      gsap.from(shelf, {
        opacity: 0,
        y: 28,
        duration: 0.72,
        ease: "power3.out",
        scrollTrigger: {
          trigger: shelf,
          start: "top 82%",
          once: true,
        },
      });
    });

    const promoPanel = scope.querySelector("[data-gsap='promo-panel']");

    if (promoPanel) {
      gsap.to(promoPanel, {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: promoPanel,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
        },
      });
    }
  }, []);

  return (
    <motion.div
      ref={pageRef}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <HeroSection
        products={featuredProducts.length ? featuredProducts : getFallbackFeaturedProducts(3)}
      />

      <section className="section-shell" id="shop-categories" data-gsap="home-section">
        <div className="surface-card-strong px-5 py-5 sm:px-6 sm:py-6">
          <SectionHeading
            eyebrow="Shop by category"
            title="Browse curated collections designed like premium retail edits."
            description="Explore signature product worlds across luxury clothing, handbags, watches, shoes, and accessories."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => navigate(item.href || `/shop?category=${encodeURIComponent(item.query)}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(item.href || `/shop?category=${encodeURIComponent(item.query)}`);
                  }
                }}
                role="link"
                tabIndex={0}
                className={`group relative min-h-[280px] cursor-pointer overflow-hidden rounded-[20px] border border-soft bg-gradient-to-br ${item.accent} p-0`}
              >
                <AppImage
                  src={item.image}
                  alt={item.title}
                  label={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-5">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Collection</p>
                    <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] text-white">
                      {item.title}
                    </h3>
                    <p className="max-w-md text-sm leading-7 text-white/78">{item.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.spotlightLinks?.map((linkItem) => (
                      <Link
                        key={linkItem.label}
                        to={linkItem.href}
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:bg-white/18"
                      >
                        {linkItem.label}
                      </Link>
                    ))}
                  </div>
                  <Link
                    to={item.href || `/shop?category=${encodeURIComponent(item.query)}`}
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    Shop collection
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell" id="best-sellers" data-gsap="home-section">
        <SectionHeading
          eyebrow="Best sellers"
          title="The most-loved products in the current edit."
          description="A tighter shelf of standout pieces across tailoring, handbags, watches, shoes, and luxury accessories."
          action={
            <Link to="/shop" className="btn-secondary">
              View all products
            </Link>
          }
        />

        <div data-gsap="home-shelf" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)
            : featuredProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  index={index}
                />
              ))}
        </div>
      </section>

      <section className="section-shell" data-gsap="home-section">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.28 }}
          className="surface-card-strong group relative min-h-[400px] overflow-hidden p-0"
        >
          <div data-gsap="promo-panel" className="absolute inset-0">
            <AppImage
              src={promoHighlights[0].image}
              alt={promoHighlights[0].title}
              label={promoHighlights[0].title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/28 to-black/40" />
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center sm:p-8">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex rounded-full bg-white/14 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                Winter Collection
              </span>
              <div className="space-y-2">
                <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                  Up to 40% Off
                </h2>
                <p className="text-base leading-8 text-white/80 sm:text-lg">
                  Discover seasonal layers, sharper tailoring, and premium everyday pieces with a
                  softer winter palette.
                </p>
              </div>
              <Link to={promoHighlights[0].href} className="btn-primary px-7 py-3.5">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-shell" id="new-arrivals" data-gsap="home-section">
        <SectionHeading
          eyebrow="New arrivals"
          title="Fresh pieces just landed."
          description="New drops across premium essentials, statement fashion, and elevated everyday buys."
        />

        <div data-gsap="home-shelf" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)
            : newArrivals.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  index={index}
                  badge="New"
                />
              ))}
        </div>
      </section>

      <section className="section-shell" data-gsap="home-section">
        <SectionHeading
          eyebrow="Testimonials"
          title="What customers are saying."
          description="Short, clear feedback that reinforces product quality and a smooth shopping experience."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {customerReviews.map((review, index) => (
            <motion.div
              key={review.name}
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.08 }}
              className="surface-card px-5 py-5"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-base leading-7 text-main">"{review.quote}"</p>
              <p className="mt-4 text-sm font-semibold">{review.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-shell" data-gsap="home-section">
        <SectionHeading
          eyebrow="Recently viewed"
          title="Products you opened recently."
          description="Your last viewed items are saved locally so you can pick up where you left off."
        />

        {recentlyViewed.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentlyViewed.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="surface-card mt-6 flex flex-col items-start gap-3 px-5 py-6 sm:px-6">
            <p className="max-w-2xl text-soft">
              Browse the catalogue and open a few products to build your recently viewed list.
            </p>
            <Link to="/shop" className="btn-secondary">
              Explore the store
            </Link>
          </div>
        )}
      </section>

      <section className="section-shell" data-gsap="home-section">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="surface-card-strong px-5 py-6 sm:px-6 sm:py-6"
        >
          <SectionHeading
            eyebrow="Newsletter"
            title="Stay updated with new launches, curated drops, and seasonal offers."
            description="Get early access to new arrivals and limited collection releases."
          />

          <form
            onSubmit={handleNewsletterSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-full border border-soft bg-[rgba(var(--surface),0.82)] px-5 py-3.5 text-sm outline-none transition duration-300 placeholder:text-soft focus:border-[rgba(var(--accent),0.45)] focus:shadow-[0_0_0_5px_rgba(var(--accent),0.12)]"
            />
            <button type="submit" className="btn-primary shrink-0 px-6">
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </motion.div>
  );
};

export default HomePage;
