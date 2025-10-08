// ECNN - Kopya/frontend/src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ConditionalHeaderFooter from './components/layout/ConditionalHeaderFooter';
import LoadingSpinner from './components/LoadingSpinner';
import Banner from './components/Banner';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminLayout from './components/layout/AdminLayout';
import AdminPasswordProtection from './components/auth/AdminPasswordProtection';
import Footer from './components/layout/Footer';
import NotFoundPage from './components/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import './dark-header-nav.css'; // Tailwind ve genel stiller

// Ana sayfalar - hemen yükle
const HomePage = lazy(() => import('./pages/HomePage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));

// Diğer sayfalar - lazy loading
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const HighlightsPage = lazy(() => import('./pages/HighlightsPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const ClimateChangePage = lazy(() => import('./pages/ClimateChangePage'));
const DictionaryPage = lazy(() => import('./pages/DictionaryPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const GalleryItemPage = lazy(() => import('./pages/GalleryItemPage'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const VideoDetailPage = lazy(() => import('./pages/VideoDetailPage'));
const VideoDetailDemo = lazy(() => import('./components/video/VideoDetailDemo'));
const LoadingTestPage = lazy(() => import('./pages/LoadingTestPage'));
const ApodPage = lazy(() => import('./pages/ApodPage'));
const AsteroidPage = lazy(() => import('./pages/AsteroidPage'));
const MoonPage = lazy(() => import('./pages/MoonPage'));
const AuthorProfilePage = lazy(() => import('./pages/AuthorProfilePage'));
const SavedArticlesPage = lazy(() => import('./pages/SavedArticlesPage'));

// Admin Sayfaları
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminArticlesListPage = lazy(() => import('./pages/admin/AdminArticlesListPage'));
const CreateArticlePage = lazy(() => import('./pages/admin/CreateArticlePage'));
const EditArticlePage = lazy(() => import('./pages/admin/EditArticlePage'));
const AdminUsersListPage = lazy(() => import('./pages/admin/AdminUsersListPage'));
const AdminCommentsPage = lazy(() => import('./pages/admin/AdminCommentsPage'));
const AdminDictionaryPage = lazy(() => import('./pages/admin/AdminDictionaryPage'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage')); // Admin Galeri
const AdminVideosPage = lazy(() => import('./pages/admin/AdminVideosPage')); // Admin Videolar
const AdminArticlesGSYPage = lazy(() => import('./pages/admin/AdminArticlesGSYPage')); // Admin GSY
const AdminBannersPage = lazy(() => import('./pages/admin/AdminBannersPage')); // Admin Banner'lar
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
  
  // Check if current route is an article detail page, APOD page, asteroid page, moon page, or homepage
  const isArticleDetailPage = location.pathname.match(/^\/articles\/[^\/]+$/);
  const isApodPage = location.pathname.match(/^\/apod(\/.*)?$/);
  const isAsteroidPage = location.pathname.match(/^\/asteroid$/);
  const isMoonPage = location.pathname.match(/^\/moon$/);
  const isHomePage = location.pathname === '/';
  
  // Conditional classes for main element
  const mainClasses = (isArticleDetailPage || isApodPage || isAsteroidPage || isMoonPage || isHomePage)
    ? "flex-grow transition-colors" // No padding at all for article detail, APOD, asteroid, moon pages, and homepage
    : "flex-grow px-4 sm:px-6 lg:px-8 py-8 pt-24 md:pt-28 transition-colors"; // Full padding for other pages

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors">
      <ConditionalHeaderFooter />
      <main className={mainClasses}>
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="medium" text="Sayfa Yükleniyor..." />
          </div>
        }>
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
            <Route path="/loading-test" element={<LoadingTestPage />} />
            <Route path="/apod" element={<ApodPage />} />
            <Route path="/apod/:date" element={<ApodPage />} />
            <Route path="/asteroid" element={<AsteroidPage />} />
            <Route path="/moon" element={<MoonPage />} />
            <Route path="/author/:nickname" element={<AuthorProfilePage />} />
            <Route path="/saved-articles" element={<SavedArticlesPage />} />
            
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />

            <Route path="/admin/login" element={
              <PublicRoute>
                <AdminLoginPage />
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
              <Route path="banners" element={<AdminBannersPage />} />
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
              <Route path="comments" element={
                <AdminPasswordProtection>
                  <AdminCommentsPage />
                </AdminPasswordProtection>
              } />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
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
            <ScrollToTop />
            <AppContent />
          </Router>
        </HelmetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
