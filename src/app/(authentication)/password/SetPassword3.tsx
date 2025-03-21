import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/api/axios';

const SetPassword3: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();

  useEffect(() => {
    if (!uidb64 || !token) {
      setError('Invalid password reset link.');
    }
  }, [uidb64, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post(`/password-reset-confirm/${uidb64}/${token}/`, {
        new_password: password,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
      localStorage.removeItem('resetEmail');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center min-h-screen overflow-hidden relative">
      <img
        className="shadow-2xl absolute top-0 left-1/4 transform -translate-x-1/2 h-full w-1/2 object-cover rounded-tr-[130px] rounded-br-[130px] slide-out-left"
        src="/clouds.png"
        alt="Clouds"
      />
      <img
        className="shadow-2xl absolute top-0 left-1/4 transform translate-x-1/2 h-full w-1/2 object-cover rounded-tl-[130px] rounded-bl-[130px] slide-out-right"
        src="/clouds1.png"
        alt="Clouds"
      />
      <div className="flex flex-col items-center justify-center h-full blur-effect">
        <div className="bg-white p-8 rounded-lg w-full max-w-md text-center">
          <h1 className="text-[35px] font-semibold text-[#007AFF] mb-2">Set new password</h1>
          {success ? (
            <p className="text-green-500 mb-6">Password reset successfully! Redirecting to login...</p>
          ) : (
            <>
              <p className="text-black mb-6 text-[14px]">Your new password must be different from previous passwords.</p>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  className="w-full bg-[#007AFF] text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
          <p className="mt-4 text-gray-600">
            Back to <Link className="text-[#007AFF] hover:underline" to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetPassword3;