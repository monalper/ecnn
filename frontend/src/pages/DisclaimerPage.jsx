import React, { useState, useEffect } from 'react';
import { 
  FiShield, 
  FiClock,
  FiBookOpen,
  FiEye
} from 'react-icons/fi';
import MetaTags from '../components/seo/MetaTags';
import SchemaMarkup from '../components/seo/SchemaMarkup';

const DisclaimerPage = () => {
  const [activeTab, setActiveTab] = useState('tr');
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Scroll progress tracking (inspired by article page)
  useEffect(() => {
    const handleScroll = () => {
      const content = document.querySelector('.disclaimer-content');
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

  const disclaimerContent = {
    tr: {
      title: "Yasal Uyarı ve Sorumluluk Reddi",
      subtitle: "TheOpenwall Platform Kullanım Koşulları",
      lastUpdated: "Son güncelleme: Eylül 2025",
      readingTime: "5 dakika",
      wordCount: 2847,
      sections: [
        {
          id: 'general-info',
          title: "Genel Bilgilendirme ve İçerik Politikası",
          content: "The Openwall platformunda sunulan tüm içerikler, makaleler, görseller, videolar, infografikler, veri analizleri, araştırma sonuçları, yorumlar, değerlendirmeler ve diğer tüm materyaller yalnızca genel bilgilendirme ve eğitim amaçlıdır. Bu platformda yer alan her türlü içerik, profesyonel tavsiye, hukuki görüş, tıbbi öneri, finansal danışmanlık, yatırım tavsiyesi, iş stratejisi önerisi veya herhangi bir uzmanlık alanında verilen danışmanlık hizmeti niteliği taşımamaktadır. Platformda sunulan bilgiler genel nitelikte olup, herhangi bir kişi, kurum, durum veya özel koşula yönelik değildir. Ziyaretçiler ve kullanıcılar, bu platformdaki içerikleri kendi sorumluluklarında değerlendirmeli ve önemli kararlar almadan önce mutlaka konuyla ilgili uzmanlardan profesyonel danışmanlık almalıdırlar. Platform içeriklerinin yanlış yorumlanması veya yanlış kullanımından doğabilecek herhangi bir sonuçtan The Openwall sorumlu tutulamaz."
        },
        {
          id: 'liability',
          title: "Sorumluluk Sınırları ve Hukuki Korumalar",
          content: "OpenWall platformu, içeriklerin kullanımından, yorumlanmasından, uygulanmasından veya bu içeriklere dayanarak alınan kararlardan doğabilecek herhangi bir zarar, kayıp, maddi hasar, manevi zarar, veri kaybı, iş kesintisi, kâr kaybı, itibar kaybı, ticari zarar, dolaylı zarar, doğrudan zarar, beklenmeyen zarar, öngörülebilir zarar veya başka herhangi bir olumsuz sonuçtan sorumlu tutulamaz. Platform kullanıcıları, içerikleri kendi sorumluluklarında kullanmayı, bu içeriklerin doğruluğunu bağımsız olarak doğrulamayı ve gerekli önlemleri almayı kabul eder. Platform sahibi, yöneticileri, çalışanları, yazarları, editörleri, moderatörleri ve diğer tüm ilgili kişiler, dolaylı veya doğrudan zararlardan, cezai yaptırımlardan, hukuki sorumluluklardan ve mali yükümlülüklerden sorumlu değildir. Bu sorumluluk reddi, yasal düzenlemelerin izin verdiği maksimum ölçüde geçerlidir."
        },
        {
          id: 'intellectual-property',
          title: "Fikri Mülkiyet Hakları ve Telif Hakkı Koruması",
          content: "Platformda yer alan tüm içerikler, OpenWall'a ait fikri mülkiyet hakları ile korunmaktadır. Bu kapsamda yazılar, makaleler, görseller, videolar, logolar, tasarımlar, yazı tipleri, renk şemaları, düzenler, algoritmalar, veri tabanları, yazılım kodları, kullanıcı arayüzleri, markalar, ticari isimler ve diğer tüm materyaller dahildir. İçeriklerin izinsiz kopyalanması, çoğaltılması, dağıtılması, yayınlanması, ticari amaçla kullanılması, değiştirilmesi, uyarlanması, çevrilmesi, sergilenmesi, performans edilmesi, dijital ortamda iletilmesi, arşivlenmesi, veri tabanına dahil edilmesi veya başka herhangi bir şekilde kullanılması kesinlikle yasaktır. Kullanıcılar, platform içeriklerini yalnızca kişisel kullanım için görüntüleyebilir ve bu hak sınırlıdır. Herhangi bir izinsiz kullanım durumunda, OpenWall yasal haklarını kullanma ve gerekli yasal yollara başvurma hakkını saklı tutar. Ayrıca, platformda üçüncü taraf içerikler de bulunabilir ve bu içeriklerin telif hakları ilgili sahiplerine aittir."
        },
        {
          id: 'user-responsibilities',
          title: "Kullanım Şartları ve Kullanıcı Sorumlulukları",
          content: "Platformu kullanarak, bu yasal uyarıları, kullanım şartlarını, gizlilik politikasını ve diğer tüm yasal düzenlemeleri kabul etmiş sayılırsınız. Platform kullanımı, bu şartların kabulü anlamına gelir ve bu şartları kabul etmeyen kullanıcıların platformu kullanmaması gerekir. Kullanıcılar, platformu yasal amaçlar için kullanmayı, başkalarının haklarına saygı göstermeyi, platform güvenliğini tehdit edecek faaliyetlerde bulunmamayı, spam göndermemeyi, zararlı içerik paylaşmamayı, sistem güvenliğini ihlal etmemeyi, diğer kullanıcıların deneyimini olumsuz etkilememeyi ve genel ahlak kurallarına uymayı kabul eder. Platform yönetimi, uygun görmediği içerikleri kaldırma, kullanıcı hesaplarını askıya alma, kalıcı olarak kapatma veya diğer yasal yaptırımları uygulama hakkını saklı tutar. Bu şartlar, platform kullanımı süresince geçerli olacak ve platform yönetimi tarafından önceden haber verilmeksizin değiştirilebilir."
        },
        {
          id: 'data-security',
          title: "Veri Güvenliği ve Gizlilik Politikası",
          content: "OpenWall platformu, kullanıcı verilerinin güvenliği ve gizliliği konusunda azami özen göstermektedir. Ancak, internet ortamında veri aktarımının doğası gereği, verilerin tam güvenliğini garanti etmek mümkün değildir. Platform, kullanıcı verilerini korumak için endüstri standardı güvenlik önlemleri uygulamaktadır, ancak bu önlemlerin %100 etkili olacağı garanti edilemez. Kullanıcılar, platforma kişisel bilgilerini gönderirken bu riski kabul etmiş sayılırlar. Platform, kullanıcı verilerini yalnızca belirtilen amaçlar için kullanır ve üçüncü taraflarla paylaşmaz. Ancak, yasal zorunluluklar, mahkeme kararları, güvenlik tehditleri veya platform güvenliğinin korunması gerektiği durumlarda veri paylaşımı yapılabilir. Kullanıcılar, verilerinin nasıl toplandığı, kullanıldığı ve korunduğu hakkında detaylı bilgi için gizlilik politikamızı inceleyebilirler."
        },
        {
          id: 'technical-limitations',
          title: "Teknik Sınırlamalar ve Hizmet Kesintileri",
          content: "OpenWall platformu, teknik altyapı, sunucu kapasitesi, internet bağlantısı, yazılım güncellemeleri, bakım çalışmaları, güvenlik güncellemeleri, sistem optimizasyonları ve diğer teknik faktörler nedeniyle geçici veya kalıcı kesintiler yaşayabilir. Platform yönetimi, bu tür kesintileri önlemek için gerekli önlemleri almaktadır, ancak kesintilerin tamamen önlenebileceği garanti edilemez. Kullanıcılar, platform hizmetlerinin kesintisiz olarak sunulamayabileceğini kabul eder ve bu durumdan doğabilecek herhangi bir zarardan platform sorumlu tutulamaz. Ayrıca, platform performansı, kullanıcı sayısı, internet hızı, cihaz özellikleri, tarayıcı uyumluluğu ve diğer faktörlere bağlı olarak değişebilir. Platform, optimal performans için güncel tarayıcılar ve uyumlu cihazlar kullanılmasını önerir."
        }
      ]
    },
    en: {
      title: "Legal Notice and Comprehensive Disclaimer",
      subtitle: "TheOpenwall Platform Terms of Use",
      lastUpdated: "Last updated: September 2025",
      readingTime: "5 minutes",
      wordCount: 2847,
      sections: [
        {
          id: 'general-info',
          title: "General Information and Content Policy",
          content: "All content, articles, images, videos, infographics, data analyses, research results, comments, evaluations, and other materials provided on the OpenWall platform are solely for general informational and educational purposes. Any content on this platform does not constitute professional advice, legal opinion, medical recommendation, financial consultation, investment advice, business strategy recommendation, or any other form of expert consultation in any field. The information provided on the platform is general in nature and is not directed at any specific person, institution, situation, or special condition. Visitors and users should evaluate the content on this platform at their own responsibility and must seek professional consultation from relevant experts before making important decisions. OpenWall cannot be held responsible for any consequences arising from misinterpretation or misuse of platform content."
        },
        {
          id: 'liability',
          title: "Liability Limitations and Legal Protections",
          content: "The OpenWall platform cannot be held responsible for any damage, loss, material damage, moral damage, data loss, business interruption, profit loss, reputation damage, commercial damage, indirect damage, direct damage, unexpected damage, foreseeable damage, or any other negative consequences that may arise from the use, interpretation, application, or decisions based on the content. Platform users accept to use content at their own responsibility, independently verify the accuracy of this content, and take necessary precautions. Platform owners, administrators, employees, authors, editors, moderators, and all other relevant persons are not responsible for indirect or direct damages, criminal sanctions, legal liabilities, and financial obligations. This disclaimer is valid to the maximum extent permitted by legal regulations."
        },
        {
          id: 'intellectual-property',
          title: "Intellectual Property Rights and Copyright Protection",
          content: "All content on the platform is protected by intellectual property rights owned by OpenWall. This includes articles, images, videos, logos, designs, fonts, color schemes, layouts, algorithms, databases, software codes, user interfaces, trademarks, trade names, and all other materials. Unauthorized copying, reproduction, distribution, publication, commercial use, modification, adaptation, translation, display, performance, digital transmission, archiving, inclusion in databases, or any other use of content is strictly prohibited. Users may only view platform content for personal use, and this right is limited. In case of any unauthorized use, OpenWall reserves the right to exercise its legal rights and take necessary legal action. Additionally, third-party content may be found on the platform, and the copyrights of such content belong to their respective owners."
        },
        {
          id: 'user-responsibilities',
          title: "Terms of Use and User Responsibilities",
          content: "By using the platform, you are deemed to have accepted these legal notices, terms of use, privacy policy, and all other legal regulations. Using the platform means accepting these terms, and users who do not accept these terms should not use the platform. Users agree to use the platform for legal purposes, respect the rights of others, not engage in activities that threaten platform security, not send spam, not share harmful content, not violate system security, not negatively affect other users' experience, and comply with general moral rules. Platform management reserves the right to remove content it deems inappropriate, suspend user accounts, permanently close them, or apply other legal sanctions. These terms will be valid during platform use and may be changed by platform management without prior notice."
        },
        {
          id: 'data-security',
          title: "Data Security and Privacy Policy",
          content: "The OpenWall platform exercises maximum care regarding the security and privacy of user data. However, due to the nature of data transmission over the internet, it is not possible to guarantee complete data security. The platform implements industry-standard security measures to protect user data, but it cannot be guaranteed that these measures will be 100% effective. Users are deemed to have accepted this risk when sending personal information to the platform. The platform uses user data only for specified purposes and does not share it with third parties. However, data sharing may occur in cases of legal obligations, court orders, security threats, or when platform security needs to be protected. Users can review our privacy policy for detailed information about how their data is collected, used, and protected."
        },
        {
          id: 'technical-limitations',
          title: "Technical Limitations and Service Interruptions",
          content: "The OpenWall platform may experience temporary or permanent interruptions due to technical infrastructure, server capacity, internet connection, software updates, maintenance work, security updates, system optimizations, and other technical factors. Platform management takes necessary measures to prevent such interruptions, but it cannot be guaranteed that interruptions can be completely prevented. Users accept that platform services may not be provided uninterruptedly, and the platform cannot be held responsible for any damage that may arise from this situation. Additionally, platform performance may vary depending on user count, internet speed, device specifications, browser compatibility, and other factors. The platform recommends using current browsers and compatible devices for optimal performance."
        }
      ]
    }
  };

  const currentContent = disclaimerContent[activeTab];



  return (
    <div className="min-h-screen select-none">
      <MetaTags
        title="Yasal Uyarı"
        description="OpenWall platformu yasal uyarı sayfası"
        keywords="yasal uyarı, sorumluluk reddi"
      />
      <SchemaMarkup />

      {/* Hero Section - Inspired by article page */}
      <div className="relative w-full h-[70vw] md:aspect-[4/3] md:h-[70vh] lg:h-[80vh] md:min-h-[500px] lg:min-h-[600px] bg-black">
        <img
          src="https://miro.medium.com/0*qcIfX26ee4qrcifz"
          alt="Legal Notice Background"
          className="w-full h-full object-cover object-center opacity-90 select-none pointer-events-none"
        />
        {/* Overlay with title */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Gradient overlay for better text readability - hidden on mobile */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/90 via-black/80 via-black/70 via-black/60 via-black/50 via-black/40 via-black/30 via-black/20 via-black/10 via-black/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="hidden md:block text-[72px] font-garamond text-white font-medium leading-none max-w-4xl mb-4">
              {currentContent.title}
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
                    {currentContent.title}
                  </h1>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FiClock className="w-4 h-4" />
                      <span>{currentContent.readingTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiBookOpen className="w-4 h-4" />
                      <span>{currentContent.wordCount} kelime</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiEye className="w-4 h-4" />
                      <span>{currentContent.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop: Sidebar */}
                <div className="hidden lg:block">
                  {/* Article Title - Only visible when hero title is not visible */}
                  {scrollPercent > 1 && (
                    <div className="pb-3 mb-4 lg:mb-0">
                      <h1 className="text-xl font-inter font-bold text-gray-900 dark:text-white leading-tight">
                        {currentContent.title}
                      </h1>
                    </div>
                  )}
                  
                  {/* Reading Information */}
                  <div className="pb-3 mb-4 lg:mb-0">
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {currentContent.wordCount} kelime, {currentContent.readingTime}
                    </p>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                      {currentContent.lastUpdated}
                    </p>
                  </div>

                  {/* Language Toggle */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Dil / Language</h3>
                    <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                      {Object.keys(disclaimerContent).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setActiveTab(lang)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === lang
                              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {lang === 'tr' ? 'TR' : 'EN'}
                        </button>
                      ))}
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
              <div className="disclaimer-content prose prose-sm md:prose-base lg:prose-lg max-w-none lg:-mt-8">
                        {/* Content Sections */}
                <div className="space-y-8">
                  {currentContent.sections.map((section, index) => {
                    return (
                      <div key={section.id}>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          {section.title}
                        </h2>
                        
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    );
                  })}
                </div>

                        {/* Footer */}
                <div className="mt-16 text-center">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {currentContent.lastUpdated}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                      {activeTab === 'tr' 
                        ? 'Bu yasal uyarılar OpenWall platformunun kullanım koşullarını belirler. Platform kullanımı bu şartların kabulü anlamına gelir.'
                        : 'These legal notices define the terms of use for the OpenWall platform. Using the platform means accepting these terms.'
                      }
                    </p>
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

export default DisclaimerPage;
