// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Kullanıcı adı, e-posta ve şifre alanları zorunludur.');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Kullanım şartlarını kabul etmelisiniz.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (formData.username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalıdır.');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Geçerli bir e-posta adresi giriniz.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register-public', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name || formData.username
      });

      setSuccess('Hesabınız başarıyla oluşturuldu! Giriş yapabilirsiniz.');
      
      // Auto login after successful registration
      try {
        const loginResponse = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        login(loginResponse.data.token, loginResponse.data.user);
        navigate('/');
      } catch (loginError) {
        console.error("Otomatik giriş hatası:", loginError);
        // Registration was successful, just redirect to login
        navigate('/login');
      }

    } catch (err) {
      console.error("Kayıt hatası:", err);
      setError(err.response?.data?.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto pb-20">
      <div className="text-center mb-8">
        <div className="mb-6">
          <img 
            src="/android-chrome-512x512.png" 
            alt="Openwall Logo" 
            className="w-16 h-16 mx-auto rounded-lg"
          />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Hesap Oluştur
        </h2>
        <p className="text-gray-300">
          Hesabınız var mı?{' '}
          <Link to="/login" className="text-gray-300 underline hover:text-white transition-colors">
            Giriş Yapın
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Kullanıcı Adı"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ad ve Soyad"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="E-posta Adresiniz."
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Şifre"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Şifre Tekrar"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center">
          <div className="relative">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 appearance-none bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500 checked:bg-red-600"
            />
            {formData.acceptTerms && (
              <svg 
                className="absolute top-0 left-0 w-4 h-4 text-white pointer-events-none" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
          </div>
          <label htmlFor="acceptTerms" className="ml-2 text-sm text-white">
            <Link to="/legal/disclaimer" className="text-white underline">
              Kullanım hakları
            </Link>
            {' '}ve{' '}
            <Link to="/legal/disclaimer" className="text-white underline">
              gizlilik politikasını
            </Link>
            {' '}okudum onaylıyorum
          </label>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-400 text-sm text-center bg-green-900/20 p-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.acceptTerms}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
