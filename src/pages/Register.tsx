import React from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Right Section */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center blur-effect">
        <div className="w-2/3 flex flex-col items-center">
          <h2 className="text-[32px] font-bold text-[#007AFF] mb-4 text-center">Registration</h2>
          <form className="w-full">
            <div className="mb-4">
              <input className="w-full px-4 py-2 border-gray-300 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Full Name" type="text" />
            </div>
            <div className="mb-4">
              <input className="w-full px-4 py-2 border-gray-300 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Username" type="text" />
            </div>
            <div className="mb-4">
              <input className="w-full px-4 py-2 border-gray-300 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Password" type="password" />
            </div>
            <div className="mb-4">
              <input className="w-full px-4 py-2 border-gray-300 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Confirm Password" type="password" />
            </div>
            <Link to="/">
              <button className="text-[16px] w-full px-4 py-2 bg-[#007AFF] text-white rounded hover:bg-blue-600 transition-colors">Register</button>
            </Link>
          </form>
        </div>
      </div>

      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-start items-center relative shadow-2xl slide-in-right" 
           style={{ backgroundImage: "url('/clouds.png')", backgroundSize: 'cover', backgroundPosition: 'center', borderTopLeftRadius: '120px', borderBottomLeftRadius: '120px' }}>
        <div className="text-center px-4">
          <h1 className="text-[64px] font-bold text-[#007AFF] mt-32">Welcome Back!</h1>
          <p className="mt-3 text-black text-[14px]">Already have an account?</p>
          <Link to="/login">
            <button className="text-[16px] mt-4 w-[250px] py-2 border-2 border-blue-300 text-[#007AFF] rounded hover:bg-blue-50 transition-all">
              Login
            </button>
          </Link>
        </div>
        <img src="/cat.png" alt="cat" className="w-56 h-auto rounded fixed bottom-0" />
      </div>
    </div>
  );
};

export default Register;
