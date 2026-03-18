import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fadeUp } from "../animations/pageVariants";
import { brandShowcase, heroShowcaseSlides } from "../data/highlights";
import useGsapScenes from "../hooks/useGsapScenes";
import { formatCurrency } from "../utils/currency";
import AppImage from "./AppImage";

const AUTOPLAY_DELAY = 5000;

const HeroSection = ({ products = [] }) => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const previewY = useTransform(scrollYProgress, [0, 1], [0, -54]);
  const activeSlide = heroShowcaseSlides[activeIndex];
  const heroProducts = products.slice(0, 3);

  useEffect(() => {
    if (heroShowcaseSlides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroShowcaseSlides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToSlide = (nextIndex) => {
    const normalizedIndex =
      (nextIndex + heroShowcaseSlides.length) % heroShowcaseSlides.length;
    setActiveIndex(normalizedIndex);
  };

  useGsapScenes(sectionRef, ({ gsap, scope }) => {
    gsap.from("[data-gsap='hero-copy']", {
      opacity: 0,
      y: 34,
      duration: 0.92,
      ease: "power3.out",
    });

    gsap.from("[data-gsap='hero-tags']", {
      opacity: 0,
      y: 18,
      duration: 0.72,
      delay: 0.12,
      ease: "power2.out",
    });

    gsap.from("[data-gsap='hero-spotlight']", {
      opacity: 0,
      y: 26,
      duration: 0.82,
      delay: 0.18,
      ease: "power3.out",
    });

    gsap.from("[data-gsap='hero-showcase']", {
      opacity: 0,
      y: 46,
      scale: 0.975,
      duration: 1,
      delay: 0.08,
      ease: "power3.out",
    });

    gsap.from("[data-gsap='hero-selector']", {
      opacity: 0,
      y: 18,
      stagger: 0.08,
      duration: 0.58,
      delay: 0.24,
      ease: "power2.out",
    });

    gsap.from("[data-gsap='hero-brands']", {
      opacity: 0,
      y: 18,
      duration: 0.72,
      delay: 0.32,
      ease: "power2.out",
    });

    gsap.from("[data-gsap='hero-products']", {
      opacity: 0,
      y: 24,
      duration: 0.82,
      delay: 0.3,
      ease: "power3.out",
    });

    const showcaseImage = scope.querySelector("[data-gsap='hero-parallax']");

    if (showcaseImage) {
      gsap.to(showcaseImage, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-shell pt-8 sm:pt-12">
      <div className="surface-card-strong relative overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
        <div className="soft-grid absolute inset-0 opacity-45" />
        <div className="hero-orb left-10 top-10 h-64 w-64 bg-[rgba(var(--accent),0.16)]" />
        <div className="hero-orb bottom-4 right-8 h-72 w-72 bg-[rgba(var(--glow),0.16)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-black/[0.16] dark:from-white/[0.02] dark:to-black/[0.26]" />

        <div className="relative z-10 grid gap-5 xl:grid-cols-[312px_minmax(0,1fr)] xl:items-start">
          <motion.div
            style={{ y: contentY }}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="surface-card flex h-full flex-col gap-4 self-start px-4 py-4 sm:px-5 sm:py-5"
          >
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" />
              Velora signature drop
            </span>

            <div data-gsap="hero-copy" className="space-y-3">
              <h1 className="max-w-[14rem] font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:max-w-none sm:text-6xl xl:text-[4.2rem]">
                Elevate Your Everyday Style
              </h1>
              <p className="max-w-[18rem] text-[15px] leading-7 text-soft sm:max-w-[22rem] sm:text-base">
                Discover premium products crafted for modern living, from collector timepieces and
                sculpted tailoring to designer handbags and beautifully finished accessories.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <Link
                to="/shop"
                className="btn-secondary rounded-2xl border-[rgba(var(--accent),0.34)] bg-[rgba(var(--accent),0.14)] px-6 py-3.5 text-[15px] text-main shadow-[0_22px_56px_-30px_rgba(var(--glow),0.42)] hover:bg-[rgba(var(--accent),0.2)] dark:bg-[rgba(var(--accent),0.16)] dark:text-main"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="#new-arrivals" className="btn-secondary rounded-2xl px-6 py-3.5 text-[15px]">
                Explore New Arrivals
              </a>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSlide.href}-tags`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                data-gsap="hero-tags"
                className="flex flex-wrap items-center gap-3"
              >
                <span className="rounded-full border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-soft">
                  {activeSlide.category}
                </span>
                <span className="rounded-full border border-[rgba(var(--accent),0.24)] bg-[rgba(var(--accent),0.1)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
                  {activeSlide.brand}
                </span>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                data-gsap="hero-spotlight"
                className="glass-panel w-full overflow-hidden rounded-[18px] px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-soft">
                    Currently spotlighting
                  </p>
                  <span className="rounded-full border border-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-soft">
                    {activeIndex + 1} / {heroShowcaseSlides.length}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <h2 className="font-display text-[1.8rem] font-semibold leading-[1.02] tracking-[-0.05em] text-main">
                    {activeSlide.title}
                  </h2>
                  <p className="max-w-[28rem] text-sm leading-6 text-soft">
                    {activeSlide.description}
                  </p>
                </div>
                <div className="mt-4 h-px bg-[rgba(var(--border),0.7)]" />
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-xl font-semibold text-[rgb(var(--accent))]">
                    {formatCurrency(activeSlide.price)}
                  </p>
                  <Link
                    to={activeSlide.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-main transition duration-300 hover:translate-x-1"
                  >
                    {activeSlide.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-2">
              {heroShowcaseSlides.map((slide, index) => (
                <button
                  key={slide.href}
                  type="button"
                  onClick={() => goToSlide(index)}
                  data-gsap="hero-selector"
                  className={`inline-flex items-center rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 ${
                    index === activeIndex
                      ? "border-[rgba(var(--accent),0.42)] bg-[rgba(var(--accent),0.16)] text-main shadow-[0_16px_34px_-22px_rgba(var(--glow),0.52)]"
                      : "border-soft bg-[rgba(var(--surface),0.82)] text-soft hover:border-[rgba(var(--accent),0.28)] hover:text-main"
                  }`}
                  aria-label={`Show ${slide.title}`}
                >
                  {slide.brand}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div style={{ y: previewY }} className="space-y-5">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
              data-gsap="hero-showcase"
              className="surface-card-strong overflow-hidden p-3"
            >
              <div className="relative overflow-hidden rounded-[18px]">
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/68 via-black/24 to-black/6" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/72 via-black/16 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4 sm:p-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeSlide.href}-caption`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="max-w-md space-y-2"
                    >
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                        {activeSlide.eyebrow}
                      </p>
                      <h3 className="font-display text-3xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-4xl">
                        {activeSlide.title}
                      </h3>
                      <p className="text-sm leading-6 text-white/82 sm:text-base">
                        {activeSlide.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="hidden gap-2 sm:flex">
                    <button
                      type="button"
                      onClick={() => goToSlide(activeIndex - 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition duration-300 hover:bg-black/35"
                      aria-label="Previous showcase item"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(activeIndex + 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition duration-300 hover:bg-black/35"
                      aria-label="Next showcase item"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Link to={activeSlide.href} className="group block">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSlide.href}
                      initial={{ opacity: 0, scale: 0.97, y: 28 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.985, y: -20 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      data-gsap="hero-parallax"
                      className="h-[400px] sm:h-[430px] lg:h-[450px]"
                    >
                      <AppImage
                        src={activeSlide.image}
                        alt={activeSlide.title}
                        label={activeSlide.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                      />
                    </motion.div>
                  </AnimatePresence>
                </Link>
              </div>
            </motion.div>

            <div
              data-gsap="hero-brands"
              className="surface-card overflow-hidden rounded-[18px] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex shrink-0 rounded-full border border-[rgba(var(--accent),0.22)] bg-[rgba(var(--accent),0.08)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-main">
                  Featured Houses
                </span>
                <div className="relative flex min-h-[52px] min-w-0 flex-1 items-center overflow-hidden rounded-full border border-soft bg-[rgba(var(--surface),0.84)] px-3 py-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[rgba(var(--surface-strong),0.98)] to-transparent sm:w-16" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[rgba(var(--surface-strong),0.98)] to-transparent sm:w-16" />
                  <div className="brand-marquee relative z-20 min-w-0 flex-1">
                    <div className="brand-marquee-track">
                      {[...brandShowcase, ...brandShowcase].map((brand, index) => (
                        <div key={`${brand}-${index}`} className="brand-marquee-unit">
                          <span className="brand-marquee-chip">{brand}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div data-gsap="hero-products" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {heroProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product.slug || product._id}`}
                  className="group surface-card overflow-hidden rounded-[18px] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-40px_rgba(0,0,0,0.28)]"
                >
                  <div className="overflow-hidden rounded-[16px] bg-[rgba(var(--surface-muted),0.8)]">
                    <AppImage
                      src={product.image}
                      alt={product.name}
                      label={product.name}
                      className="aspect-[4/4.6] w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-soft">
                      Trending Edit
                    </p>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-display text-lg font-semibold leading-6 tracking-[-0.03em] text-main">
                        {product.name}
                      </h4>
                      <span className="text-sm font-semibold text-[rgb(var(--accent))]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-6 text-soft">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
