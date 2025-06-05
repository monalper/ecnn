// frontend/src/pages/admin/AdminDashboardPage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, linkTo, bgColor = "bg-blue-500" }) => (
  <Link to={linkTo} className={`block p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 ${bgColor} text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl md:text-4xl font-bold">{value}</p>
        <p className="text-sm font-medium uppercase tracking-wider">{title}</p>
      </div>
      {icon && <div className="text-4xl opacity-80">{icon}</div>}
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Admin Gösterge Paneli</h1>
      <p className="text-lg text-slate-600">Hoş geldiniz, <span className="font-semibold">{user?.name || user?.username}</span>! OpenWall platformunu buradan yönetebilirsiniz.</p>
      
      {/* İstatistik Kartları - Örnek */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Toplam Makale" value={stats.totalArticles} icon="📰" linkTo="/admin/articles" bgColor="bg-sky-500" />
        <StatCard title="Toplam Kullanıcı" value={stats.totalUsers} icon="👥" linkTo="/admin/users" bgColor="bg-emerald-500" />
        <StatCard title="Yeni Makale Oluştur" value="+" icon="✏️" linkTo="/admin/articles/create" bgColor="bg-amber-500" />
        {/* Daha fazla istatistik veya hızlı işlem kartı eklenebilir */}
      </div>

      {/* Son Aktiviteler veya Hızlı Linkler Bölümü - Örnek */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Hızlı İşlemler</h2>
        <div className="space-y-3">
          <Link to="/admin/articles/create" className="block text-blue-600 hover:text-blue-800 hover:underline">Yeni Makale Yaz</Link>
          <Link to="/admin/articles" className="block text-blue-600 hover:text-blue-800 hover:underline">Mevcut Makaleleri Yönet</Link>
          <Link to="/admin/users" className="block text-blue-600 hover:text-blue-800 hover:underline">Kullanıcıları Görüntüle</Link>
          {/* <Link to="/admin/settings" className="block text-blue-600 hover:text-blue-800 hover:underline">Genel Ayarlar</Link> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
