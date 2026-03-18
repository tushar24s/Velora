import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import AppImage from "../components/AppImage";
import { getPreferredImageSrc } from "../utils/helpers";

const CartMotionContext = createContext(null);

const getImageNode = (sourceEl) => {
  if (!sourceEl) {
    return null;
  }

  if (sourceEl instanceof HTMLImageElement) {
    return sourceEl;
  }

  return sourceEl.querySelector?.("img") || null;
};

export const CartMotionProvider = ({ children }) => {
  const [cartIconElement, setCartIconElement] = useState(null);
  const [cartPulseToken, setCartPulseToken] = useState(0);
  const [flyingItems, setFlyingItems] = useState([]);

  const registerCartIcon = useCallback((element) => {
    setCartIconElement(element || null);
  }, []);

  const pulseCart = useCallback(() => {
    setCartPulseToken((current) => current + 1);
  }, []);

  const clearFlight = useCallback(
    (flightId) => {
      setFlyingItems((current) => current.filter((item) => item.id !== flightId));
      pulseCart();
    },
    [pulseCart]
  );

  const animateAddToCart = useCallback(
    ({ sourceEl, imageSrc = "", label = "Product" } = {}) => {
      const imageNode = getImageNode(sourceEl);
      const sourceRect = imageNode?.getBoundingClientRect();
      const cartRect = cartIconElement?.getBoundingClientRect();

      if (!sourceRect || !cartRect) {
        pulseCart();
        return;
      }

      const id = crypto.randomUUID();
      const borderRadius = window.getComputedStyle(imageNode).borderRadius || "24px";

      setFlyingItems((current) => [
        ...current,
        {
          id,
          src: getPreferredImageSrc(imageSrc || imageNode.currentSrc || imageNode.src, label),
          label,
          from: {
            x: sourceRect.left,
            y: sourceRect.top,
            width: sourceRect.width,
            height: sourceRect.height,
            borderRadius,
          },
          to: {
            x: cartRect.left + cartRect.width / 2 - 22,
            y: cartRect.top + cartRect.height / 2 - 22,
            width: 44,
            height: 44,
          },
        },
      ]);

      window.setTimeout(() => clearFlight(id), 620);
    },
    [cartIconElement, clearFlight, pulseCart]
  );

  const value = useMemo(
    () => ({
      animateAddToCart,
      cartPulseToken,
      registerCartIcon,
    }),
    [animateAddToCart, cartPulseToken, registerCartIcon]
  );

  return (
    <CartMotionContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-0 z-[96] overflow-hidden">
        <AnimatePresence>
          {flyingItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{
                x: item.from.x,
                y: item.from.y,
                width: item.from.width,
                height: item.from.height,
                opacity: 1,
                scale: 1,
                rotate: 0,
                borderRadius: item.from.borderRadius,
              }}
              animate={{
                x: item.to.x,
                y: item.to.y,
                width: item.to.width,
                height: item.to.height,
                opacity: [1, 1, 0.32],
                scale: 0.34,
                rotate: -10,
                borderRadius: "999px",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 overflow-hidden border border-white/18 shadow-[0_24px_64px_-28px_rgba(0,0,0,0.42)]"
            >
              <AppImage
                src={item.src}
                alt={item.label}
                label={item.label}
                className="h-full w-full object-cover"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </CartMotionContext.Provider>
  );
};

export const useCartMotion = () => {
  const context = useContext(CartMotionContext);

  if (!context) {
    throw new Error("useCartMotion must be used within CartMotionProvider");
  }

  return context;
};
