import Header from "../components/Header";
import MotionOrchestrator from "../components/MotionOrchestrator";
import HeroCanvas from "../components/three/HeroCanvas";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Works from "../components/sections/Works";
import Contact from "../components/sections/Contact";
import Footer from "../components/sections/Footer";

/*
 * Single-column page. The WebGL canvas (HeroCanvas) is a fixed background
 * layer; all sections scroll above it and stay readable via its scrim.
 * z-scale: canvas -10, content 0, header 40, skip-link 50.
 */
export default function Home() {
  return (
    <>
      <MotionOrchestrator />
      <HeroCanvas />
      <Header />
      <main id="main" className="relative">
        <Hero />
        <About />
        <Works />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
