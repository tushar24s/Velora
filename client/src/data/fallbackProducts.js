const baseReviews = [
  {
    _id: "review-1",
    name: "Rahul Sharma",
    rating: 5,
    comment: "Excellent finish, clean packaging, and a premium in-hand feel.",
    createdAt: "2026-02-10T00:00:00.000Z",
  },
  {
    _id: "review-2",
    name: "Priya Kapoor",
    rating: 4,
    comment: "Looks polished, feels reliable, and matches the listing well.",
    createdAt: "2026-02-18T00:00:00.000Z",
  },
];

const catalog = [
  {
    _id: "burberry-check-cashmere-scarf",
    name: "Burberry Heritage Cashmere Scarf",
    brand: "Burberry",
    price: 45999,
    category: "Accessories",
    rating: 4.8,
    stock: 18,
    popularity: 90,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80",
    description: "Burberry cashmere scarf with signature check pattern and a soft winter-luxury finish.",
    tags: ["luxury accessory", "scarf", "burberry", "cashmere"],
    specifications: [
      { label: "Material", value: "Cashmere" },
      { label: "Pattern", value: "Signature check" },
      { label: "Use", value: "Cold-season layering" },
    ],
  },
  {
    _id: "ray-ban-clubmaster-sunglasses",
    name: "Ray-Ban Clubmaster Sunglasses",
    brand: "Ray-Ban",
    price: 15999,
    category: "Accessories",
    rating: 4.6,
    stock: 24,
    popularity: 87,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    description: "Ray-Ban Clubmaster sunglasses with a timeless browline silhouette and polished premium finish.",
    tags: ["luxury accessory", "sunglasses", "ray-ban", "eyewear"],
    specifications: [
      { label: "Frame", value: "Browline acetate-metal" },
      { label: "Lens", value: "UV protective" },
      { label: "Style", value: "Classic eyewear" },
    ],
  },
  {
    _id: "montblanc-meisterstuck-wallet",
    name: "Montblanc Meisterstuck Slim Wallet",
    brand: "Montblanc",
    price: 28999,
    category: "Accessories",
    rating: 4.7,
    stock: 16,
    popularity: 84,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
    description: "Montblanc leather wallet with refined stitching, sleek profile, and everyday executive polish.",
    tags: ["luxury accessory", "wallet", "montblanc", "leather"],
    specifications: [
      { label: "Material", value: "Full-grain leather" },
      { label: "Layout", value: "6-card interior" },
      { label: "Style", value: "Slim wallet" },
    ],
  },
  {
    _id: "ferragamo-reversible-leather-belt",
    name: "Ferragamo Gancini Reversible Belt",
    brand: "Ferragamo",
    price: 32999,
    category: "Accessories",
    rating: 4.7,
    stock: 14,
    popularity: 85,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1200&q=80",
    description: "Ferragamo reversible leather belt with iconic hardware and a clean luxury wardrobe finish.",
    tags: ["luxury accessory", "belt", "ferragamo", "leather"],
    specifications: [
      { label: "Material", value: "Calf leather" },
      { label: "Feature", value: "Reversible strap" },
      { label: "Hardware", value: "Signature buckle" },
    ],
  },
  {
    _id: "rolex-datejust-36",
    name: "Rolex Submariner Date",
    brand: "Rolex",
    price: 899000,
    category: "Luxury Watches",
    rating: 4.9,
    stock: 8,
    popularity: 95,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    description: "Rolex dive icon with ceramic bezel, oyster bracelet, and enduring collector status.",
    tags: ["luxury watch", "rolex", "automatic", "diver"],
    specifications: [
      { label: "Movement", value: "Automatic" },
      { label: "Case", value: "41mm Oystersteel" },
      { label: "Bracelet", value: "Oyster" },
      { label: "Feature", value: "300m water resistance" },
    ],
  },
  {
    _id: "omega-seamaster-diver-300m",
    name: "Omega Seamaster Diver 300M",
    brand: "Omega",
    price: 589999,
    category: "Luxury Watches",
    rating: 4.8,
    stock: 9,
    popularity: 92,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
    description: "Omega dive watch with wave dial, ceramic bezel, and a sharp luxury sports profile.",
    tags: ["premium watch", "luxury watch", "omega", "diver"],
    specifications: [
      { label: "Movement", value: "Co-Axial Master Chronometer" },
      { label: "Case", value: "42mm stainless steel" },
      { label: "Feature", value: "300m water resistance" },
    ],
  },
  {
    _id: "tag-heuer-carrera-chronograph",
    name: "TAG Heuer Carrera Chronograph",
    brand: "TAG Heuer",
    price: 449999,
    category: "Luxury Watches",
    rating: 4.6,
    stock: 7,
    popularity: 88,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80",
    description: "TAG Heuer chronograph with motorsport heritage, tachymeter cues, and a confident steel case.",
    tags: ["premium watch", "luxury watch", "tag heuer", "chronograph"],
    specifications: [
      { label: "Movement", value: "Automatic chronograph" },
      { label: "Case", value: "39mm steel" },
      { label: "Dial", value: "Tri-compax layout" },
    ],
  },
  {
    _id: "tissot-prx-powermatic-80",
    name: "Tissot PRX Powermatic 80",
    brand: "Tissot",
    price: 64500,
    category: "Luxury Watches",
    rating: 4.5,
    stock: 18,
    popularity: 85,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=1200&q=80",
    description: "Tissot integrated-bracelet sports watch with textured dial and Swiss automatic movement.",
    tags: ["premium watch", "swiss watch", "tissot", "automatic"],
    specifications: [
      { label: "Movement", value: "Powermatic 80" },
      { label: "Bracelet", value: "Integrated steel bracelet" },
      { label: "Style", value: "1970s sports-luxury" },
    ],
  },
  {
    _id: "seiko-presage-cocktail-time",
    name: "Seiko Presage Cocktail Time",
    brand: "Seiko",
    price: 52000,
    category: "Luxury Watches",
    rating: 4.4,
    stock: 20,
    popularity: 82,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=1200&q=80",
    description: "Seiko dress watch with a radiant dial, domed crystal, and polished cocktail-inspired detailing.",
    tags: ["premium watch", "dress watch", "seiko", "automatic"],
    specifications: [
      { label: "Movement", value: "Automatic" },
      { label: "Dial", value: "Sunburst textured finish" },
      { label: "Style", value: "Dress watch" },
    ],
  },
  {
    _id: "longines-master-collection-moonphase",
    name: "Longines Master Collection Moonphase",
    brand: "Longines",
    price: 329999,
    category: "Luxury Watches",
    rating: 4.7,
    stock: 10,
    popularity: 86,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80",
    description: "Longines moonphase watch with classical detailing, silver dial, and refined complication work.",
    tags: ["premium watch", "luxury watch", "longines", "moonphase"],
    specifications: [
      { label: "Movement", value: "Automatic moonphase" },
      { label: "Case", value: "40mm stainless steel" },
      { label: "Style", value: "Classical dress complication" },
    ],
  },
  {
    _id: "mens-winter-jacket",
    name: "Italian Wool Blazer",
    brand: "Atelier Milano",
    price: 26999,
    category: "Men's Clothing",
    rating: 4.4,
    stock: 50,
    popularity: 79,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=1200&q=80",
    description: "Italian wool blazer with soft structure, sharp lapels, and refined tailoring for elevated daily wear.",
    tags: ["luxury menswear", "blazer", "tailoring", "wool"],
    specifications: [
      { label: "Fabric", value: "Italian wool blend" },
      { label: "Fit", value: "Tailored" },
      { label: "Style", value: "Single-breasted blazer" },
    ],
  },
  {
    _id: "casual-cotton-shirt",
    name: "Tailored Cotton Poplin Shirt",
    brand: "Maison Ligne",
    price: 9999,
    category: "Men's Clothing",
    rating: 4.3,
    stock: 60,
    popularity: 72,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
    description: "Tailored poplin shirt with crisp structure, smooth hand feel, and understated luxury proportions.",
    tags: ["luxury menswear", "shirt", "poplin", "tailoring"],
    specifications: [
      { label: "Fabric", value: "Premium cotton poplin" },
      { label: "Fit", value: "Tailored" },
      { label: "Detail", value: "Mother-of-pearl buttons" },
    ],
  },
  {
    _id: "slim-fit-denim-jeans",
    name: "Selvedge Tapered Denim",
    brand: "Blue Atelier",
    price: 12999,
    category: "Men's Clothing",
    rating: 4.5,
    stock: 45,
    popularity: 74,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
    description: "Selvedge denim with a clean tapered leg, structured handle, and premium everyday versatility.",
    tags: ["luxury menswear", "jeans", "denim", "selvedge"],
    specifications: [
      { label: "Fit", value: "Tapered" },
      { label: "Fabric", value: "Selvedge denim" },
      { label: "Rise", value: "Mid-rise" },
    ],
  },
  {
    _id: "summer-linen-shirt",
    name: "Linen Resort Shirt",
    brand: "Aera",
    price: 8999,
    category: "Men's Clothing",
    rating: 4.4,
    stock: 40,
    popularity: 76,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
    description: "Relaxed linen resort shirt cut for warm-weather dressing with soft drape and a clean luxury finish.",
    tags: ["luxury menswear", "shirt", "linen", "resort"],
    specifications: [
      { label: "Fabric", value: "European linen" },
      { label: "Mood", value: "Resort dressing" },
      { label: "Collar", value: "Open collar" },
    ],
  },
  {
    _id: "mens-premium-overshirt",
    name: "Italian Suede Overshirt",
    brand: "Atelier Form",
    price: 21999,
    category: "Men's Clothing",
    rating: 4.5,
    stock: 34,
    popularity: 77,
    featured: false,
    image:
      "https://images.pexels.com/photos/19565723/pexels-photo-19565723.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Italian suede overshirt with structured drape, tactile finish, and refined transitional layering appeal.",
    tags: ["luxury menswear", "overshirt", "suede", "layering"],
    specifications: [
      { label: "Material", value: "Italian suede" },
      { label: "Fit", value: "Relaxed straight fit" },
      { label: "Style", value: "Layer-ready overshirt" },
    ],
  },
  {
    _id: "floral-summer-dress",
    name: "Silk Slip Evening Dress",
    brand: "Bloom Atelier",
    price: 18999,
    category: "Women's Clothing",
    rating: 4.6,
    stock: 35,
    popularity: 78,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    description: "Silk slip evening dress with fluid drape, luminous sheen, and refined occasion-ready elegance.",
    tags: ["luxury womenswear", "dress", "silk", "evening"],
    specifications: [
      { label: "Length", value: "Midi" },
      { label: "Fabric", value: "Silk blend" },
      { label: "Style", value: "Evening dress" },
    ],
  },
  {
    _id: "womens-winter-coat",
    name: "Double-Faced Wool Coat",
    brand: "Maison Edit",
    price: 32999,
    category: "Women's Clothing",
    rating: 4.5,
    stock: 25,
    popularity: 81,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    description: "Double-faced wool coat with clean lines, longline shape, and a softly structured luxury finish.",
    tags: ["luxury womenswear", "coat", "wool", "tailoring"],
    specifications: [
      { label: "Fit", value: "Longline" },
      { label: "Fabric", value: "Double-faced wool" },
      { label: "Use", value: "Winter layering" },
    ],
  },
  {
    _id: "ethnic-kurti-set",
    name: "Embroidered Silk Kurta Set",
    brand: "Aangan Atelier",
    price: 14999,
    category: "Women's Clothing",
    rating: 4.4,
    stock: 40,
    popularity: 75,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    description: "Embroidered silk kurta set with refined detailing, fluid comfort, and elevated occasion dressing.",
    tags: ["luxury womenswear", "kurta", "silk", "occasion"],
    specifications: [
      { label: "Set", value: "Kurti + trousers" },
      { label: "Fabric", value: "Silk blend" },
      { label: "Style", value: "Occasion wear" },
    ],
  },
  {
    _id: "oversized-hoodie",
    name: "Cashmere Lounge Hoodie",
    brand: "Common Form",
    price: 12999,
    category: "Women's Clothing",
    rating: 4.5,
    stock: 30,
    popularity: 73,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
    description: "Cashmere lounge hoodie with relaxed volume, soft handle, and understated premium comfort.",
    tags: ["luxury womenswear", "hoodie", "cashmere", "lounge"],
    specifications: [
      { label: "Fabric", value: "Cashmere blend" },
      { label: "Fit", value: "Oversized" },
      { label: "Use", value: "Luxury loungewear" },
    ],
  },
  {
    _id: "womens-satin-midi-dress",
    name: "Satin Column Midi Dress",
    brand: "Maison Soft",
    price: 16999,
    category: "Women's Clothing",
    rating: 4.6,
    stock: 24,
    popularity: 82,
    featured: false,
    image:
      "https://images.pexels.com/photos/34419272/pexels-photo-34419272.jpeg?cs=srgb&dl=pexels-lii-chun-530693353-34419272.jpg&fm=jpg",
    description: "Satin column dress with clean lines, fluid sheen, and an elegant silhouette for evening occasions.",
    tags: ["luxury womenswear", "dress", "satin", "occasion wear"],
    specifications: [
      { label: "Length", value: "Midi" },
      { label: "Fabric", value: "Satin blend" },
      { label: "Style", value: "Column dress" },
    ],
  },
  {
    _id: "nike-air-max-sneakers",
    name: "Leather Penny Loafers",
    brand: "Santoni",
    price: 34999,
    category: "Shoes",
    rating: 4.7,
    stock: 40,
    popularity: 88,
    featured: true,
    image:
      "https://images.pexels.com/photos/31935098/pexels-photo-31935098.jpeg?cs=srgb&dl=pexels-mr-abrar-visuals-2151929345-31935098.jpg&fm=jpg",
    description: "Leather penny loafers with hand-finished upper, supple lining, and a polished luxury profile.",
    tags: ["luxury shoes", "loafers", "leather", "dress shoe"],
    specifications: [
      { label: "Type", value: "Penny loafer" },
      { label: "Material", value: "Polished leather" },
      { label: "Construction", value: "Blake stitched" },
    ],
  },
  {
    _id: "adidas-ultraboost",
    name: "Suede Runner Sneakers",
    brand: "Common Projects",
    price: 28999,
    category: "Shoes",
    rating: 4.8,
    stock: 35,
    popularity: 86,
    featured: true,
    image:
      "https://images.pexels.com/photos/8188907/pexels-photo-8188907.jpeg?cs=srgb&dl=pexels-sneepcrew-8188907.jpg&fm=jpg",
    description: "Suede runner sneakers with streamlined shape, tonal finish, and a refined luxury-casual stance.",
    tags: ["luxury shoes", "sneakers", "suede", "runner"],
    specifications: [
      { label: "Type", value: "Luxury sneaker" },
      { label: "Upper", value: "Suede upper" },
      { label: "Use", value: "Refined daily wear" },
    ],
  },
  {
    _id: "puma-casual-sneakers",
    name: "Chelsea Leather Boots",
    brand: "Church's",
    price: 32999,
    category: "Shoes",
    rating: 4.4,
    stock: 50,
    popularity: 69,
    featured: false,
    image:
      "https://images.pexels.com/photos/35654955/pexels-photo-35654955.jpeg?cs=srgb&dl=pexels-prolificpeople-35654955.jpg&fm=jpg",
    description: "Chelsea leather boots with sleek profile, elastic side panels, and timeless wardrobe versatility.",
    tags: ["luxury shoes", "boots", "chelsea", "leather"],
    specifications: [
      { label: "Type", value: "Chelsea boot" },
      { label: "Upper", value: "Polished calf leather" },
      { label: "Sole", value: "Leather-rubber combination" },
    ],
  },
  {
    _id: "michael-kors-leather-handbag",
    name: "Michael Kors Empire Leather Tote",
    brand: "Michael Kors",
    price: 68999,
    category: "Luxury Bags",
    rating: 4.6,
    stock: 20,
    popularity: 84,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    description: "Michael Kors empire tote with structured leather body, polished hardware, and generous everyday luxury carry.",
    tags: ["luxury bag", "tote", "michael kors", "leather"],
    specifications: [
      { label: "Material", value: "Leather" },
      { label: "Carry", value: "Shoulder tote" },
      { label: "Style", value: "Structured tote" },
    ],
  },
  {
    _id: "guess-shoulder-bag",
    name: "Guess Luxe Shoulder Bag",
    brand: "Guess",
    price: 52999,
    category: "Luxury Bags",
    rating: 4.5,
    stock: 15,
    popularity: 80,
    featured: true,
    image:
      "https://images.pexels.com/photos/14837855/pexels-photo-14837855.jpeg?cs=srgb&dl=pexels-lutfi-elyas-274851637-14837855.jpg&fm=jpg",
    description: "Guess luxe shoulder bag with sculpted shape, soft grain finish, and elevated evening-ready appeal.",
    tags: ["luxury bag", "shoulder bag", "guess", "designer"],
    specifications: [
      { label: "Type", value: "Shoulder bag" },
      { label: "Finish", value: "Smooth grain texture" },
      { label: "Interior", value: "Zip and slip pockets" },
    ],
  },
  {
    _id: "coach-designer-tote-bag",
    name: "Coach Tabby Leather Tote",
    brand: "Coach",
    price: 74999,
    category: "Luxury Bags",
    rating: 4.7,
    stock: 10,
    popularity: 89,
    featured: true,
    image:
      "https://images.pexels.com/photos/30975791/pexels-photo-30975791.jpeg?cs=srgb&dl=pexels-laarkstudio-30975791.jpg&fm=jpg",
    description: "Coach tabby tote with refined leather texture, statement hardware, and a generous luxury interior.",
    tags: ["luxury bag", "tote", "coach", "designer"],
    specifications: [
      { label: "Capacity", value: "Fits 13-inch laptop" },
      { label: "Material", value: "Premium leather" },
      { label: "Carry", value: "Shoulder tote" },
    ],
  },
  {
    _id: "michael-kors-jet-set-satchel",
    name: "Michael Kors Jet Set Satchel",
    brand: "Michael Kors",
    price: 62999,
    category: "Luxury Bags",
    rating: 4.7,
    stock: 12,
    popularity: 83,
    featured: false,
    image:
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?cs=srgb&dl=pexels-geyonk-1152077.jpg&fm=jpg",
    description: "Michael Kors satchel with structured body, saffiano finish, and polished details for all-day luxury carry.",
    tags: ["handbag", "satchel", "luxury bag", "michael kors"],
    specifications: [
      { label: "Material", value: "Saffiano leather" },
      { label: "Carry", value: "Top handle + crossbody strap" },
      { label: "Style", value: "Structured satchel" },
    ],
  },
];

