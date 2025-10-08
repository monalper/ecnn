import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const AdminPasswordProtection = ({ children, requiredPassword = "56905690" }) => {
  const { user, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [error, setError] = useState('');

  // Check if password is already verified in session storage
  useEffect(() => {
    const verified = sessionStorage.getItem('adminPasswordVerified');
    if (verified === 'true') {
      setIsPasswordCorrect(true);
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === requiredPassword) {
      setIsPasswordCorrect(true);
      setError('');
      // Store verification in session storage so user doesn't need to enter password again in this session
      sessionStorage.setItem('adminPasswordVerified', 'true');
    } else {
      setError('Yanlış şifre! Lütfen tekrar deneyin.');
      setPassword('');
    }
  };

  const clearPasswordVerification = () => {
    sessionStorage.removeItem('adminPasswordVerified');
    setIsPasswordCorrect(false);
    setPassword('');
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="medium" text="Yetki kontrol ediliyor..." />
      </div>
    );
  }

  // If user is not admin, redirect to login
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // If password is not verified, show password form
  if (!isPasswordCorrect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                Admin Şifresi
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bu sayfaya erişmek için ek şifre gereklidir
              </p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="Şifrenizi girin"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // If both admin privileges and password are verified, render children with a reset option
  return (
    <div>
      {children}
      {/* Optional: Add a floating reset button */}
      <button
        onClick={clearPasswordVerification}
        className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 z-50"
        title="Şifre doğrulamasını sıfırla"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </button>
    </div>
  );
};

export default AdminPasswordProtection; 