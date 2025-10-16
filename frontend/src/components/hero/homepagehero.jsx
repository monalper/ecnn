import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroMinimalApple({ dark = true }) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 200], [1, 0.9]);
  const borderRadius = useTransform(scrollY, [0, 200], ["0%", "20px"]);
  const top = useTransform(scrollY, [0, 200], ["0vh", "0.5vh"]);

  const [isMobile, setIsMobile] = useState(false);

  // 📱 Cihaz boyutuna göre SVG seçimi
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const heroSvg = isMobile ? "/heroikincilmobil.svg" : "/heroikincil.svg";

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
      {/* 🖼️ Arka plan görseli */}
      <img
        src="/hero.png"
        alt="Hero Arka Plan"
        className="hero-bg-image"
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

      {/* 🖼️ Ortalanmış SVG başlık (mobil/masaüstü farkı dahil) */}
      <img src={heroSvg} alt="Hero Başlık" className="hero-title-svg" />

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
          height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
          transition: background-color 0.5s ease, color 0.5s ease;
          overflow: hidden;
          padding: 0;
          position: relative;
        }

        @media (min-width: 640px) {
          .hero-apple-minimal {
            height: 80vh;
          }
        }

        @media (min-width: 1024px) {
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

        /* 🌀 Hero başlık SVG stilleri */
        .hero-title-svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: auto;
          max-width: none;
          object-fit: cover;
          mix-blend-mode: difference;
          z-index: 2;
          pointer-events: none;
          opacity: 0.9;
        }
      `}</style>
    </motion.section>
  );
}
