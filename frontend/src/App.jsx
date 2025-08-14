// ECNN - Kopya/frontend/src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ConditionalHeaderFooter from './components/layout/ConditionalHeaderFooter';
import ThemeToggleButton from './components/ThemeToggleButton';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminLayout from './components/layout/AdminLayout';
import AdminPasswordProtection from './components/auth/AdminPasswordProtection';
import Footer from './components/layout/Footer';
import './index.css';
import './dark-header-nav.css'; // Tailwind ve genel stiller

const HomePage = lazy(() => import('./pages/HomePage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage')); // Yeni
const AboutPage = lazy(() => import('./pages/AboutPage')); // Yeni
const HighlightsPage = lazy(() => import('./pages/HighlightsPage')); // Yeni
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage')); // Yasal Uyarı
const ClimateChangePage = lazy(() => import('./pages/ClimateChangePage')); // İklim Değişikliği
const DictionaryPage = lazy(() => import('./pages/DictionaryPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage')); // Galeri
const GalleryItemPage = lazy(() => import('./pages/GalleryItemPage')); // Galeri Öğesi
const VideosPage = lazy(() => import('./pages/VideosPage')); // Videolar
const VideoDetailPage = lazy(() => import('./pages/VideoDetailPage')); // Video Öğesi
const VideoDetailDemo = lazy(() => import('./components/video/VideoDetailDemo')); // Video Detay Demo

// Admin Sayfaları
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminArticlesListPage = lazy(() => import('./pages/admin/AdminArticlesListPage'));
const CreateArticlePage = lazy(() => import('./pages/admin/CreateArticlePage'));
const EditArticlePage = lazy(() => import('./pages/admin/EditArticlePage'));
const AdminUsersListPage = lazy(() => import('./pages/admin/AdminUsersListPage'));
const AdminDictionaryPage = lazy(() => import('./pages/admin/AdminDictionaryPage'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage')); // Admin Galeri
const AdminVideosPage = lazy(() => import('./pages/admin/AdminVideosPage')); // Admin Videolar
const AdminArticlesGSYPage = lazy(() => import('./pages/admin/AdminArticlesGSYPage')); // Admin GSY
const DictWordPage = lazy(() => import('./pages/dict/[word]'));

// Admin yetkisi kontrolü için yardımcı bileşen
const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Yetki kontrol ediliyor...</p></div>;
  }
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

// Şifre korumalı admin rotaları için yardımcı bileşen
const AdminPasswordRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Yetki kontrol ediliyor...</p></div>;
  }
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

// Giriş yapmış kullanıcıların login sayfasına gitmesini engellemek için
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Yükleniyor...</p></div>;
  }
  return user ? <Navigate to={user.isAdmin ? "/admin/dashboard" : "/"} replace /> : children;
};

function AppContent() {
  const location = useLocation();
  
  // Check if current route is an article detail page
  const isArticleDetailPage = location.pathname.match(/^\/articles\/[^\/]+$/);
  
  // Conditional classes for main element
  const mainClasses = isArticleDetailPage 
    ? "flex-grow transition-colors" // No padding at all for article detail
    : "flex-grow px-4 sm:px-6 lg:px-8 py-8 pt-24 md:pt-28 transition-colors"; // Full padding for other pages

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors">
      <ConditionalHeaderFooter />
      <ThemeToggleButton />
      <main className={mainClasses}>
        <Suspense fallback={<div className="text-center py-20 text-lg font-semibold">Sayfa Yükleniyor...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/highlights" element={<HighlightsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:id" element={<GalleryItemPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/videos/:id" element={<VideoDetailPage />} />
            <Route path="/dict/:word" element={<DictWordPage />} />
            <Route path="/legal/disclaimer" element={<DisclaimerPage />} />
            <Route path="/climatechange" element={<ClimateChangePage />} />
            <Route path="/dictionary" element={<DictionaryPage />} />
            <Route path="/video-demo" element={<VideoDetailDemo />} />
            
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />

            <Route 
              path="/admin" 
              element={<AdminRoute />}
            >
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="articles/create" element={<CreateArticlePage />} />
              <Route path="articles/:slug/edit" element={<EditArticlePage />} />
              <Route path="dictionary" element={<AdminDictionaryPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="videos" element={<AdminVideosPage />} />
            </Route>

            {/* Şifre korumalı admin rotaları */}
            <Route 
              path="/admin" 
              element={<AdminPasswordRoute />}
            >
              <Route path="articles" element={
                <AdminPasswordProtection>
                  <AdminArticlesListPage />
                </AdminPasswordProtection>
              } />
              <Route path="articles-gsy" element={
                <AdminPasswordProtection>
                  <AdminArticlesGSYPage />
                </AdminPasswordProtection>
              } />
              <Route path="users" element={
                <AdminPasswordProtection>
                  <AdminUsersListPage />
                </AdminPasswordProtection>
              } />
            </Route>

            <Route path="*" element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-400 dark:text-gray-600 mb-4">
                    <span className="animate-letter-reveal letter-1">4</span>
                    <span className="animate-letter-reveal letter-2">0</span>
                    <span className="animate-letter-reveal letter-3">4</span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 animate-text-reveal">
                    Sayfa bulunamadı
                  </p>
                  <Link 
                    to="/" 
                    className="text-brand-orange hover:text-orange-600 font-medium transition-all duration-300 hover:scale-110 inline-block animate-link-reveal"
                  >
                    Anasayfaya dön
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>
      {/* Footer artık ConditionalHeaderFooter içinde değil, burada koşullu olarak render edilecek */}
      {!window.location.pathname.startsWith('/admin') && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HelmetProvider>
          <Router>
            <AppContent />
          </Router>
        </HelmetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
