import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import AppImage from "./AppImage";

const SearchSuggestions = ({ value, onChange, suggestions, onSelect, isFocused, onFocus, onBlur }) => (
  <div className="relative">
    <div className="shop-search-shell surface-card flex items-center gap-4 px-6">
      <Search className="h-5 w-5 text-soft" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search products, categories, or use cases"
        className="w-full bg-transparent text-sm outline-none placeholder:text-soft"
      />
    </div>

    <AnimatePresence>
      {isFocused && value && suggestions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="surface-card absolute inset-x-0 top-[calc(100%+10px)] z-20 overflow-hidden shadow-[0_18px_42px_-28px_rgba(0,0,0,0.18)]"
        >
          {suggestions.map((product) => (
            <button
              key={product._id}
              type="button"
              onMouseDown={() => onSelect(product.name)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[rgba(var(--surface-muted),0.85)]"
            >
              <AppImage
                src={product.image}
                alt={product.name}
                label={product.name}
                className="h-11 w-11 rounded-2xl object-cover"
              />
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-soft">{product.category}</p>
              </div>
            </button>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  </div>
);

export default SearchSuggestions;
