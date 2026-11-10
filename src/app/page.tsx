import Header from "../components/Header";
import MotionOrchestrator from "../components/MotionOrchestrator";
import HeroCanvas from "../components/three/HeroCanvas";
import Hero from "../components/sections/Hero";
import Works from "../components/sections/Works";
import Services from "../components/sections/Services";
import Process from "../components/sections/Process";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";
import Footer from "../components/sections/Footer";

/*
 * Single-column page. The WebGL canvas (HeroCanvas) is a fixed background
 * layer; all sections scroll above it.
 * Between the hero and the contact section the content sits on a "veil"
 * (ink at ~88%, faded in and out at both ends) so the instrument recedes
 * behind screenshots and body copy, then returns for the closing CTA.
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
        <div className="veil">
          <Works />
          <Services />
          <Process />
          <About />
        </div>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
