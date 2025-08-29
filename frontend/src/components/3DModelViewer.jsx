import React, { useRef, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PresentationControls, Html } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, onLoad, onError, scale = 10 }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  React.useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);

  useFrame((state) => {
    if (modelRef.current) {
      // Model'i yavaşça döndür (opsiyonel)
      // modelRef.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={[scale, scale, scale]}
      position={[0, 0, 0]}
    />
  );
}

// Loading component
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">3D Model Yükleniyor...</p>
      </div>
    </Html>
  );
}

// Error boundary component
function ErrorBoundary({ children, onError }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <Html center>
        <div className="flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="text-red-600 dark:text-red-400 text-4xl mb-2">⚠️</div>
          <p className="text-red-700 dark:text-red-300 font-medium text-center">
            3D Model yüklenirken bir hata oluştu
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </Html>
    );
  }

  return (
    <ErrorBoundaryWrapper onError={() => setHasError(true)}>
      {children}
    </ErrorBoundaryWrapper>
  );
}

// Simple error boundary wrapper
class ErrorBoundaryWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

const ThreeDModelViewer = ({ modelPath, modelName = "3D Model", scale = 10 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleModelLoad = () => {
    setIsLoading(false);
  };

  const handleModelError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="w-full h-96 sm:h-[500px] lg:h-[600px] bg-transparent">
      <div className="w-full h-full relative">
        <Canvas
          camera={{ 
            position: [0, 0, 8], 
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          style={{ background: 'transparent' }}
          onError={handleModelError}
        >
          <Suspense fallback={<Loader />}>
            <ErrorBoundary onError={handleModelError}>
              {/* Ambient light for overall illumination */}
              <ambientLight intensity={0.6} />
              
              {/* Directional light for shadows and depth */}
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1.2} 
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              
              {/* Point light for additional highlights */}
              <pointLight position={[-10, -10, -5]} intensity={0.8} />
              
              {/* Environment for realistic lighting */}
              <Environment preset="city" />
              
              {/* 3D Model */}
              <Model 
                url={modelPath} 
                onLoad={handleModelLoad}
                onError={handleModelError}
                scale={scale}
              />
              
              {/* Controls for mouse interaction - zoom disabled */}
              <PresentationControls
                global
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
                config={{ mass: 2, tension: 400 }}
                snap={{ mass: 4, tension: 400 }}
              >
                <OrbitControls
                  enablePan={true}
                  enableZoom={false}
                  enableRotate={true}
                  minDistance={5}
                  maxDistance={15}
                  dampingFactor={0.05}
                  rotateSpeed={0.8}
                  panSpeed={1.0}
                />
              </PresentationControls>
            </ErrorBoundary>
          </Suspense>
        </Canvas>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">3D Model Yükleniyor...</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {hasError && (
          <div className="absolute inset-0 bg-red-50/90 dark:bg-red-900/20 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
              <p className="text-red-700 dark:text-red-300 font-medium mb-4">
                3D Model yüklenirken bir hata oluştu
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDModelViewer;
