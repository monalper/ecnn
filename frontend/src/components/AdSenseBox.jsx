import React from 'react';

const AdSenseBox = ({ slot, style, className }) => {
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
