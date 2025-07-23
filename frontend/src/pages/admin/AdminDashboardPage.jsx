// frontend/src/pages/admin/AdminDashboardPage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, linkTo, bgColor = "from-blue-500 to-blue-400" }) => (
  <Link to={linkTo} className={`block p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 bg-gradient-to-br ${bgColor} text-white relative overflow-hidden`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">{value}</p>
        <p className="text-base font-semibold uppercase tracking-wider opacity-90 mt-1">{title}</p>
      </div>
      {icon && <div className="text-5xl opacity-90 drop-shadow-lg">{icon}</div>}
    </div>
    <div className="absolute right-4 bottom-4 opacity-10 text-8xl pointer-events-none select-none">
      {icon}
    </div>
  </Link>
);


const AdminDashboardPage = () => {
  const { user } = useAuth();
  // TODO: Backend'den gerçek istatistikler çekilecek (toplam makale, kullanıcı vb.)
  const stats = {
    totalArticles: 0, // Örnek
    publishedArticles: 0,
    draftArticles: 0,
    totalUsers: 0,
  };

  // useEffect içinde API'dan bu verileri çekebilirsiniz.

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hoş Geldin Kartı */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-r from-blue-50 to-emerald-50 p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-4xl font-bold text-white shadow-md">
          {user?.name ? user.name[0] : (user?.username ? user.username[0] : '?')}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Hoş geldiniz, {user?.name || user?.username}!</h1>
          <p className="text-base md:text-lg text-slate-600 mt-1">OpenWall platformunu buradan yönetebilirsiniz.</p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Toplam Makale" value={stats.totalArticles} icon={<span role="img" aria-label="Makale">📰</span>} linkTo="/admin/articles" bgColor="from-sky-500 to-sky-400" />
        <StatCard title="Toplam Kullanıcı" value={stats.totalUsers} icon={<span role="img" aria-label="Kullanıcı">👥</span>} linkTo="/admin/users" bgColor="from-emerald-500 to-emerald-400" />
        <StatCard title="Yeni Makale Oluştur" value="+" icon={<span role="img" aria-label="Yeni">✏️</span>} linkTo="/admin/articles/create" bgColor="from-amber-500 to-amber-400" />
      </div>

      {/* Hızlı İşlemler Bölümü */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
        <h2 className="text-xl font-bold text-slate-700 mb-6">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/admin/articles/create" className="flex flex-col items-center justify-center p-5 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 shadow group transition-all">
            <svg className="w-8 h-8 mb-2 text-blue-600 group-hover:text-blue-800 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold text-blue-700 group-hover:text-blue-900">Yeni Makale</span>
          </Link>
          <Link to="/admin/dictionary" className="flex flex-col items-center justify-center p-5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 hover:from-amber-200 hover:to-amber-100 shadow group transition-all">
            <svg className="w-8 h-8 mb-2 text-amber-600 group-hover:text-amber-800 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold text-amber-700 group-hover:text-amber-900">Sözlük Yönetimi</span>
          </Link>
          <Link to="/admin/articles" className="flex flex-col items-center justify-center p-5 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 hover:from-emerald-200 hover:to-emerald-100 shadow group transition-all">
            <svg className="w-8 h-8 mb-2 text-emerald-600 group-hover:text-emerald-800 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-semibold text-emerald-700 group-hover:text-emerald-900">Makaleleri Yönet</span>
          </Link>
          <Link to="/admin/users" className="flex flex-col items-center justify-center p-5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 hover:from-amber-200 hover:to-amber-100 shadow group transition-all">
            <svg className="w-8 h-8 mb-2 text-amber-600 group-hover:text-amber-800 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-semibold text-amber-700 group-hover:text-amber-900">Kullanıcıları Görüntüle</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
