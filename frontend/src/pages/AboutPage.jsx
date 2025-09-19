import React, { useState, useEffect } from 'react';
import { 
  FiClock,
  FiBookOpen,
  FiEye,
  FiMail,
  FiGithub
} from 'react-icons/fi';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import './AboutPage.mobile.css';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Scroll progress tracking (inspired by article page)
  useEffect(() => {
    const handleScroll = () => {
      const content = document.querySelector('.about-content');
      if (content) {
        const rect = content.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight) {
          const contentHeight = content.scrollHeight;
          const contentTop = content.offsetTop;
          const scrollTop = window.scrollY;
          
          const contentScrollTop = Math.max(0, scrollTop - contentTop);
          const contentVisibleHeight = Math.min(contentHeight, windowHeight);
          
          let percent = 0;
          if (contentScrollTop > 0) {
            percent = Math.min(100, (contentScrollTop / (contentHeight - contentVisibleHeight)) * 100);
          }
          
          setScrollPercent(Math.max(0, Math.min(100, percent)));
        } else {
          setScrollPercent(0);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aboutContent = {
    title: "Hakkımızda",
    subtitle: "The Openwall Platform Tanıtımı",
    lastUpdated: "Son güncelleme: Eylül 2025",
    readingTime: "3 dakika",
    wordCount: 1247,
    sections: [
      {
        id: 'mission',
        title: "Misyonumuz ve Vizyonumuz",
        content: "The Openwall Archive, 2025 yılında, dünyadaki makaleleri yayınlamak üzere kurulmuş ancak telif hakkı gibi birçok problemden dolayı kişisel bir arşiv haline gelmiştir."
      },
      {
        id: 'philosophy',
        title: "Felsefemiz",
        content: "Openwall'un temsil ettiği görüş, bilgi, kültür ve sanatın sadece parası olanlar için olmadığıdır. Bu nedenle Openwall açık kaynak kodlu bir sitedir. 'Bilgi gizlenirse yok olur, paylaşılırsa yaşar' sözünden ilham alarak, bilgiyi herkesle paylaşmayı ve entellektüel gelişimi desteklemeyi amaçlıyoruz."
      },
      {
        id: 'content-areas',
        title: "İçerik Alanlarımız",
        content: "Platformumuzda teknoloji, felsefe, sanat, spor, siyaset, ekonomi, sağlık, eğitim, çevre, sosyoloji, psikoloji, din, müzik, sinema, seyahat ve yemek gibi çeşitli alanlarda kaliteli içerikler sunuyoruz. Her alanda uzman yazarlarımızın kaliteli makaleleri, analizleri ve değerlendirmeleri ile okuyucularımızın bilgi dağarcığını zenginleştirmeyi hedefliyoruz."
      },
      {
        id: 'community',
        title: "Topluluk ve Etkileşim",
        content: "OpenWall, sadece bir içerik platformu değil, aynı zamanda düşünce alışverişi yapılan bir topluluk platformudur. Okuyucularımızın yorumları, eleştirileri ve katkıları ile içeriklerimizi zenginleştiriyor, karşılıklı öğrenme ortamı oluşturuyoruz. Herkesin fikirlerini özgürce ifade edebileceği, saygı çerçevesinde tartışabileceği bir platform sunuyoruz."
      }
    ]
  };

  return (
    <div className="min-h-screen select-none">
      <MetaTags
        title="Hakkımızda"
        description="Openwall platformu hakkında bilgi edinin"
        keywords="hakkımızda, Openwall, entellektüel, düşünce, makale, blog, felsefe, teknoloji, sanat"
      />
      <SchemaMarkup />

      {/* Hero Section - Inspired by article page */}
      <div className="relative w-full h-[70vw] md:aspect-[4/3] md:h-[70vh] lg:h-[80vh] md:min-h-[500px] lg:min-h-[600px] bg-black">
        <img
          src="/AboutUsPageBanner.png"
          alt="About Us Background"
          className="w-full h-full object-cover object-center opacity-90 select-none pointer-events-none"
        />
        {/* Overlay with title */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="hidden md:block text-[72px] font-garamond text-white font-medium leading-none max-w-4xl mb-4">
              {aboutContent.title}
          </h1>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout inspired by article page */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 md:py-8 lg:py-12">
          <div className="block lg:grid lg:grid-cols-4 lg:gap-12">
            
            {/* Sidebar - Inspired by article page */}
            <div className="order-1 lg:order-1 mb-8 lg:mb-0">
              <div className="lg:sticky lg:top-28 lg:self-start">
                {/* Mobile: Title and meta card */}
                <div className="block lg:hidden mb-6">
                  <h1 className="text-[42px] md:text-4xl lg:text-5xl xl:text-6xl font-garamond text-gray-900 dark:text-white font-medium leading-none max-w-4xl mb-4">
                    {aboutContent.title}
                  </h1>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FiClock className="w-4 h-4" />
                      <span>{aboutContent.readingTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiBookOpen className="w-4 h-4" />
                      <span>{aboutContent.wordCount} kelime</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiEye className="w-4 h-4" />
                      <span>{aboutContent.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop: Sidebar */}
                <div className="hidden lg:block">
                  {/* Article Title - Only visible when hero title is not visible */}
                  {scrollPercent > 1 && (
                    <div className="pb-3 mb-4 lg:mb-0">
                      <h1 className="text-xl font-inter font-bold text-gray-900 dark:text-white leading-tight">
                        {aboutContent.title}
                      </h1>
                    </div>
                  )}
                  
                  {/* Reading Information */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {aboutContent.wordCount} kelime, {aboutContent.readingTime}
                    </p>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {aboutContent.lastUpdated}
                    </p>
                  </div>

          {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">İletişim</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <FiMail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">info@monologed.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiGithub className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">@monalper/ecnn</span>
                      </div>
                    </div>
                  </div>

                  {/* Reading Progress */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Okuma İlerlemesi</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(scrollPercent)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${scrollPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Bottom, Desktop: Right - Main Article Content */}
            <div className="order-2 lg:col-span-3">
              <div className="about-content prose prose-sm md:prose-base lg:prose-lg max-w-none lg:-mt-8">

                {/* Body Text */}
                <div className="space-y-8">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    To Ideas and Beyond...
                    <br />
                    <br />
                    The Openwall Archive, tamamı açık kaynaklı kişisel bir arşivdir.
                  </p>
                </div>

                {/* Contact Information for Mobile */}
                <div className="mt-12 lg:hidden">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">İletişim</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiMail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">E-posta</p>
                        <p className="text-base font-medium text-gray-800 dark:text-gray-200">info@monologed.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiGithub className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">GitHub</p>
                        <p className="text-base font-medium text-gray-800 dark:text-gray-200">@monalper/ecnn</p>
                      </div>
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

export default AboutPage;
