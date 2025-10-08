import React, { useState, useEffect } from 'react';
import { 
  FiMail,
  FiGithub
} from 'react-icons/fi';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Header from '../components/layout/Header';

const AboutPage = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  // Scroll progress tracking
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
    subtitle: "The Openwall Platform",
    date: "Son güncelleme: Eylül 2025",
    description: "To Ideas and Beyond..."
  };

  return (
    <>
      <MetaTags
        title="Hakkımızda"
        description="Openwall platformu hakkında bilgi edinin"
        keywords="hakkımızda, Openwall, entellektüel, düşünce, makale, blog, felsefe, teknoloji, sanat"
      />
      <SchemaMarkup />

      <Header scrollPercent={scrollPercent} />

      {/* Title and Cover Image Section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-2 md:pb-3">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-6">
            <div className="text-[20px] text-orange-500 font-medium mb-2">
              {aboutContent.date}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-inter text-gray-900 dark:text-white font-bold leading-tight max-w-4xl mb-4">
              {aboutContent.title}
          </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700/80 dark:text-gray-300/80 font-bold leading-relaxed max-w-4xl mb-4">
              {aboutContent.description}
            </p>
          </div>
          
          {/* Cover Image */}
          <div className="w-full h-[50vw] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
            <img
              src="/AboutUsPageBanner.png"
              alt="About Us"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Single Column Layout */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto pt-2 md:pt-3 pb-6 md:pb-8 lg:pb-12">
          
          {/* Main Content */}
          <div>
            {/* Content */}
            <div className="about-content prose prose-sm md:prose-base lg:prose-lg max-w-none [&_p]:!leading-snug [&_li]:!leading-snug">
              <div className="text-lg md:text-xl lg:text-[22px] !leading-snug text-gray-800 dark:text-gray-300">
                
                <p className="mb-6">
                  The Openwall Archive, tamamı açık kaynaklı kişisel bir arşivdir.
                </p>

                <h2 className="text-2xl md:text-3xl font-inter font-bold text-gray-900 dark:text-white mt-12 mb-6">
                  Misyonumuz ve Vizyonumuz
                </h2>
                <p className="mb-6">
                  The Openwall Archive, 2025 yılında, dünyadaki makaleleri yayınlamak üzere kurulmuş ancak telif hakkı gibi birçok problemden dolayı kişisel bir arşiv haline gelmiştir.
                </p>

                <h2 className="text-2xl md:text-3xl font-inter font-bold text-gray-900 dark:text-white mt-12 mb-6">
                  Felsefemiz
                </h2>
                <p className="mb-6">
                  Openwall'un temsil ettiği görüş, bilgi, kültür ve sanatın sadece parası olanlar için olmadığıdır. Bu nedenle Openwall açık kaynak kodlu bir sitedir. 'Bilgi gizlenirse yok olur, paylaşılırsa yaşar' sözünden ilham alarak, bilgiyi herkesle paylaşmayı ve entellektüel gelişimi desteklemeyi amaçlıyoruz.
                </p>

          {/* Contact Information */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl md:text-3xl font-inter font-bold text-gray-900 dark:text-white mb-6">
                    İletişim
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiMail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">E-posta</p>
                        <p className="text-base font-medium text-gray-800 dark:text-gray-200">info@monologed.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiGithub className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
    </>
  );
};

export default AboutPage;
