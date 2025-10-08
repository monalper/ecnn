import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Yükleniyor...', 
  showText = true,
  className = '',
  overlay = false 
}) => {
  const sizeStyles = {
    small: { width: '1.5rem', height: '1.5rem' },
    medium: { width: '2rem', height: '2rem' },
    large: { width: '2.5rem', height: '2.5rem' },
    xlarge: { width: '3rem', height: '3rem' }
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const LoadingContent = () => (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="loader" style={sizeStyles[size]}></div>
      
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
