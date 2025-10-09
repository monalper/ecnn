import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import thumbPlaceholder from "../../assets/ThumbPlaceholder.png";

const HeroVideoCard = ({ video }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const videoRef = useRef(null);

  const handleEnter = () => {
    setHover(true);
    if (videoRef.current && video?.videoUrl) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setHover(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="block relative group transform scale-[0.9] transition-all"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        onClick={() => navigate(`/videos/${video.id}`)}
        className="block w-full text-left rounded-2xl overflow-hidden"
        aria-label={`Videoyu aç: ${video.title}`}
      >
        {/*  Görsel / video alanı  */}
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-800">
          {hover && video?.videoUrl ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              muted
              playsInline
            />
          ) : (
            <img
              src={video?.thumbnailUrl || thumbPlaceholder}
              alt={video?.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Başlık */}
        <h3 className="text-base sm:text-lg font-semibold text-white mt-2 leading-snug tracking-tight line-clamp-2 min-h-[44px]">
          {video?.title}
        </h3>
      </button>
    </div>
  );
};

export default HeroVideoCard;
