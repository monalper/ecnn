// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext'ten login fonksiyonu
// import api from '../services/api'; // AuthContext içinde api kullanılıyor, burada direkt gerek yok.

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext'ten login fonksiyonu

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError(''); // Hata varsa ve kullanıcı yazmaya başlarsa hatayı temizle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!credentials.email || !credentials.password) {
      setError('E-posta ve şifre alanları zorunludur.');
      return;
    }
    setLoading(true);
    try {
      // AuthContext içindeki login fonksiyonu backend'e isteği atacak ve state'i güncelleyecek.
      // Backend'den gelen token ve user bilgisi login fonksiyonuna verilir.
      // login fonksiyonu api.post('/auth/login', credentials) gibi bir şey yapacak.
      // Bu kısım AuthContext'e taşındı, burada direkt login fonksiyonunu çağırıyoruz.
      // const response = await api.post('/auth/login', credentials); // Bu satır AuthContext'e taşındı.
      // login(response.data.token, response.data.user); // Bu satır AuthContext'e taşındı.
      
      // AuthContext.login backend'e isteği atıp token ve user'ı alacak.
      // Başarılı olursa user state'i güncellenecek ve yönlendirme yapılacak.
      // Hata olursa AuthContext.login içinde yakalanıp fırlatılabilir veya burada try-catch ile yakalanabilir.
      // Şimdilik AuthContext.login'in hata durumunda bir exception fırlattığını varsayalım.
      
      // Backend'den gelen user objesiyle birlikte login işlemini AuthContext üzerinden yap
      // Bu yapı için AuthContext'teki login fonksiyonunun backend'e isteği kendisinin yapması gerekir.
      // Veya burada API isteği yapılıp, dönen token ve user AuthContext'e verilir.
      // Mevcut AuthContext yapımızda login(token, user) şeklinde, yani API isteği burada yapılmalı.
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Giriş başarısız oldu.');
      }
      
      login(data.token, data.user); // AuthContext'teki login fonksiyonu çağrılacak

      // Giriş başarılı, admin ise admin paneline, değilse (normalde olmayacak ama) anasayfaya yönlendir.
      // Bu platformda sadece adminler makale yazabildiği için, login yapanın admin olması beklenir.
      if (data.user && data.user.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        // Admin olmayan bir kullanıcı bir şekilde login olursa (backend izin verirse)
        // veya admin yetkisi backend'den gelmezse, anasayfaya yönlendir.
        navigate('/'); 
        // Veya bir hata mesajı göster: "Sadece adminler giriş yapabilir."
        // setError("Bu alana sadece admin yetkisine sahip kullanıcılar giriş yapabilir.");
        // logout(); // Otomatik çıkış yaptır
      }

    } catch (err) {
      console.error("Giriş yapılırken hata:", err);
      setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin veya daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4"> {/* Header yüksekliğini çıkar */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-slate-800">
          Yönetici Girişi
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              E-posta Adresi
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Şifre
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Giriş Yap'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-xs text-center text-slate-500">
          Bu platformda içerik yönetimi sadece yetkili adminler tarafından yapılabilir.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
