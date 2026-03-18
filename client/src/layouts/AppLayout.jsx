import CartDrawer from "../components/CartDrawer";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const AppLayout = () => (
  <div className="page-shell min-h-screen bg-app">
    <div className="pointer-events-none absolute inset-0 bg-mesh-light dark:bg-mesh-dark" />
    <div className="grain-overlay absolute inset-0" />
    <div className="hero-orb left-[-10%] top-20 h-64 w-64 bg-[rgba(var(--accent),0.22)]" />
    <div className="hero-orb bottom-20 right-[-4%] h-72 w-72 bg-[rgba(var(--glow),0.12)]" />
    <Navbar />
    <CartDrawer />
    <main className="relative z-10 pb-24 pt-6">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default AppLayout;
