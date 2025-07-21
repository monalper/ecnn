import React, { useEffect } from 'react';

const AdSenseBox = ({ slot, style, className }) => {
  useEffect(() => {
    if (!window.adsbygoogle && !document.getElementById('adsbygoogle-js')) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.id = 'adsbygoogle-js';
      script.setAttribute('data-ad-client', 'ca-pub-5253715298133137');
      document.body.appendChild(script);
    } else if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  useEffect(() => {
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {}
    }
  });

  return (
    <div style={style} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '160px', height: '600px', ...style }}
        data-ad-client="ca-pub-5253715298133137"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSenseBox;
