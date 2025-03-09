import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left Section */}
      <div
        className="flex-1 flex flex-col justify-start items-center relative shadow-2xl slide-in"
        style={{
          backgroundImage: "url('/clouds.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopRightRadius: '120px',
          borderBottomRightRadius: '120px',
        }}
      >
        <div className="text-center px-4">
          <h1 className="text-[72px] font-bold text-[#007AFF] mt-12">Welcome</h1>
          <h2 className="text-[36px] text-[#007AFF] font-bold">── to AListō ──</h2>
          <p className="text-[18px] text-white mt-2 mb-4 italic">Your Plans, Your Moves, AListō Grooves</p>
          <p className="mt-2 text-black text-[14px]">Don't have an account?</p>
          <Link to="/register">
            <button className="text-[16px] mt-2 mb-4 w-[250px] py-2 border-2 border-blue-300 text-[#007AFF] rounded hover:bg-blue-50 transition-all">
              Register
            </button>
          </Link>
        </div>
        <img src="/cat.png" alt="cat" className="w-56 h-auto rounded fixed bottom-0" />
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center blur-effect">
        <div className="w-2/3 flex flex-col items-center">
          <h2 className="text-[32px] font-bold text-[#007AFF] mb-4 text-center">Login</h2>
          <form className="w-full">
            <div className="mb-4">
              <input className="w-full px-4 py-2 border-gray-300 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Username" type="text" />
            </div>
            <div className="mb-4">
              <input className="w-full px-4 py-2 border-gray-300 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="Password" type="password" />
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <label htmlFor="remember" className="text-[14px] ml-1">Remember me</label>
              </div>
              <Link to="/set-password" className="text-[#007AFF] text-[14px] transition-colors">Forgot Password?</Link>
            </div>
            <Link to="/dashboard">
              <button className="text-[16px] w-full px-4 py-2 bg-[#007AFF] text-white rounded hover:bg-blue-600 transition-all">Login</button>
            </Link>
            <hr className="my-5 w-full border-gray-300" />  
            <p className='text-[14px]'>By continuing with Google, you agree to AListō’s <a href='Terms'><b>Terms of Service</b></a> and <a href='Privacy'><b>Privacy Policy.</b></a></p>
            <button className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#333] text-white rounded transition-all hover:bg-[#222]">
              <img src="Google.png" alt="Google logo" className="w-5 h-5" />
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
