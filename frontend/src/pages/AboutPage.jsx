// ECNN - Kopya/frontend/src/pages/AboutPage.jsx
import React from 'react';
import MetaTags from '../components/seo/MetaTags';
import ThreeDModelViewer from '../components/3DModelViewer';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <MetaTags
        title="Hakkımızda - OpenWall"
        description="OpenWall, entellektüel konularda kaliteli içerikler sunan, düşünce dünyasını keşfetmeye odaklanmış bir platformdur."
        keywords="hakkımızda, openwall, entellektüel, düşünce, makale, blog, felsefe, teknoloji, sanat"
      />
      
      {/* Dark Blue Header Section - Mobile Responsive */}
      <section className="h-1/2 sm:h-2/3 flex items-center justify-start px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white leading-tight">
            Hakkımızda
          </h1>
        </div>
      </section>

      {/* Content Section - Mobile Responsive */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quote - Mobile Responsive */}
          <blockquote className="text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-6 sm:mb-8 italic">
            <span className="font-semibold">"Bilgi gizlenirse yok olur, paylaşılırsa yaşar."</span> — Francis Bacon
          </blockquote>

          {/* Main Description with Highlighted Text - Mobile Responsive */}
          <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-6 sm:mb-8 font-semibold">
            OpenWall, <span className="bg-yellow-300 dark:bg-yellow-400 dark:text-black px-1">entellektüel merakı olan insanlar için</span> bir buluşma noktası olarak tasarlandı. Amacımız, farklı alanlardaki düşünceleri, fikirleri ve keşifleri paylaşarak zengin bir düşünce ekosistemi oluşturmak. Teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunarak, <span className="bg-yellow-300 dark:bg-yellow-400 dark:text-black px-1">okuyucularımızın ufuklarını genişletmeyi hedefliyoruz.</span>
          </p>

          {/* Mission Statement - Mobile Responsive */}
          <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-8 sm:mb-12 font-semibold">
            Openwall'un temsil ettiği görüş, bilgi, kültür ve sanatın sadece parası olanlar için olmadığıdır. Bu nedenle Openwall açık kaynak kodlu bir sitedir.
          </p>

          {/* Contact Information - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row justify-start gap-6 sm:gap-16 items-start mb-12">
            <div className="w-full sm:w-auto">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">İletişim</p>
              <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 break-all">
                info@monologed.com
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Github</p>
              <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 break-all">
                @monalper/ecnn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Model Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ThreeDModelViewer 
              modelPath="/assets/about3d/paladins_book.glb"
              modelName="Paladins Book"
              scale={100}
            />
            <ThreeDModelViewer 
              modelPath="/assets/about3d2/space_boi.glb"
              modelName="Space Boi"
              scale={100}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

