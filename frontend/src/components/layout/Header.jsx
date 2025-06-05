// ECNN - Kopya/frontend/src/components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-site-background border-b border-slate-200 fixed top-0 left-0 right-0 z-50 h-16 md:h-20"> {/* Yüksekliği sabitliyoruz */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        {/* Sol: Turuncu nokta ve menü */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <nav className="flex space-x-3 sm:space-x-4 text-xs sm:text-sm font-sans font-bold tracking-extrawidest uppercase text-text-muted">
            <Link to="/" className="hover:text-text-main transition-colors">BLOG</Link>
            <Link to="/highlights" className="hover:text-text-main transition-colors">HIGHLIGHTS</Link>
            <Link to="/about" className="hover:text-text-main transition-colors">ABOUT</Link>
          </nav>
        </div>
        
        {/* Sağ: openwall logosu */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl md:text-2xl font-bold font-logo text-text-heading tracking-tight">
            openwall
          </Link>
          
          {/* Admin ve Çıkış Butonları (isteğe bağlı, tasarımda yok ama işlevsel olabilir) */}
          {/* Bu kısım tasarımda olmadığı için yorum satırı yapıldı, gerekirse aktif edilebilir. */}
          {/* {!loading && user && (
            <div className="flex items-center space-x-2">
              {user.isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="hidden sm:inline-block text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded-md transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2.5 py-1.5 rounded-md transition-colors"
              >
                Çıkış
              </button>
            </div>
          )}
          {!loading && !user && (
             <Link 
              to="/login" 
              className="text-xs font-medium text-white bg-green-600 hover:bg-green-700 px-2.5 py-1.5 rounded-md transition-colors"
            >
              Giriş
            </Link>
          )}
          */}
        </div>
      </div>
    </header>
  );
};

export default Header;
