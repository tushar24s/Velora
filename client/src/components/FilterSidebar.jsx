import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const sortOptions = [
  { label: "Popularity", value: "popularity" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
];

const categoryIcons = {
  All: "✦",
  Shoes: "👟",
  Accessories: "🕶",
  "Luxury Watches": "⌚",
  "Luxury Bags": "👜",
  "Men's Clothing": "🧥",
  "Women's Clothing": "👗",
};

const FilterSidebar = ({ categories, filters, setFilters, onClear, onCategoryChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const panel = (
    <div className="shop-hero-card surface-card space-y-5 p-4 sm:p-5">
      <div className="space-y-3">
        <p className="text-sm font-semibold">Category</p>
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                onCategoryChange
                  ? onCategoryChange(category)
                  : setFilters((current) => ({ ...current, category }))
              }
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition sm:px-4 ${
                filters.category === category
                  ? "bg-[rgb(var(--accent))] text-white"
                  : "border border-soft bg-[rgba(var(--surface),0.7)] text-main"
              }`}
            >
              <span>{categoryIcons[category] || "✦"}</span>
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Minimum price</span>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(event) =>
              setFilters((current) => ({ ...current, minPrice: event.target.value }))
            }
            placeholder="0"
            className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.8)] px-4 py-3 outline-none transition focus:border-[rgba(var(--accent),0.44)]"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-semibold">Maximum price</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters((current) => ({ ...current, maxPrice: event.target.value }))
            }
            placeholder="70000"
            className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.8)] px-4 py-3 outline-none transition focus:border-[rgba(var(--accent),0.44)]"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm">
        <span className="font-semibold">Sort by</span>
        <select
          value={filters.sort}
          onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
          className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.8)] px-4 py-3 outline-none transition focus:border-[rgba(var(--accent),0.44)]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button type="button" onClick={onClear} className="btn-secondary w-full justify-center">
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setMobileOpen((current) => !current)}
        className="surface-card flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold lg:hidden"
      >
        Filters
        <SlidersHorizontal className="h-4 w-4" />
      </button>

      <div className="hidden lg:block">{panel}</div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden lg:hidden"
          >
            {panel}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default FilterSidebar;
