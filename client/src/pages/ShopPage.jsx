import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fadeUp, pageVariants } from "../animations/pageVariants";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import QuickViewModal from "../components/QuickViewModal";
import SearchSuggestions from "../components/SearchSuggestions";
import {
  getFallbackCategories,
  queryFallbackProducts,
} from "../data/fallbackProducts";
import api from "../utils/api";
import useDebounce from "../hooks/useDebounce";
import useGsapScenes from "../hooks/useGsapScenes";

const defaultFilters = {
  category: "All",
  minPrice: "",
  maxPrice: "",
  sort: "popularity",
  search: "",
};

const categoryIcons = {
  All: "✦",
  Shoes: "👟",
  Accessories: "🕶",
  "Luxury Watches": "⌚",
  "Luxury Bags": "👜",
  "Men's Clothing": "🧥",
  "Women's Clothing": "👗",
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [products, setProducts] = useState([]);
  const [catalogue, setCatalogue] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const pageRef = useRef(null);

  const deferredSearch = useDeferredValue(filters.search);
  const debouncedSearch = useDebounce(deferredSearch, 260);

  useEffect(() => {
    const category = searchParams.get("category") || "All";
    const search = searchParams.get("search") || "";

    setFilters((current) => ({
      ...current,
      category,
      search,
    }));
  }, [searchParams]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [{ data: categoriesData }, { data: catalogueData }] = await Promise.all([
          api.get("/products/categories"),
          api.get("/products", { params: { limit: 30, sort: "popularity" } }),
        ]);

        if (!categoriesData.length || !catalogueData.products?.length) {
          const fallbackData = queryFallbackProducts({ limit: 30, sort: "popularity" });
          setUseFallback(true);
          setCategories(getFallbackCategories());
          setCatalogue(fallbackData.products);
          return;
        }

        setUseFallback(false);
        setCategories(categoriesData);
        setCatalogue(catalogueData.products);
      } catch (error) {
        const fallbackData = queryFallbackProducts({ limit: 30, sort: "popularity" });
        setUseFallback(true);
        setCategories(getFallbackCategories());
        setCatalogue(fallbackData.products);
      }
    };

    loadMeta();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      try {
        const fallbackData = queryFallbackProducts({
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort,
          search: debouncedSearch,
          limit: 24,
        });

        if (useFallback) {
          setProducts(fallbackData.products);
          return;
        }

        const params = {
          sort: filters.sort,
          limit: 24,
        };

        if (filters.category && filters.category !== "All") {
          params.category = filters.category;
        }

        if (filters.minPrice) {
          params.minPrice = filters.minPrice;
        }

        if (filters.maxPrice) {
          params.maxPrice = filters.maxPrice;
        }

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        const { data } = await api.get("/products", { params });

        if (!data.products?.length && fallbackData.products.length > 0) {
          setUseFallback(true);
          setCategories(getFallbackCategories());
          setCatalogue(queryFallbackProducts({ limit: 30, sort: "popularity" }).products);
          setProducts(fallbackData.products);
          return;
        }

        setProducts(data.products || []);
      } catch (error) {
        const fallbackData = queryFallbackProducts({
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort,
          search: debouncedSearch,
          limit: 24,
        });
        setUseFallback(true);
        setCategories(getFallbackCategories());
        setCatalogue(queryFallbackProducts({ limit: 30, sort: "popularity" }).products);
        setProducts(fallbackData.products);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, filters.category, filters.maxPrice, filters.minPrice, filters.sort, useFallback]);

  const suggestions = catalogue
    .filter((product) => product.name.toLowerCase().includes(deferredSearch.toLowerCase()))
    .slice(0, 5);

  const handleCategoryChange = (category) => {
    setFilters((current) => ({ ...current, category }));
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);

      if (category && category !== "All") {
        updated.set("category", category);
      } else {
        updated.delete("category");
      }

      return updated;
    });
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  useGsapScenes(pageRef, ({ gsap, scope }) => {
    gsap.from("[data-gsap='shop-hero-copy']", {
      opacity: 0,
      y: 34,
      duration: 0.88,
      ease: "power3.out",
    });

    gsap.from("[data-gsap='shop-hero-panel']", {
      opacity: 0,
      y: 30,
      scale: 0.985,
      duration: 0.86,
      delay: 0.08,
      ease: "power3.out",
    });

    gsap.from("[data-gsap='shop-search']", {
      opacity: 0,
      y: 18,
      duration: 0.64,
      delay: 0.18,
      ease: "power2.out",
    });

    gsap.from("[data-gsap='shop-chip']", {
      opacity: 0,
      y: 14,
      stagger: 0.04,
      duration: 0.44,
      delay: 0.24,
      ease: "power2.out",
    });

    const hero = scope.querySelector("[data-gsap='shop-hero']");
    const filter = scope.querySelector("[data-gsap='shop-filter']");
    const results = scope.querySelector("[data-gsap='shop-results']");

    if (hero) {
      gsap.to(hero, {
        yPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    if (filter) {
      gsap.from(filter, {
        opacity: 0,
        x: -32,
        duration: 0.78,
        ease: "power3.out",
        scrollTrigger: {
          trigger: filter,
          start: "top 82%",
          once: true,
        },
      });
    }

    if (results) {
      gsap.from(results, {
        opacity: 0,
        y: 38,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: results,
          start: "top 84%",
          once: true,
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
      className="section-shell space-y-8 sm:space-y-10"
    >
      <div
        data-gsap="shop-hero"
        className="shop-hero-card surface-card-strong overflow-hidden px-4 py-5 sm:px-8 sm:py-10"
      >
        <div className="grid gap-5 lg:gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div data-gsap="shop-hero-copy" className="space-y-5">
            <span className="eyebrow">Storefront</span>
            <div className="space-y-4">
              <h1 className="shop-hero-title max-w-4xl">
                Browse a realistic Indian eCommerce catalogue with live filters and premium motion.
              </h1>
              <p className="max-w-[520px] text-base leading-8 text-soft sm:text-lg">
                Search, filter, and discover curated products through a more editorial shopping
                flow with richer hover states, quick actions, and tactile interactions.
              </p>
            </div>
          </div>

          <div
            data-gsap="shop-hero-panel"
            className="glass-orbit rounded-[20px] p-4 sm:rounded-[28px] sm:p-5"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-soft">Trending now</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em]">
              Rolex, Burberry, Coach, handbags, and elevated essentials.
            </h2>
            <p className="mt-3 text-sm leading-7 text-soft">
              Use the category strip below to jump straight into watches, shoes, bags, accessories,
              and premium clothing edits.
            </p>
            <Link to="/" className="btn-secondary mt-5 w-fit gap-2">
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div data-gsap="shop-search" className="mt-6">
          <SearchSuggestions
            value={filters.search}
            onChange={(value) => {
              setFilters((current) => ({ ...current, search: value }));
              setSearchParams((current) => {
                const updated = new URLSearchParams(current);

                if (value) {
                  updated.set("search", value);
                } else {
                  updated.delete("search");
                }

                return updated;
              });
            }}
            suggestions={suggestions}
            onSelect={(value) => {
              setFilters((current) => ({ ...current, search: value }));
              setShowSuggestions(false);
              setSearchParams((current) => {
                const updated = new URLSearchParams(current);
                updated.set("search", value);
                return updated;
              });
            }}
            isFocused={showSuggestions}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
          />
        </div>

        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-2 sm:mt-6 sm:gap-3">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              data-gsap="shop-chip"
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 text-sm font-semibold transition duration-300 sm:px-4 ${
                filters.category === category
                  ? "border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.16)] text-main"
                  : "border-soft bg-[rgba(var(--surface),0.68)] text-soft hover:border-[rgba(var(--accent),0.32)] hover:text-main"
              }`}
            >
              <span>{categoryIcons[category] || "✦"}</span>
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <div data-gsap="shop-filter">
          <FilterSidebar
            categories={categories}
            filters={filters}
            setFilters={setFilters}
            onClear={handleClear}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div data-gsap="shop-results" className="space-y-4 sm:space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-soft">
              {loading ? "Loading products..." : `${products.length} products available`}
            </p>
            <div className="flex flex-wrap gap-2">
              {filters.category !== "All" ? (
                <span className="rounded-full bg-[rgba(var(--accent),0.12)] px-4 py-2 text-xs font-semibold text-[rgb(var(--accent))]">
                  {filters.category}
                </span>
              ) : null}
              {debouncedSearch ? (
                <span className="rounded-full bg-[rgba(var(--accent),0.12)] px-4 py-2 text-xs font-semibold text-[rgb(var(--accent))]">
                  Search: {debouncedSearch}
                </span>
              ) : null}
            </div>
          </div>

          <div
            key={`grid-${filters.category}-${filters.sort}-${debouncedSearch}-${filters.minPrice}-${filters.maxPrice}`}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)
              : products.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                    index={index}
                  />
                ))}
          </div>

          {!loading && products.length === 0 ? (
            <div className="surface-card px-6 py-10 text-center">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em]">
                No products matched these filters
              </h3>
              <p className="mt-3 text-soft">
                Try clearing your search or switching to another category.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </motion.div>
  );
};

export default ShopPage;
