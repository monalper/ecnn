import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import SchemaMarkup from '../seo/SchemaMarkup';

const Breadcrumb = ({ items = [] }) => {
  const location = useLocation();
  
  // Otomatik breadcrumb oluştur
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [
      { name: 'Ana Sayfa', url: '/' }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Segment'i daha okunabilir hale getir
      let name = segment;
      switch (segment) {
        case 'articles':
          name = 'Makaleler';
          break;
        case 'admin':
          name = 'Yönetim Paneli';
          break;
        case 'dashboard':
          name = 'Dashboard';
          break;
        case 'users':
          name = 'Kullanıcılar';
          break;
        case 'dictionary':
          name = 'Sözlük';
          break;
        case 'about':
          name = 'Hakkımızda';
          break;
        case 'categories':
          name = 'Kategoriler';
          break;
        case 'highlights':
          name = 'Öne Çıkanlar';
          break;
        case 'legal':
          name = 'Yasal';
          break;
        case 'disclaimer':
          name = 'Yasal Uyarı';
          break;
        case 'gallery':
          name = 'Galeri';
          break;
        case 'videos':
          name = 'Videolar';
          break;
        case 'climatechange':
          name = 'İklim Değişikliği';
          break;
        case 'dict':
          name = 'Sözlük';
          break;
        default:
          // Slug'ı başlık formatına çevir
          name = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
      }
      
      breadcrumbs.push({
        name,
        url: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  // Schema markup için breadcrumb verisi
  const schemaBreadcrumbs = breadcrumbItems.map(item => ({
    name: item.name,
    url: `${window.location.origin}${item.url}`
  }));

  return (
    <>
      <SchemaMarkup 
        type="BreadcrumbList" 
        breadcrumbs={schemaBreadcrumbs}
      />
      
      <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {index === 0 ? (
              <Link 
                to={item.url}
                className="flex items-center hover:text-brand-orange transition-colors"
              >
                <FaHome className="w-4 h-4" />
              </Link>
            ) : (
              <Link 
                to={item.url}
                className={`hover:text-brand-orange transition-colors ${
                  index === breadcrumbItems.length - 1 
                    ? 'text-brand-orange font-semibold' 
                    : ''
                }`}
              >
                {item.name}
              </Link>
            )}
            
            {index < breadcrumbItems.length - 1 && (
              <FaChevronRight className="w-3 h-3 text-slate-400" />
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumb; 