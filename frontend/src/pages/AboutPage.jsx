// ECNN - Kopya/frontend/src/pages/AboutPage.jsx (Yeni Dosya)
import React from 'react';
import { FaUsers, FaNewspaper, FaShieldAlt, FaLightbulb, FaEnvelope, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import MetaTags from '../components/seo/MetaTags';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary">
      <MetaTags
        title="Hakkımızda - OpenWall"
        description="OpenWall, açık kaynak güvenlik ve teknoloji dünyasından en güncel haberler, derinlemesine analizler ve uzman içgörüleri sunan güvenilir platform."
        keywords="hakkımızda, openwall, siber güvenlik, açık kaynak, teknoloji, platform, makale, blog"
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark-primary dark:to-dark-primary py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-[#f5f5f5] leading-relaxed max-w-3xl mx-auto">
              Açık kaynak güvenlik ve teknoloji dünyasından en güncel haberler, 
              derinlemesine analizler ve uzman içgörüleri sunan güvenilir platform
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Misyonumuz
              </h2>
              <p className="text-lg text-slate-600 dark:text-[#f5f5f5] leading-relaxed">
                Güvenli bir dijital gelecek için güvenilir bilgi kaynağı olmak
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-slate-600 dark:text-[#f5f5f5] leading-relaxed">
                  OpenWall, 2024 yılında kurulmuş, açık kaynak güvenlik ve teknoloji 
                  alanında uzmanlaşmış bir platformdur. Amacımız, okuyucularımıza 
                  güvenilir, doğru ve güncel bilgiler sunarak dijital güvenlik 
                  konusunda farkındalık yaratmaktır.
                </p>
                <p className="text-slate-600 dark:text-[#f5f5f5] leading-relaxed">
                  Uzman yazarlarımız ve editörlerimiz, siber güvenlik, açık kaynak 
                  teknolojiler, yazılım geliştirme ve dijital dönüşüm konularında 
                  derinlemesine analizler sunmaktadır. Platformumuz, hem yeni başlayanlar 
                  hem de deneyimli profesyoneller için değerli içerikler barındırır.
                </p>
              </div>
              <div className="bg-gradient-to-br from-brand-orange/10 to-orange-500/10 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-orange mb-2">10K+</div>
                    <div className="text-sm text-slate-600 dark:text-[#f5f5f5]">Aktif Okuyucu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-orange mb-2">500+</div>
                    <div className="text-sm text-slate-600 dark:text-[#f5f5f5]">Kaliteli Makale</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-orange mb-2">50+</div>
                    <div className="text-sm text-slate-600 dark:text-[#f5f5f5]">Uzman Yazar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-orange mb-2">24/7</div>
                    <div className="text-sm text-slate-600 dark:text-[#f5f5f5]">Güncel İçerik</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Değerlerimiz
              </h2>
              <p className="text-lg text-slate-600 dark:text-[#f5f5f5] max-w-2xl mx-auto">
                Platformumuzun temelini oluşturan değerler ve prensipler
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Güvenilirlik
                </h3>
                <p className="text-slate-600 dark:text-[#f5f5f5] text-sm">
                  Doğru ve güvenilir bilgi sunmak en önemli önceliğimizdir
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaLightbulb className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  İnovasyon
                </h3>
                <p className="text-slate-600 dark:text-[#f5f5f5] text-sm">
                  Teknolojik gelişmeleri takip ederek yenilikçi içerikler üretiriz
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Topluluk
                </h3>
                <p className="text-slate-600 dark:text-[#f5f5f5] text-sm">
                  Açık kaynak ruhuyla topluluk odaklı bir platform oluştururuz
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaNewspaper className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Kalite
                </h3>
                <p className="text-slate-600 dark:text-[#f5f5f5] text-sm">
                  Her içeriğimizde en yüksek kalite standartlarını hedefleriz
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Ekibimiz
              </h2>
              <p className="text-lg text-slate-600 dark:text-[#f5f5f5]">
                Deneyimli yazarlarımız ve uzman editörlerimizle kaliteli içerik üretiyoruz
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Uzman Kadromuz
                </h3>
                <p className="text-slate-600 dark:text-[#f5f5f5] leading-relaxed">
                  OpenWall ekibi, siber güvenlik, yazılım geliştirme, açık kaynak 
                  teknolojiler ve dijital dönüşüm alanlarında uzmanlaşmış profesyonellerden 
                  oluşmaktadır. Her birimiz, okuyucularımıza en güncel ve doğru bilgileri 
                  sunmak için sürekli kendimizi geliştiriyoruz.
                </p>
                <p className="text-slate-600 dark:text-[#f5f5f5] leading-relaxed">
                  Ekibimiz, akademik geçmişe sahip araştırmacılar, sektör deneyimi 
                  olan uzmanlar ve aktif olarak teknoloji dünyasında çalışan 
                  profesyonellerden oluşmaktadır.
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#f5f5f5]">Siber Güvenlik Uzmanları</span>
                    <span className="text-slate-900 dark:text-white font-semibold">15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#f5f5f5]">Yazılım Geliştiriciler</span>
                    <span className="text-slate-900 dark:text-white font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#f5f5f5]">Açık Kaynak Katkıdaşları</span>
                    <span className="text-slate-900 dark:text-white font-semibold">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#f5f5f5]">Editörler</span>
                    <span className="text-slate-900 dark:text-white font-semibold">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                İletişim
              </h2>
              <p className="text-lg text-slate-600 dark:text-[#f5f5f5]">
                Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçin
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    İletişim Bilgileri
                  </h3>
                  <div className="space-y-4">
                    <a 
                      href="mailto:info@openwall.com" 
                      className="flex items-center text-slate-600 dark:text-[#f5f5f5] hover:text-brand-orange transition-colors"
                    >
                      <FaEnvelope className="w-5 h-5 mr-3" />
                      info@openwall.com
                    </a>
                    <div className="flex items-center space-x-4">
                      <a 
                        href="https://x.com/WrittenbyAlper" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-600 dark:text-[#f5f5f5] hover:text-brand-orange transition-colors"
                      >
                        <FaTwitter className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://github.com/openwall" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-600 dark:text-[#f5f5f5] hover:text-brand-orange transition-colors"
                      >
                        <FaGithub className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://linkedin.com/company/openwall" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-600 dark:text-[#f5f5f5] hover:text-brand-orange transition-colors"
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    Çalışma Saatleri
                  </h3>
                  <div className="space-y-2 text-slate-600 dark:text-[#f5f5f5]">
                    <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                    <p>Cumartesi: 10:00 - 16:00</p>
                    <p>Pazar: Kapalı</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  Mesaj Gönderin
                </h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#f5f5f5] mb-2">
                      Ad Soyad
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-colors"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#f5f5f5] mb-2">
                      E-posta
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-colors"
                      placeholder="E-posta adresiniz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#f5f5f5] mb-2">
                      Mesaj
                    </label>
                    <textarea 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-colors h-32 resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-brand-orange text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Mesaj Gönder
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

