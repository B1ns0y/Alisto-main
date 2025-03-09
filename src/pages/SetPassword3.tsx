
import React from 'react';
import { Link } from 'react-router-dom';

const SetPassword3: React.FC = () => {
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
          <p className="text-black mb-6 text-[14px]">
            Your new password must be different to <br /> previously used passwords.
          </p>
          <form className="space-y-4">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Password"
              type="password"
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Confirm Password"
              type="password"
            />
            <button
              className="w-full bg-[#007AFF] text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              type="submit"
            >
              Reset Password
            </button>
          </form>
          <p className="mt-4 text-gray-600">
            Back to&nbsp;
            <Link className="text-[#007AFF] hover:underline" to="/login">
              log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetPassword3;