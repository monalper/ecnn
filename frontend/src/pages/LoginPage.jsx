// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext'ten login fonksiyonu
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext'ten login fonksiyonu
  const { theme } = useTheme();

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
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      
      // Check if user is admin - redirect to admin login if they are
      if (data.user && data.user.isAdmin) {
        setError('Admin kullanıcıları için lütfen admin giriş sayfasını kullanın.');
        setLoading(false);
        return;
      }
      
      login(data.token, data.user);
      navigate('/');

    } catch (err) {
      console.error("Giriş yapılırken hata:", err);
      setError(err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin veya daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto pb-20">
      <div className="text-center mb-8">
        <div className="mb-6">
          <img 
            src="/headerlogo.svg" 
            alt="Openwall Logo" 
            className="w-20 h-20 mx-auto"
            style={{
              filter: theme === 'dark' 
                ? 'brightness(1) opacity(0.9)' 
                : 'brightness(0) opacity(0.8)'
            }}
          />
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Giriş Yap
        </h2>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
          Hesabınız yok mu?{' '}
          <Link to="/register" className={`underline transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
            Hesap oluşturun
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={`w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' 
                ? 'bg-gray-700 text-white placeholder-gray-400' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="E-posta"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="password"
            id="password"
            name="password"
            required
            className={`w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' 
                ? 'bg-gray-700 text-white placeholder-gray-400' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Şifre"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="text-blue-400 text-sm text-center bg-blue-900/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
