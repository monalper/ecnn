// ECNN - Kopya/frontend/src/pages/AboutPage.jsx
import React from 'react';
import MetaTags from '../components/seo/MetaTags';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <MetaTags
        title="Hakkımızda - OpenWall"
        description="OpenWall, entellektüel konularda kaliteli içerikler sunan, düşünce dünyasını keşfetmeye odaklanmış bir platformdur."
        keywords="hakkımızda, openwall, entellektüel, düşünce, makale, blog, felsefe, teknoloji, sanat"
      />
      
      {/* Dark Blue Header Section */}
      <section className="h-2/3 flex items-center justify-start px-8">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white">
            Hakkımızda
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quote */}
          <blockquote className="text-lg text-gray-800 dark:text-gray-200 mb-8">
            <span className="font-semibold">"Bilgi gizlenirse yok olur, paylaşılırsa yaşar."</span> — Francis Bacon
          </blockquote>

          {/* Main Description with Highlighted Text */}
          <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-8 font-semibold">
            OpenWall, <span className="bg-yellow-300 dark:bg-yellow-400 dark:text-black px-1">entellektüel merakı olan insanlar için</span> bir buluşma noktası olarak tasarlandı. Amacımız, farklı alanlardaki düşünceleri, fikirleri ve keşifleri paylaşarak zengin bir düşünce ekosistemi oluşturmak. Teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunarak, <span className="bg-yellow-300 dark:bg-yellow-400 dark:text-black px-1">okuyucularımızın ufuklarını genişletmeyi hedefliyoruz.</span>
          </p>

          {/* Mission Statement */}
          <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-12 font-semibold">
            Openwall'un temsil ettiği görüş, bilgi, kültür ve sanatın sadece parası olanlar için olmadığıdır. Bu nedenle Openwall açık kaynak kodlu bir sitedir.
          </p>

          {/* Contact Information */}
          <div className="flex justify-start gap-16 items-start">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">İletişim</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">info@monologed.com</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Github</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">@monalper/ecnn</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
