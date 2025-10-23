import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// New hero: Masonry collage (left) + large headline (right)
// Uses images from public/mons/*
export default function HeroMinimalApple() {
  const fallbackImages = [
    "/mons/114.jpg",
    "/mons/Compartment_C_1938_hopper.webp",
    "/mons/1.png",
    "/mons/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
    "/mons/Edward-Hopper-City-Roofs-1932.-�-2022-Heirs-of-Josephine-N.-HopperLicensed-by-Artists-Rights-Society-ARS-New-York..webp",
    "/mons/GOYO-13X18.jpg",
    "/mons/edward-hopper-gece-kuslari-a.jpg",
    "/mons/2.png",
    "/mons/hopper-slides07.jpg",
    "/mons/GOYO-50X70.jpg",
    "/mons/W1siZiIsIjQ1NzQxNyJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MTQ0MFx1MDAzZSJdXQ.jpg",
    "/mons/unnamed.jpg",
  ];

  const [images, setImages] = useState(fallbackImages);

  useEffect(() => {
    let ignore = false;
    fetch("/mons/manifest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!ignore && data?.images?.length) {
          setImages(data.images);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <motion.section className="mons-hero" aria-label="Openwall makaleler hero">
      <div className="mons-inner">
        <div className="mons-left" aria-hidden="true">
          <div className="mons-grid">
            {images.map((src, idx) => (
              <div className="cell" key={idx}>
                <img src={src} alt="" loading={idx < 3 ? "eager" : "lazy"} draggable="false" />
              </div>
            ))}
          </div>
        </div>
        <div className="mons-right">
          <Link to="/articles" className="mons-title" aria-label="Openwall'da yayınlanmış tüm yazıları keşfet">
            Openwall'da yayınlanmış tüm yazıları keşfet.
          </Link>
          <Link to="/articles" className="mons-title mons-title-new" aria-label="Openwall'da yayınlanmış tüm yazıları keşfet">
            Openwall'da yayınlanmış tüm <span className="mons-title-serif">yazıları</span> keşfet.
          </Link>
        </div>
      </div>

      <style>{`
        :root {
          --bg: #f7f7fb;
          --text: #0b0c10;
          --muted: #6b7280;
        }

        .mons-hero {
          width: 100%;
          background: #f8f9fa; /* match light theme body */
          /* push content below fixed header and add extra gap */
          --header-h: 48px; /* mobile header height h-12 */
          --hero-gap: clamp(8px, 2.5vw, 28px);
          padding: calc(var(--header-h) + var(--hero-gap)) 0 clamp(16px, 3vw, 36px);
          color: #0b0c10; /* light theme text */
        }
        html.dark .mons-hero { background: #0F0F0F; color: #ffffff; }
        @media (min-width: 768px) { /* md */
          .mons-hero { --header-h: 44px; --hero-gap: clamp(10px, 2vw, 32px); }
        }
        .mons-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(16px, 3vw, 40px);
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          /* increase whitespace between masonry and heading */
          gap: clamp(24px, 5vw, 96px);
          align-items: center;
        }

        /* Left collage as masonry columns that preserve aspect ratio */
        .mons-grid {
          column-count: 3;
          column-gap: clamp(4px, 0.8vw, 10px);
        }
        .mons-grid .cell { 
          break-inside: avoid; 
          -webkit-column-break-inside: avoid;
          margin-bottom: clamp(4px, 0.8vw, 10px);
          border-radius: 0;
          overflow: hidden;
        }
        .mons-grid img {
          width: 100%;
          height: auto;
          object-fit: contain; /* preserve full image without cropping */
          display: block;
          filter: saturate(102%);
          background: #eee; /* subtle backdrop for transparent margins */
          border-radius: 0;
          user-select: none;
          -webkit-user-drag: none;
          -webkit-user-select: none;
          -ms-user-select: none;
        }
        .mons-grid { user-select: none; -webkit-user-select: none; }

        /* Right title */
        .mons-right { align-self: center; }
        .mons-title {
          color: inherit;
          text-decoration: none;
          font-weight: 600;
          font-family: "Helvetica Neue", Helvetica, Arial, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple Color Emoji", "Segoe UI Emoji";
          letter-spacing: -0.02em;
          line-height: 1.06;
          display: inline-block;
          font-size: clamp(32px, 5.8vw, 64px);
        }
        .mons-title-serif { font-family: Georgia, "Times New Roman", Times, serif; font-style: italic; }
        /* Hide the initial title node if multiple exist (we insert a refined duplicate) */
        .mons-right a.mons-title:first-of-type { display: none; }

        /* Responsive */
        @media (max-width: 1024px) {
          .mons-inner { grid-template-columns: 1fr; }
          .mons-right { order: -1; }
          .mons-title { font-size: clamp(28px, 8vw, 48px); }
          .mons-grid { column-count: 2; column-gap: clamp(4px, 1.2vw, 10px); }
        }
      `}</style>
    </motion.section>
  );
}
