import products from "./products.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const removedLegacySlugs = [
  "iphone-15-pro",
  "samsung-galaxy-s24",
  "google-pixel-8",
  "oneplus-12",
  "nothing-phone-2",
  "samsung-galaxy-s24-ultra",
  "sony-wh-1000xm5-headphones",
  "apple-airpods-pro",
  "nothing-ear",
  "oneplus-buds-pro-3",
  "bose-quietcomfort-ultra-earbuds",
  "marshall-emberton-iii-speaker",
  "logitech-mx-mechanical-keyboard",
  "samsung-smart-monitor-m8",
  "noise-colorfit-smartwatch",
  "apple-watch-series-9",
  "samsung-galaxy-watch6-classic",
  "oneplus-watch-2",
  "cmf-watch-pro-2",
  "rolex-datejust-36",
  "omega-seamaster-diver-300m",
  "tag-heuer-carrera-chronograph",
  "tissot-prx-powermatic-80",
  "seiko-presage-cocktail-time",
  "longines-master-collection-moonphase",
];

const seedDefaults = async () => {
  if (removedLegacySlugs.length > 0) {
    await Product.deleteMany({ slug: { $in: removedLegacySlugs } });
  }

  if (products.length > 0) {
    await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { slug: product.slug },
          update: { $set: product },
          upsert: true,
        },
      }))
    );
    console.log(`Synced ${products.length} default products`);
  }

  const adminEmail = "admin@velora.store";
  const adminUser = await User.findOne({ email: adminEmail });

  if (!adminUser) {
    await User.create({
      name: "Velora Admin",
      email: adminEmail,
      password: "Admin@123",
      isAdmin: true,
    });

    console.log("Created default admin account");
  }
};

export default seedDefaults;
