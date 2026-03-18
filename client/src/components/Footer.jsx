import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative z-10 px-4 pb-8 sm:px-6 lg:px-8">
    <div className="section-shell">
      <div className="surface-card flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <span className="eyebrow">Velora</span>
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">
            A premium storefront for modern living, styled with cinematic motion and glass detail.
          </h3>
          <p className="max-w-xl text-sm text-soft sm:text-base">
            Explore curated drops, refined shopping flows, and a full MERN commerce stack wrapped
            in a darker, more luxurious interface.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-soft">
          <Link to="/shop" className="hover:text-main">
            Shop
          </Link>
          <Link to="/categories" className="hover:text-main">
            Categories
          </Link>
          <Link to="/orders" className="hover:text-main">
            Orders
          </Link>
          <span>Default admin: admin@velora.store</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
