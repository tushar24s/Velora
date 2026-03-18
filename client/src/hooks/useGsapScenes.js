import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isRegistered = false;

const registerScrollTrigger = () => {
  if (!isRegistered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
};

const useGsapScenes = (scopeRef, setup, deps = []) => {
  useLayoutEffect(() => {
    if (!scopeRef.current) {
      return undefined;
    }

    registerScrollTrigger();

    const ctx = gsap.context(() => {
      setup({
        gsap,
        ScrollTrigger,
        scope: scopeRef.current,
      });
    }, scopeRef);

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, deps);
};

export default useGsapScenes;
