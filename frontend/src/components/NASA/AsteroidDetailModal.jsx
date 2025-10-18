// frontend/src/components/NASA/AsteroidDetailModal.jsx
import React, { useEffect } from 'react';

const AsteroidDetailModal = ({ isOpen, onClose, asteroid }) => {
  if (!isOpen || !asteroid) return null;

  const dangerLevel = (() => {
    const diameter =
      asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
    const approachDistance =
      asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || 0;
    if (diameter > 1 && approachDistance < 1000000)
      return { level: 'Yüksek', color: 'text-red-500' };
    if (diameter > 0.5 && approachDistance < 5000000)
      return { level: 'Orta', color: 'text-yellow-500' };
    return { level: 'Düşük', color: 'text-green-500' };
  })();

  const format = (num, unit = '') => {
    if (!num) return 'Bilinmiyor';
    const val = parseFloat(num);
    return val.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' ' + unit;
  };

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const approach = asteroid.close_approach_data?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 shadow-2xl overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 md:p-8">
          {/* Başlık */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-semibold leading-snug tracking-tight">
              {asteroid.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Kapat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tehlike seviyesi */}
          <div className={`text-sm font-medium mb-6 ${dangerLevel.color}`}>
            Tehlike Seviyesi: {dangerLevel.level}
          </div>

          {/* Bilgi alanları */}
          <div className="space-y-5 text-sm md:text-base leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wide mb-1">
                  Ortalama Çap
                </span>
                <span className="font-semibold">
                  {format(
                    (asteroid.estimated_diameter?.kilometers?.estimated_diameter_min +
                      asteroid.estimated_diameter?.kilometers?.estimated_diameter_max) / 2,
                    'km'
                  )}
                </span>
              </div>

              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wide mb-1">
                  En Yakın Geçiş
                </span>
                <span className="font-semibold">
                  {approach
                    ? new Date(approach.close_approach_date).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Bilinmiyor'}
                </span>
              </div>

              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wide mb-1">
                  Yaklaşma Mesafesi
                </span>
                <span className="font-semibold">
                  {approach ? format(approach.miss_distance?.kilometers, 'km') : 'Bilinmiyor'}
                </span>
              </div>

              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wide mb-1">
                  Hız
                </span>
                <span className="font-semibold">
                  {approach
                    ? format(approach.relative_velocity?.kilometers_per_second, 'km/s')
                    : 'Bilinmiyor'}
                </span>
              </div>

              {/* Ek NASA verileri */}
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wide mb-1">
                  Mutlak Parlaklık (H)
                </span>
                <span className="font-semibold">
                  {asteroid.absolute_magnitude_h || 'Bilinmiyor'}
                </span>
              </div>

              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wide mb-1">
                  Yörünge Türü
                </span>
                <span className="font-semibold">
                  {approach?.orbiting_body || 'Bilinmiyor'}
                </span>
              </div>
            </div>

            {asteroid.is_potentially_hazardous_asteroid && (
              <div className="bg-transparent text-red-600 dark:text-red-400 rounded-xl p-4 mt-2 text-sm">
                <strong>Potansiyel olarak tehlikeli nesne</strong>
                <p className="mt-1">
                  Bu asteroid, Dünya'ya yakın geçen ve belirli bir çap eşiğini aşan nesneler
                  sınıfına girer. NASA bu cisimleri yakından izlemektedir.
                </p>
              </div>
            )}

            <div className="pt-4 text-xs text-gray-500 dark:text-gray-500">
              Kaynak: NASA Near Earth Object Web Service (NEO)
            </div>
          </div>
        </div>

        {/* Alt buton çubuğu */}
        <div className="bg-transparent p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium hover:opacity-80 transition-all"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsteroidDetailModal;
