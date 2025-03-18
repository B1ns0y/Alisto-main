import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/password-reset/`, { email });
      console.log('Response:', response); 

      localStorage.setItem('resetEmail', email);
      console.log('Navigating to /set-password2');
      navigate('/set-password2');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Error sending reset email. Please check your server connection.');
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
        <div className="bg-white p-8 rounded-lg w-full text-center">
          <h1 className="text-[35px] font-semibold text-[#007AFF] mb-2">Set new password</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="mt-4 w-full bg-[#007AFF] text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Next'}
            </button>
          </form>
          <p className="mt-4 text-gray-600">
            Back to&nbsp;
            <Link className="text-[#007AFF] hover:underline" to="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;