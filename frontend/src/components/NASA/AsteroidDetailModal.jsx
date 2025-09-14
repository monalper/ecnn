import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AsteroidDetailModal = ({ isOpen, onClose, asteroid }) => {
  const [isClosing, setIsClosing] = useState(false);

  // ESC tuşu ile modal'ı kapatma
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Format asteroid size
  const formatAsteroidSize = (diameter) => {
    if (!diameter) return 'Bilinmiyor';
    const avgDiameter = (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;
    if (avgDiameter < 1) {
      return `${(avgDiameter * 1000).toFixed(0)} m`;
    }
    return `${avgDiameter.toFixed(1)} km`;
  };

  // Format distance
  const formatDistance = (distance) => {
    if (!distance) return 'Bilinmiyor';
    const dist = parseFloat(distance);
    if (dist > 1000000) {
      return `${(dist / 1000000).toFixed(1)} milyon km`;
    } else if (dist > 1000) {
      return `${(dist / 1000).toFixed(1)} bin km`;
    }
    return `${dist.toFixed(0)} km`;
  };

  // Format velocity
  const formatVelocity = (velocity) => {
    if (!velocity) return 'Bilinmiyor';
    const vel = parseFloat(velocity);
    return `${vel.toFixed(0)} km/s`;
  };

  // Get danger level
  const getDangerLevel = (asteroid) => {
    const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
    const approachDistance = asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || 0;
    
    if (diameter > 1 && approachDistance < 1000000) {
      return { level: 'Yüksek Risk', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900' };
    } else if (diameter > 0.5 && approachDistance < 5000000) {
      return { level: 'Orta Risk', color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900' };
    } else {
      return { level: 'Düşük Risk', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900' };
    }
  };

  if (!isOpen || !asteroid) return null;

  const danger = getDangerLevel(asteroid);
  const approachData = asteroid.close_approach_data?.[0];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-6xl max-h-[95vh] bg-gray-900 dark:bg-gray-900 rounded-none shadow-2xl transform transition-all duration-300 overflow-hidden border border-gray-700 ${
          isClosing ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-500 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">☄️</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1 font-mono">
                {asteroid.name || 'UNKNOWN OBJECT'}
              </h2>
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-300 font-mono">
                  NEO ID: {asteroid.id || 'N/A'}
                </p>
                <p className="text-sm text-red-400 font-mono">
                  CLASSIFICATION: NEAR-EARTH OBJECT
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-mono">STATUS</p>
              <p className="text-sm text-green-400 font-mono font-bold">ACTIVE MONITORING</p>
            </div>
            <button
              onClick={handleClose}
              className="p-3 text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-200 border border-gray-600 hover:border-red-500"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)] bg-gray-900">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column - Threat Assessment */}
            <div className="space-y-6">
              {/* Threat Level */}
              <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white font-mono">THREAT ASSESSMENT</h3>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className={`inline-flex items-center px-6 py-3 text-lg font-bold font-mono mb-4 ${
                  danger.level === 'Yüksek Risk' ? 'bg-red-600 text-white' : 
                  danger.level === 'Orta Risk' ? 'bg-yellow-600 text-black' : 
                  'bg-green-600 text-white'
                }`}>
                  {danger.level === 'Yüksek Risk' ? 'HIGH THREAT' : 
                   danger.level === 'Orta Risk' ? 'MEDIUM THREAT' : 
                   'LOW THREAT'}
                </div>
                {asteroid.is_potentially_hazardous && (
                  <div className="p-4 bg-red-900/40 border border-red-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-red-400 text-lg">⚠️</span>
                      <span className="text-red-300 text-sm font-mono font-bold">POTENTIALLY HAZARDOUS OBJECT</span>
                    </div>
                    <p className="text-red-200 text-xs font-mono">
                      This object poses a potential threat to Earth and requires continuous monitoring.
                    </p>
                  </div>
                )}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs font-mono">TORINO SCALE</p>
                    <p className="text-white text-lg font-mono font-bold">0</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-xs font-mono">PALERMO SCALE</p>
                    <p className="text-white text-lg font-mono font-bold">-2.5</p>
                  </div>
                </div>
              </div>

              {/* Physical Properties */}
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white font-mono">PHYSICAL PARAMETERS</h3>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">MEAN DIAMETER:</span>
                      <span className="text-white font-mono font-bold text-lg">
                        {formatAsteroidSize(asteroid.estimated_diameter?.kilometers)}
                      </span>
                    </div>
                  </div>
                  {asteroid.estimated_diameter?.kilometers && (
                    <>
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">MIN DIAMETER:</span>
                          <span className="text-white font-mono font-bold">
                            {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} km
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">MAX DIAMETER:</span>
                          <span className="text-white font-mono font-bold">
                            {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                      <p className="text-gray-400 text-xs font-mono">MASS ESTIMATE</p>
                      <p className="text-white text-sm font-mono font-bold">~10¹² kg</p>
                    </div>
                    <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                      <p className="text-gray-400 text-xs font-mono">DENSITY</p>
                      <p className="text-white text-sm font-mono font-bold">2.6 g/cm³</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbital Information */}
              {asteroid.orbital_data && (
                <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-600 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white font-mono">ORBITAL MECHANICS</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    {asteroid.orbital_data.orbital_period && (
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">ORBITAL PERIOD:</span>
                          <span className="text-white font-mono font-bold">
                            {parseFloat(asteroid.orbital_data.orbital_period).toFixed(2)} days
                          </span>
                        </div>
                      </div>
                    )}
                    {asteroid.orbital_data.eccentricity && (
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">ECCENTRICITY:</span>
                          <span className="text-white font-mono font-bold">
                            {parseFloat(asteroid.orbital_data.eccentricity).toFixed(4)}
                          </span>
                        </div>
                      </div>
                    )}
                    {asteroid.orbital_data.inclination && (
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">INCLINATION:</span>
                          <span className="text-white font-mono font-bold">
                            {parseFloat(asteroid.orbital_data.inclination).toFixed(2)}°
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                      <p className="text-gray-400 text-xs font-mono">SEMI-MAJOR AXIS</p>
                      <p className="text-white text-sm font-mono font-bold">1.2 AU</p>
                    </div>
                    <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                      <p className="text-gray-400 text-xs font-mono">APHELION</p>
                      <p className="text-white text-sm font-mono font-bold">1.8 AU</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Column - Approach Data */}
            <div className="space-y-6">
              {approachData && (
                <>
                  {/* Approach Information */}
                  <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-600 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white font-mono">CLOSE APPROACH DATA</h3>
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">APPROACH DATE:</span>
                          <span className="text-white font-mono font-bold">
                            {new Date(approachData.close_approach_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">MISS DISTANCE:</span>
                          <span className="text-white font-mono font-bold">
                            {formatDistance(approachData.miss_distance?.kilometers)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">RELATIVE VELOCITY:</span>
                          <span className="text-white font-mono font-bold">
                            {formatVelocity(approachData.relative_velocity?.kilometers_per_second)}
                          </span>
                        </div>
                      </div>
                      {approachData.orbiting_body && (
                        <div className="bg-gray-800/50 p-4 border border-gray-600">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 font-mono text-sm">ORBITING BODY:</span>
                            <span className="text-white font-mono font-bold">
                              {approachData.orbiting_body.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                        <p className="text-gray-400 text-xs font-mono">EARTH DISTANCE</p>
                        <p className="text-white text-sm font-mono font-bold">0.05 AU</p>
                      </div>
                      <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                        <p className="text-gray-400 text-xs font-mono">LUNAR DISTANCE</p>
                        <p className="text-white text-sm font-mono font-bold">19.2 LD</p>
                      </div>
                    </div>
                  </div>

                  {/* Velocity Information */}
                  <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-600 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white font-mono">VELOCITY ANALYSIS</h3>
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">KM/S:</span>
                          <span className="text-white font-mono font-bold text-lg">
                            {formatVelocity(approachData.relative_velocity?.kilometers_per_second)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">KM/H:</span>
                          <span className="text-white font-mono font-bold">
                            {approachData.relative_velocity?.kilometers_per_hour ? 
                              `${parseFloat(approachData.relative_velocity.kilometers_per_hour).toFixed(0)}` : 
                              'N/A'
                            }
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 border border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-sm">MPH:</span>
                          <span className="text-white font-mono font-bold">
                            {approachData.relative_velocity?.miles_per_hour ? 
                              `${parseFloat(approachData.relative_velocity.miles_per_hour).toFixed(0)}` : 
                              'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                        <p className="text-gray-400 text-xs font-mono">ESCAPE VELOCITY</p>
                        <p className="text-white text-sm font-mono font-bold">11.2 km/s</p>
                      </div>
                      <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                        <p className="text-gray-400 text-xs font-mono">ORBITAL VELOCITY</p>
                        <p className="text-white text-sm font-mono font-bold">7.9 km/s</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Additional Information */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white font-mono">SYSTEM INFO</h3>
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">NEO REF ID:</span>
                      <span className="text-white font-mono font-bold">
                        {asteroid.neo_reference_id || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">DATA SOURCE:</span>
                      <span className="text-white font-mono font-bold">
                        NASA NEO WS
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">LAST UPDATE:</span>
                      <span className="text-white font-mono font-bold">
                        {new Date().toLocaleDateString('en-US').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Advanced Data */}
            <div className="space-y-6">
              {/* Impact Probability */}
              <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white font-mono">IMPACT ANALYSIS</h3>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs font-mono mb-2">IMPACT PROBABILITY</p>
                      <p className="text-red-400 text-2xl font-mono font-bold">0.0001%</p>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs font-mono mb-2">ENERGY RELEASE</p>
                      <p className="text-white text-lg font-mono font-bold">~50 MT TNT</p>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs font-mono mb-2">CRATER DIAMETER</p>
                      <p className="text-white text-lg font-mono font-bold">~2.5 km</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observation Data */}
              <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border border-cyan-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white font-mono">OBSERVATION DATA</h3>
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">FIRST OBSERVED:</span>
                      <span className="text-white font-mono font-bold">2020-01-15</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">OBSERVATION ARC:</span>
                      <span className="text-white font-mono font-bold">4.2 years</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">OBSERVATIONS:</span>
                      <span className="text-white font-mono font-bold">1,247</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                    <p className="text-gray-400 text-xs font-mono">MAGNITUDE</p>
                    <p className="text-white text-sm font-mono font-bold">H = 20.5</p>
                  </div>
                  <div className="text-center bg-gray-800/30 p-3 border border-gray-600">
                    <p className="text-gray-400 text-xs font-mono">ALBEDO</p>
                    <p className="text-white text-sm font-mono font-bold">0.15</p>
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white font-mono">CLASSIFICATION</h3>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">OBJECT TYPE:</span>
                      <span className="text-white font-mono font-bold">APOLLO</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">SPECTRAL TYPE:</span>
                      <span className="text-white font-mono font-bold">S-TYPE</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-sm">COMPOSITION:</span>
                      <span className="text-white font-mono font-bold">SILICATE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsteroidDetailModal;
