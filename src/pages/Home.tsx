import React from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center flex flex-col items-center">
      {/* Navbar */}
      <nav className="z-20 w-full max-w-6xl flex justify-between items-center py-6 px-4 md:px-8 mb-20 animate-slide-down">
        <img src="/logomark.png" alt="AListo Logo" className="w-28 h-auto" />
        <div className="hidden md:flex space-x-10 text-gray-600">
          <Link to= "/#">
          <button className="text-blue-600 font-semibold">
            Home
          </button>
          </Link>
          <Link to= "/Terms">
          <button className="hover:text-blue-600"> 
            Terms of Service
          </button>
          </Link>
          <Link to= "/Privacy">
          <button className="hover:text-blue-600">
            Privacy Policy
          </button>
          </Link>          
        </div>
        <Link to="/login">
        <button className="px-4 py-2 text-sm bg-white border rounded-lg shadow-md">
          Login
        </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="mb-10 flex flex-col-reverse md:flex-row items-center w-full max-w-5xl text-center md:text-left px-6 animate-slide-down">
        {/* Left Content */}
        <div className="z-20 flex-1 space-y-4">
          <h2 className="text-5xl font-bold"></h2>
          <div className="flex flex-col gap-2 w-[440px] p-5">
      <h1 className="mt-10 font-inter text-[48px] font-bold leading-[60px] tracking-[0.2px] text-[#252b42]">
      Stay Organized with <img src="logomark.png" className="w-52 h-auto inline-block"></img></h1>
      
      <p className="mt-0 w-[357px] font-inter text-[14px] font-medium leading-[20px] tracking-[0.2px] text-[#737373]">
      Your Plans, Your Moves, AListō Grooves. Manage tasks effortlessly, stay on top of your to-dos, and get things done—your way.      </p>
    </div>
          <div>
        <Link to="/register">
          <button className="mt-[20px] px-6 py-3 bg-white text-black rounded-lg shadow-md z-20">
            Create an Account
          </button>
        </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center relative mt-10">
          <img 
            src="/Circle.png" 
            alt="circle" 
            className="w-[350px] h-auto absolute bottom-[250px] right-[245px] transform translate-x-1/2 translate-y-1/2 z-0"
          />
          <img 
            src="/cat.png" 
            alt="Pixel Computer with Cat" 
            className="w-[300px] h-auto relative z-20"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-10">
        <img src="/cloud2.png" alt="cloud2" className="absolute bottom-0 w-full h-full animate-cloud" />
        <img src="/cloud3.png" alt="cloud3" className="absolute bottom-0 w-full h-full animate-cloud delay-100" />
        <img src="/cloud4.png" alt="cloud4" className="absolute bottom-0 w-full h-full animate-cloud delay-200" />
        <img src="/cloud5.png" alt="cloud5" className="absolute bottom-0 w-full h-full animate-cloud delay-300" />
        <img src="/cloud6.png" alt="cloud6" className="absolute bottom-0 w-full h-full animate-cloud delay-400" />
      </div>
    </div>
  );
};

export default Hero;
