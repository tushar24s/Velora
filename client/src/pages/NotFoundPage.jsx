import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageVariants } from "../animations/pageVariants";

const NotFoundPage = () => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="section-shell"
  >
    <div className="surface-card mx-auto max-w-2xl px-6 py-12 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-soft">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
        The page you requested does not exist.
      </h1>
      <p className="mt-4 text-soft">
        Return to the storefront and continue exploring the collection.
      </p>
      <Link to="/" className="btn-primary mt-8 inline-flex">
        Go home
      </Link>
    </div>
  </motion.div>
);

export default NotFoundPage;
