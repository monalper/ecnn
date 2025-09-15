// frontend/src/components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Çıkış yapmak için

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const commonLinkClasses = "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-base font-medium group";
  const activeClassName = "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-[1.03]";
  const inactiveClassName = "text-slate-300 hover:bg-slate-700 hover:text-white hover:scale-105";

  const headerHeight = "64px";

  return (
    <div className="flex min-h-screen bg-slate-100" style={{ minHeight: `calc(100vh - ${headerHeight})` }}>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-700 text-white shadow-lg md:hidden"
        aria-label="Menüyü Aç/Kapat"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-dark-primary bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 pt-[calc(var(--header-h,64px)+1rem)]`} style={{"--header-h": headerHeight}}>
        {/* Logo ve Kullanıcı */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 mb-2 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white select-none">A</span>
          </div>
          <p className="text-xs text-slate-400">Hoş geldiniz,</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-lg font-semibold">
              {user?.name ? user.name[0] : (user?.username ? user.username[0] : '?')}
            </div>
            <span className="font-semibold text-slate-100 truncate max-w-[110px]">{user?.name || user?.username}</span>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeClassName : inactiveClassName}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V7a2 2 0 00-2-2h-3.5"></path></svg>
            Gösterge Paneli
          </NavLink>
          <NavLink
            to="/admin/articles"
            className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeClassName : inactiveClassName}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h8m-8-4h8m-8-4h8M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6"></path></svg>
            Makaleler
          </NavLink>
          <NavLink
            to="/admin/gallery"
            className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeClassName : inactiveClassName}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Galeri
          </NavLink>
          <NavLink
            to="/admin/videos"
            className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeClassName : inactiveClassName}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            Videolar
          </NavLink>
          <NavLink
            to="/admin/comments"
            className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeClassName : inactiveClassName}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            Yorumlar
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeClassName : inactiveClassName}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 8a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Kullanıcılar
          </NavLink>
          <NavLink
            to="/admin/banners"
            className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeClassName : inactiveClassName}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            Banner'lar
          </NavLink>
        </nav>
        {/* Profil ve Çıkış Butonu */}
        <div className="mt-auto pt-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-200 hover:bg-red-600 hover:text-white transition-all duration-200 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 bg-slate-100 min-h-screen overflow-y-auto" style={{ paddingTop: `calc(var(--header-h,64px)+1.5rem)` }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;