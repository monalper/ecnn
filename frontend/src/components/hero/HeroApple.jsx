// src/components/hero/HeroApple.jsx
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function HeroApple() {
  const rootRef = useRef(null);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Referanstaki sırayı ve süreleri birebir koruduk
      const t1 = gsap.timeline({ repeat: 0, onComplete: () => {
        setAnimationDone(true);
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }});

      t1.from(["#top-gradient", "#bottom-gradient"], 0.7, {
        ease: "power3.inOut",
        filter: "blur(0px)",
        opacity: 0,
      })
        .from("#blue-filter", 0.8, { opacity: 0, scale: 3 }, "-=50%")
        .to("#blue-filter", 0.25, { opacity: 0, scale: 3 })
        .to(["#top-gradient", "#bottom-gradient"], 0.3, { filter: "blur(0px)", opacity: 0 }, "-=100%")
        .set("#logo", { opacity: 1 })
        // Harf split yerine tek parça logo: aynı pencereye denk gelecek şekilde giriş
        .from("#hero-logo", 0.2, {
          ease: "back",
          filter: "blur(0.3em)",
          opacity: 0,
          scale: 1.5,
        })
        // "ORIGINALS" satırı yok; süre penceresini doldurmak için hafif x hareketini atlıyoruz
        .from("#logo-border", 0.4, { ease: "power3.out", opacity: 0, scale: 0.75 }, "-=100%")
        .from("#logo-border-inner", 0.4, { ease: "power3.out", scale: 0.75 }, "-=100%")
        .to("#logo", 1.5, { scale: 1.1 }, "-=20%")
        .to(["#logo-border", "#logo-border-inner"], 1.5, { ease: "power3.out", scale: 1.1 }, "-=100%")
        .to("#logo-border", 1.25, { ease: "power4.in", scale: 8 }, "-=50%")
        .to("#logo-border-inner", 0.5, { ease: "power4.in", scale: 8 }, "-=60%")
        .to("#logo", 0.25, { opacity: 0, scale: 1.2 }, "-=50%");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} aria-label="Hero" className="hero-root">
      {!animationDone ? (
        <>
          {/* Blue radial filter */}
          <div id="blue-filter"></div>

          {/* Gradients */}
          <div id="top-gradient" className="gradient"></div>
          <div id="bottom-gradient" className="gradient"></div>

          {/* Logo kapsülü */}
          <div id="logo-wrapper">
            <div id="logo">
              <div id="logo-border" className="absolute-centered"></div>
              <div id="logo-border-inner" className="absolute-centered"></div>

              <div id="logo-text">
                {/* Burada text yerine tek parça logo görüntülüyoruz */}
                <img id="hero-logo" src="/headerlogo.svg" alt="Openwall" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="hero-finish-content">
          {/* Video Arka Planı */}
          <video
            className="hero-video-background"
            src="/hero.mp4" 
            autoPlay
            loop
            muted
            playsInline
            poster="/hero_poster.jpg"
          />
          
          {/* Yeni Video Kaynağı Metni - Sayfa altına ortalanmış olacak */}
          <p className="video-source-credit">
            Video Kaynağı: <span style={{fontWeight: 'bold'}}>Hubble</span> 
            <span style={{fontStyle: 'italic', fontWeight: 'bold'}}>, Rosette Nebula Visualization</span> 
            <span style={{fontWeight: 'bold'}}> (science.nasa.gov)</span>
          </p>
          
        </div>
      )}

      {/* Bileşen içi stiller — referanstaki CSS’in birebir uyarlaması */}
      <style>{`
:root {
  --background-color: rgb(10, 10, 10);
  --gradient-blue-rgb: 127, 117, 237;
  --gradient-violet-rgb: 171, 111, 218;
  --highlight-blue-rgb: 45, 37, 143;
}

/* Kök */
.hero-root {
  align-items: center;
  background-color: var(--background-color);
  display: flex;
  height: 100vh;
  justify-content: center;
  margin: 0;
  overflow: hidden;
  padding: 0;
  position: relative;
  width: 100vw;
}

/* Yardımcı */
.absolute-centered {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* Filtre ve gradyanlar */
#blue-filter {
  background: radial-gradient(
    rgba(var(--gradient-blue-rgb), 0.05),
    rgba(var(--gradient-blue-rgb), 0.4) 80%
  );
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

.gradient {
  filter: blur(3em);
  height: 80px;
  left: -5%;
  position: absolute;
  width: 110%;
  z-index: 0;
}

#top-gradient {
  background: linear-gradient(
    to right,
    rgba(var(--gradient-blue-rgb), 0.75) 0% 10%,
    transparent 10% 20%,
    rgba(var(--gradient-violet-rgb), 0.5) 20% 50%,
    rgba(var(--gradient-blue-rgb), 0.5) 50% 70%,
    rgba(var(--gradient-blue-rgb), 0.75) 70%
  );
  top: -50px;
}

#bottom-gradient {
  background: linear-gradient(
    to right,
    rgba(var(--gradient-blue-rgb), 0.75) 0% 10%,
    transparent 10% 30%,
    rgba(var(--gradient-blue-rgb), 0.5) 30% 50%,
    transparent 50% 70%,
    rgba(var(--gradient-violet-rgb), 0.5) 70% 80%,
    transparent 80%
  );
  bottom: -50px;
}

/* Logo sarmalı */
#logo-wrapper {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100vw;
}

#logo {
  opacity: 0;
  position: relative;
  z-index: 2;
  transform: translateZ(0);
  will-change: transform, opacity;
}

#logo-border {
  background-color: rgb(var(--gradient-blue-rgb));
  border-radius: 2.25em;
  height: 160%;
  width: 140%;
  z-index: 1;
}

#logo-border-inner {
  background-color: var(--background-color);
  border-radius: 2em;
  height: calc(160% - 0.5em);
  width: calc(140% - 0.5em);
  z-index: 2;
}

#logo-text {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tek parça logo */
#hero-logo {
  width: 200px;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
  opacity: 0.98;
}

@media (max-width: 800px) {
  #logo-wrapper {
    transform: scale(0.7);
  }
}

/* Animasyon sonrası hero içeriği */
.hero-finish-content {
  position: relative;
  width: 100%;
  height: 100%;
  /* Flexbox ayarları kaldırıldı, metni ve videoyu kapsayan bir konteyner olarak kalmalı */
  overflow: hidden;
  background-color: var(--background-color);
  z-index: 10; 
}

/* Video Stilleri */
.hero-video-background {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 1;
  transform: translate(-50%, -50%);
  object-fit: cover;
}

/* Video Kaynağı Metin Stilleri (Ortalanmış Alt Kısım) */
.video-source-credit {
  position: absolute;
  bottom: 10px; /* Alttan 10 piksel boşluk */
  left: 50%; /* Yatayda ortalama başlangıcı */
  transform: translateX(-50%); /* Kendi genişliğinin yarısı kadar sola kaydırarak ortalama */
  
  /* Stil ve görünürlük ayarları */
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  padding: 5px 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  z-index: 2; /* Video (z-index: 1) üstünde kalması için */
  margin: 0;
  text-shadow: 0 0 2px #000;
  white-space: nowrap; /* Metnin tek satırda kalmasını sağlamak için */
}
      `}</style>
    </section>
  );
}