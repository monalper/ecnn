import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { FiLock, FiMail } from 'react-icons/fi';

const AdminLoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
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

      if (!data.user.isAdmin) {
        setError('Bu sayfa sadece yöneticiler içindir.');
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin giriş hatası:', err);
      setError(err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] px-4">
      <div className="w-full max-w-md bg-[#16181d] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-2xl font-semibold text-white text-center mb-2">
          Admin Paneli
        </h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          Lütfen giriş bilgilerinizi girin
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-400 text-sm">
              E-posta
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-2.5 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder="ornek@site.com"
                className="w-full bg-[#1b1d23] text-gray-200 placeholder-gray-500 rounded-lg pl-10 pr-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-400 text-sm">
              Şifre
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-2.5 text-gray-500" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-[#1b1d23] text-gray-200 placeholder-gray-500 rounded-lg pl-10 pr-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/30 border border-red-700 rounded-md py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f1115]"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-xs text-gray-600 text-center mt-8">
          © {new Date().getFullYear()} Openwall Admin Panel.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