export const fallbackProducts = catalog.map((product) => ({
  ...product,
  slug: product._id,
  image: product.image,
  images: [product.image],
  numReviews: baseReviews.length,
  reviews: baseReviews,
}));

const sortProducts = (products, sort) => {
  const sorted = [...products];

  switch (sort) {
    case "newest":
      return sorted.reverse();
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "popularity":
    default:
      return sorted.sort((a, b) => b.popularity - a.popularity);
  }
};

export const getFallbackCategories = () =>
  Array.from(new Set(fallbackProducts.map((product) => product.category)));

export const queryFallbackProducts = ({
  category,
  search,
  minPrice,
  maxPrice,
  sort = "popularity",
  featured,
  page = 1,
  limit = 12,
} = {}) => {
  const normalizedSearch = search?.trim().toLowerCase();

  let filtered = [...fallbackProducts];

  if (category && category !== "All") {
    filtered = filtered.filter((product) => product.category === category);
  }

  if (featured === true || featured === "true") {
    filtered = filtered.filter((product) => product.featured);
  }

  if (normalizedSearch) {
    filtered = filtered.filter((product) =>
      [product.name, product.description, product.brand, ...(product.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }

  if (minPrice) {
    filtered = filtered.filter((product) => product.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((product) => product.price <= Number(maxPrice));
  }

  const sorted = sortProducts(filtered, sort);
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const start = (pageNumber - 1) * pageSize;
  const products = sorted.slice(start, start + pageSize);

  return {
    products,
    total: sorted.length,
    page: pageNumber,
    pages: Math.ceil(sorted.length / pageSize) || 1,
  };
};

export const getFallbackFeaturedProducts = (limit = 8) =>
  sortProducts(
    fallbackProducts.filter((product) => product.featured),
    "popularity"
  ).slice(0, limit);

export const getFallbackProductById = (id) =>
  fallbackProducts.find((product) => product._id === id || product.slug === id) || null;

export const getFallbackRelatedProducts = (product, limit = 4) =>
  sortProducts(
    fallbackProducts.filter(
      (item) => item.category === product.category && item._id !== product._id
    ),
    "popularity"
  ).slice(0, limit);
