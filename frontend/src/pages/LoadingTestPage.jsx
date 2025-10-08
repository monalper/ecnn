import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const LoadingTestPage = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          Loading Animasyon Test Sayfası
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Small Loading */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Küçük Boyut</h3>
            <div className="flex justify-center">
              <LoadingSpinner size="small" text="Küçük yükleme..." />
            </div>
          </div>

          {/* Medium Loading */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Orta Boyut</h3>
            <div className="flex justify-center">
              <LoadingSpinner size="medium" text="Orta yükleme..." />
            </div>
          </div>

          {/* Large Loading */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Büyük Boyut</h3>
            <div className="flex justify-center">
              <LoadingSpinner size="large" text="Büyük yükleme..." />
            </div>
          </div>

          {/* Extra Large Loading */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Çok Büyük Boyut</h3>
            <div className="flex justify-center">
              <LoadingSpinner size="xlarge" text="Çok büyük yükleme..." />
            </div>
          </div>

          {/* Without Text */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Metinsiz</h3>
            <div className="flex justify-center">
              <LoadingSpinner size="medium" text="" showText={false} />
            </div>
          </div>

          {/* Overlay Loading */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Overlay Örneği</h3>
            <button 
              onClick={() => setShowOverlay(!showOverlay)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {showOverlay ? 'Overlay\'i Kapat' : 'Overlay\'i Göster'}
            </button>
            {showOverlay && (
              <LoadingSpinner 
                size="large" 
                text="Overlay yükleme..." 
                overlay={true}
              />
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Tüm sayfalarda artık bu ortak loading animasyonu kullanılıyor.
          </p>
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
            <span>Diagonal stripes loader:</span>
            <div className="loader" style={{ width: '1.5rem', height: '1.5rem', margin: '0' }}></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Aydınlık tema: Siyah çizgili (#000) | Karanlık tema: Beyaz çizgili (#FFF)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingTestPage;
