import React from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full max-w-6xl flex justify-between items-center py-6 px-4 md:px-8 mb-20">
        <img src="/logomark.png" alt="AListo Logo" className="w-28 h-auto" />
        <div className="hidden md:flex space-x-6 text-gray-600">
          <a href="#" className="text-blue-600 font-semibold">Home</a>
          <a href="Terms" className="hover:text-blue-600">Terms of Service</a>
          <a href="Privacy" className="hover:text-blue-600">Privacy Policy</a>
        </div>
        <Link to="/register">
        <button className="px-4 py-2 text-sm bg-white border rounded-full shadow-md">
          Login
        </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="mb-10 flex flex-col-reverse md:flex-row items-center w-full max-w-5xl text-center md:text-left px-6">
        {/* Left Content */}
        <div className="flex-1 space-y-4">
          <h2 className="text-4xl font-bold">
            Stay Organized <br />with <span className="text-blue-600">AListö</span>
          </h2>
          <p className="text-gray-600">
            Your Plans, Your Moves, AListö Grooves. Manage tasks<br /> effortlessly, 
            stay on top of your to-dos, and <br /> get things done—your way.
          </p>
          <div>
        <Link to="/register">
          <button className="mt-[20px] px-6 py-3 bg-white text-black rounded-lg shadow-md" >
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
            className="w-[350px] h-auto absolute bottom-[250px] right-[245px] transform translate-x-1/2 translate-y-1/2"
          />
          <img 
            src="/cat.png" 
            alt="Pixel Computer with Cat" 
            className="w-[300px] h-auto relative z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
