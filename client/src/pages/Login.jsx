import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      if (result.user.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else {
      setLocalError(result.error);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@banking.com');
    setPassword('admin123');
  };

  const fillUserCredentials = () => {
    setEmail('user@banking.com');
    setPassword('user123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🏦</div>
            <h1 className="text-3xl font-bold text-white">SecureBank</h1>
            <p className="text-gray-400 mt-2">Secure Online Banking Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="bg-red-900 text-red-100 p-4 rounded-lg text-sm">
                {error || localError}
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400 mb-4">Demo Credentials</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="btn btn-secondary w-full text-sm"
              >
                👤 Admin Account
              </button>
              <button
                type="button"
                onClick={fillUserCredentials}
                className="btn btn-secondary w-full text-sm"
              >
                👤 User Account
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            This is a secure banking application. Do not share your credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
