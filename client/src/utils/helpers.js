export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

const RECENT_VIEWED_KEY = "velora-recently-viewed";

const escapeSvgText = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const buildImageFallback = (label = "Velora") => {
  const safeLabel = escapeSvgText(label.trim() || "Velora").slice(0, 42);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1400" role="img" aria-label="${safeLabel}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f1ebe2" />
          <stop offset="52%" stop-color="#e5dbcf" />
          <stop offset="100%" stop-color="#d6c6b8" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="20%" r="72%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="1400" fill="url(#bg)" />
      <rect width="1200" height="1400" fill="url(#glow)" opacity="0.65" />
      <rect x="70" y="70" width="1060" height="1260" rx="56" fill="none" stroke="#8b7355" stroke-opacity="0.18" />
      <text x="600" y="620" fill="#8b7355" font-family="Inter, Arial, sans-serif" font-size="34" letter-spacing="9" text-anchor="middle">VELORA</text>
      <text x="600" y="710" fill="#2a241f" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="600" text-anchor="middle">${safeLabel}</text>
      <text x="600" y="784" fill="#6b6258" font-family="Inter, Arial, sans-serif" font-size="24" letter-spacing="4" text-anchor="middle">Curated luxury edit</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const canonicalProductImages = {
  "Burberry Heritage Cashmere Scarf":
    "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80",
  "Ray-Ban Clubmaster Sunglasses":
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
  "Montblanc Meisterstuck Slim Wallet":
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
  "Ferragamo Gancini Reversible Belt":
    "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1200&q=80",
  "Rolex Submariner Date":
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
  "Omega Seamaster Diver 300M":
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
  "TAG Heuer Carrera Chronograph":
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80",
  "Tissot PRX Powermatic 80":
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1200&q=80",
  "Seiko Presage Cocktail Time":
    "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=1200&q=80",
  "Longines Master Collection Moonphase":
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80",
  "Italian Wool Blazer":
    "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=1200&q=80",
  "Tailored Cotton Poplin Shirt":
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
  "Selvedge Tapered Denim":
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
  "Linen Resort Shirt":
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
  "Italian Suede Overshirt":
    "https://images.pexels.com/photos/19565723/pexels-photo-19565723.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "Silk Slip Evening Dress":
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  "Double-Faced Wool Coat":
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  "Embroidered Silk Kurta Set":
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  "Cashmere Lounge Hoodie":
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
  "Satin Column Midi Dress":
    "https://images.pexels.com/photos/34419272/pexels-photo-34419272.jpeg?cs=srgb&dl=pexels-lii-chun-530693353-34419272.jpg&fm=jpg",
  "Leather Penny Loafers":
    "https://images.pexels.com/photos/31935098/pexels-photo-31935098.jpeg?cs=srgb&dl=pexels-mr-abrar-visuals-2151929345-31935098.jpg&fm=jpg",
  "Suede Runner Sneakers":
    "https://images.pexels.com/photos/8188907/pexels-photo-8188907.jpeg?cs=srgb&dl=pexels-sneepcrew-8188907.jpg&fm=jpg",
  "Chelsea Leather Boots":
    "https://images.pexels.com/photos/35654955/pexels-photo-35654955.jpeg?cs=srgb&dl=pexels-prolificpeople-35654955.jpg&fm=jpg",
  "Guess Luxe Shoulder Bag":
    "https://images.pexels.com/photos/14837855/pexels-photo-14837855.jpeg?cs=srgb&dl=pexels-lutfi-elyas-274851637-14837855.jpg&fm=jpg",
  "Coach Tabby Leather Tote":
    "https://images.pexels.com/photos/30975791/pexels-photo-30975791.jpeg?cs=srgb&dl=pexels-laarkstudio-30975791.jpg&fm=jpg",
  "Michael Kors Jet Set Satchel":
    "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?cs=srgb&dl=pexels-geyonk-1152077.jpg&fm=jpg",
};

export const getPreferredImageSrc = (src, label = "") => {
  const normalizedLabel = String(label || "").trim();

  if (normalizedLabel && canonicalProductImages[normalizedLabel]) {
    return canonicalProductImages[normalizedLabel];
  }

  return src;
};

export const buildGuestCart = (items) => {
  const mappedItems = items.map((item) => ({
    product: item.product,
    qty: item.qty,
    subtotal: item.product.price * item.qty,
  }));

  return {
    items: mappedItems,
    itemCount: mappedItems.reduce((sum, item) => sum + item.qty, 0),
    subtotal: mappedItems.reduce((sum, item) => sum + item.subtotal, 0),
  };
};

export const wait = (duration = 250) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

export const getRecentlyViewedProducts = () => {
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_VIEWED_KEY) || "[]");
  } catch (error) {
    return [];
  }
};

export const saveRecentlyViewedProduct = (product) => {
  if (!product?._id) {
    return;
  }

  const snapshot = {
    _id: product._id,
    name: product.name,
    price: product.price,
    image: getPreferredImageSrc(product.image, product.name),
    rating: product.rating,
    numReviews: product.numReviews,
    category: product.category,
    stock: product.stock,
  };

  const current = getRecentlyViewedProducts().filter((item) => item._id !== product._id);
  const next = [snapshot, ...current].slice(0, 3);
  window.localStorage.setItem(RECENT_VIEWED_KEY, JSON.stringify(next));
};
