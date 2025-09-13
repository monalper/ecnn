import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Yükleniyor...', 
  showText = true,
  className = '',
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'h-6 w-12',
    medium: 'h-8 w-16', 
    large: 'h-10 w-20',
    xlarge: 'h-12 w-24'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const LoadingContent = () => (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Simple capsule shape - red in light theme, white in dark theme */}
        <div className="absolute inset-0 loading-capsule rounded-full animate-pulse"></div>
      </div>
      
      {showText && (
        <p className={`mt-4 font-medium text-slate-600 dark:text-slate-300 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center z-50">
        <LoadingContent />
      </div>
    );
  }

  return <LoadingContent />;
};

export default LoadingSpinner;
