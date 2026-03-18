import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fadeUp, pageVariants } from "../animations/pageVariants";
import AppImage from "../components/AppImage";
import SectionHeading from "../components/SectionHeading";
import { fallbackProducts } from "../data/fallbackProducts";
import { categoryHighlights } from "../data/highlights";
import useGsapScenes from "../hooks/useGsapScenes";
import api from "../utils/api";

const CategoriesPage = () => {
  const [catalogue, setCatalogue] = useState([]);
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const hasExpectedCategories = (products) => {
    const categories = new Set(products.map((item) => item.category));
    return categoryHighlights.every((item) => categories.has(item.query));
  };

  useEffect(() => {
    const loadCatalogue = async () => {
      try {
        const { data } = await api.get("/products", { params: { limit: 30 } });
        const products = data.products?.length ? data.products : fallbackProducts;
        setCatalogue(hasExpectedCategories(products) ? products : fallbackProducts);
      } catch (error) {
        setCatalogue(fallbackProducts);
      }
    };

    loadCatalogue();
  }, []);

  useGsapScenes(pageRef, ({ gsap, scope }) => {
    const panel = scope.querySelector("[data-gsap='collections-panel']");

    if (panel) {
      gsap.from(panel, {
        opacity: 0,
        y: 52,
        duration: 0.88,
        ease: "power3.out",
        scrollTrigger: {
          trigger: panel,
          start: "top 82%",
          once: true,
        },
      });
    }
  }, []);

  const getCategoryCount = (category) =>
    catalogue.filter((item) => item.category === category).length;

  const getCategoryHref = (category) =>
    category.href || `/shop?category=${encodeURIComponent(category.query)}`;

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
        data-gsap="collections-panel"
        className="surface-card-strong px-4 py-5 sm:px-8 sm:py-10"
      >
        <SectionHeading
          eyebrow="Collections"
          title="Six premium product worlds, each with its own visual mood."
          description="The categories page behaves like a collection landing experience instead of a plain filter menu, with each collection framed as its own retail edit."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryHighlights.map((category, index) => (
            <motion.div
              key={category.title}
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => navigate(getCategoryHref(category))}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(getCategoryHref(category));
                }
              }}
              role="link"
              tabIndex={0}
              className={`group relative min-h-[260px] cursor-pointer overflow-hidden rounded-[20px] border border-soft bg-gradient-to-br ${category.accent} p-0 sm:min-h-[320px] sm:rounded-[30px]`}
            >
              <AppImage
                src={category.image}
                alt={category.title}
                label={category.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/18 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end gap-5 p-4 sm:gap-8 sm:p-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">Category</p>
                  <h3 className="font-display text-[1.9rem] font-semibold tracking-[-0.05em] text-white sm:text-3xl">
                    {category.title}
                  </h3>
                  <p className="max-w-md text-sm leading-6 text-white/78 sm:leading-7">
                    {category.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                    {getCategoryCount(category.query)} products
                  </span>
                  <Link
                    to={getCategoryHref(category)}
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoriesPage;
