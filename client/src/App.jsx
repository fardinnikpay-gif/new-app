import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { gsap, ScrollTrigger } from "./animations/gsap";
import { OFFSET, VIEWPORT, fadeUp, scaleIn, slideIn, stagger } from "./animations/variants";
import PageTransition from "./components/motion/PageTransition";
import Preloader from "./components/motion/Preloader";
import Reveal from "./components/motion/Reveal";
import ScrollProgress from "./components/motion/ScrollProgress";
import SmoothScroll from "./components/motion/SmoothScroll";
import TextReveal from "./components/motion/TextReveal";
import Button from "./components/ui/Button";
import Container from "./components/ui/Container";
import Modal from "./components/ui/Modal";
import useGsapContext from "./hooks/useGsapContext";

function PageA() {
  const [open, setOpen] = useState(false);

  const scope = useGsapContext(() => {
    gsap.to(".parallax-img", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: { trigger: ".parallax-wrap", start: "top bottom", end: "bottom top", scrub: true },
    });
  }, []);

  return (
    <Container as="main" className="space-y-24 py-16">
      <TextReveal as="h1" text="Cinematic motion, one word at a time" className="max-w-3xl text-5xl md:text-7xl" />

      <Reveal as="p" delay={0.1} className="max-w-xl text-neutral-600">
        This paragraph fades up when it enters the viewport. Scroll down to test every effect.
      </Reveal>

      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid gap-4 md:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <motion.li key={index} variants={fadeUp} className="rounded-lg border border-line p-6 shadow-soft">
            Stagger card {index + 1}
          </motion.li>
        ))}
      </motion.ul>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          variants={slideIn}
          custom={{ x: -OFFSET.x }}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="rounded-lg bg-ink p-8 text-surface"
        >
          slideIn from the left
        </motion.div>
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="rounded-lg bg-primary p-8 text-surface"
        >
          scaleIn
        </motion.div>
      </div>

      <section ref={scope}>
        <div className="parallax-wrap aspect-video overflow-hidden rounded-lg">
          <img
            src="/placeholders/landscape.svg"
            alt="Parallax test"
            width="1600"
            height="900"
            className="parallax-img h-full w-full scale-125 object-cover"
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setOpen(true)}>Open modal (Lenis stop test)</Button>
        <Button variant="outline" onClick={() => console.log("ScrollTrigger count:", ScrollTrigger.getAll().length)}>
          Log ScrollTrigger count
        </Button>
        <Button as={Link} to="/other" variant="outline">
          Go to the other page
        </Button>
      </div>

      <div className="h-[60vh]" />

      <Modal open={open} onClose={() => setOpen(false)} title="Scroll lock test">
        <p className="text-neutral-600">The page behind must not scroll while this is open.</p>
      </Modal>
    </Container>
  );
}

function PageB() {
  return (
    <Container as="main" className="space-y-6 py-16">
      <TextReveal as="h1" text="The other page" className="text-5xl" />
      <Button as={Link} to="/" variant="outline">
        Back
      </Button>
    </Container>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<PageA />} />
        <Route path="*" element={<PageB />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SmoothScroll>
          <ScrollProgress />
          <Preloader />
          <AnimatedRoutes />
        </SmoothScroll>
      </BrowserRouter>
    </MotionConfig>
  );
}