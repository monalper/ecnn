import React from 'react';
import { FaTwitter } from 'react-icons/fa';

const socialLinks = [
  {
    href: 'https://x.com/WrittenbyAlper',
    label: 'Twitter',
    icon: <FaTwitter className="w-4 h-4" />,
  },
];

const Footer = () => (
  <footer className="bg-white dark:bg-dark-primary border-t border-slate-200 dark:border-[#f5f5f5]/20 mt-16">
    <div className="container mx-auto px-6 py-12">
      {/* Main Footer Content */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
        {/* Brand Section */}
        <div className="flex-1 max-w-md">
          <div className="mb-4">
            <span className="font-logo font-bold text-slate-900 dark:text-white text-2xl">
              Open<span className="italic font-serif font-normal">Wall</span>
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Pek çok entelektüel konuya dair kişisel makaleler içeren ve bünyesinde canlı bir sözlük barındıran bir internet sitesidir.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-3">
              İşlevsel
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/dictionary"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Sözlük
                </a>
              </li>
              <li>
                <a
                  href="/convert"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Dönüştürücü
                </a>
              </li>
              <li>
                <a
                  href="/designer"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Tasarım Araçları
                </a>
              </li>
              <li>
                <a
                  href="/charts"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Grafik Oluşturucu
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-3">
              Navigasyon
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Anasayfa
                </a>
              </li>
              <li>
                <a
                  href="/articles"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Makaleler
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Görseller
                </a>
              </li>
              <li>
                <a
                  href="/videos"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Videolar
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Hakkımızda
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-3">
              İletişim
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:info@monologed.com"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  info@monologed.com
                </a>
              </li>
              <li>
                <a
                  href="/legal/disclaimer"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 text-sm"
                >
                  Yasal Uyarı
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-[#f5f5f5]/20">
        {/* Copyright */}
        <div className="text-slate-500 dark:text-slate-400 text-sm">
          <span className="font-logo font-bold text-slate-900 dark:text-white">
            Open<span className="italic font-serif font-normal">Wall</span>
          </span> &copy; {new Date().getFullYear()}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {socialLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-slate-500 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 