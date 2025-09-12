import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-text">
          <h1 className="not-found-title">
            <span className="not-found-number">4</span>
            <span className="not-found-number crossed">0</span>
            <span className="not-found-number">4</span>
          </h1>
          <p className="not-found-message">
            Aradığınız kozmik sayfa, olay ufkundan öteye kaybolmuş.
          </p>
        </div>
      </div>
      <div className="not-found-logo">
        <div className="logo-container">
          <h2 className="logo-text">
            <span className="lora-italic-semibold">the</span>
            <span style={{marginLeft: '0.15em'}}>Openwall</span>
          </h2>
          <p className="photo-credit">
            Fotoğraf Kaynağı : <a href="https://science.nasa.gov/missions/webb/blood-soaked-eyes-nasas-webb-hubble-examine-galaxy-pair/" target="_blank" rel="noopener noreferrer" className="nasa-link">IC 2163-NGC 2207 pair, NASA</a>
          </p>
          <p className="countdown-text">
            <span className="countdown-number">{countdown}</span> saniye sonra ana sayfaya yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
