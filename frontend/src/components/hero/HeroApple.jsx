// src/components/hero/HeroMinimalApple.jsx
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroMinimalApple({ dark = true }) {
  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 200], [1, 0.9]);
  const borderRadius = useTransform(scrollY, [0, 200], ["0%", "20px"]);
  const top = useTransform(scrollY, [0, 200], ["0vh", "0.5vh"]);

  return (
    <motion.section
      style={{
        scale,
        borderRadius,
        top,
        position: "sticky",
        zIndex: 10,
      }}
      className={`hero-apple-minimal ${dark ? "dark" : "light"}`}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hero-bg-video"
        src="/hero.mp4"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div className="hero-inner"></div>

      <style>{`
        :root {
          --apple-black: #000000;
          --apple-white: #ffffff;
          --apple-gray: #f5f5f7;
          --apple-gray-dark: #1d1d1f;
        }

        .hero-apple-minimal {
          width: 100%;
          height: 50vh; /* Mobilde ekranın yarısı */
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
          transition: background-color 0.5s ease, color 0.5s ease;
          overflow: hidden;
          padding: 0 20px;
          position: relative;
        }

        @media (min-width: 640px) { /* sm ve üstü */
          .hero-apple-minimal {
            height: 80vh;
          }
        }

        @media (min-width: 1024px) { /* lg ve üstü */
          .hero-apple-minimal {
            height: 100vh;
          }
        }

        .hero-apple-minimal.dark {
          background-color: transparent;
          color: var(--apple-white);
        }

        .hero-apple-minimal.light {
          background-color: var(--apple-gray);
          color: var(--apple-gray-dark);
        }

        .hero-inner {
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }
      `}</style>
    </motion.section>
  );
}
