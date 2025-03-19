import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [errors, setErrors] = useState<string[]>([]);
  const [backendMessage, setBackendMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); //
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);


    if (formData.password !== formData.confirmPassword) {
      setErrors(["Passwords do not match."]);
      setIsSubmitting(false);
      return;
    }


    try {
      const requestData = {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword
      };


      // For debugging - remove in production
      console.log("Sending data:", requestData);


      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });


      const data = await response.json();
      console.log("Response:", data);


      if (!response.ok) {
        // Handle different types of error responses
        if (data.detail) {
          setErrors([data.detail]);
        } else if (data.error) {
          setErrors([data.error]);
        } else if (typeof data === 'object') {
          // Extract error messages from object fields
          const errorMessages = Object.entries(data)
            .map(([key, value]) => {
              if (Array.isArray(value)) return `${key}: ${value[0]}`;
              if (typeof value === 'string') return `${key}: ${value}`;
              return null;
            })
            .filter(Boolean) as string[];
         
          setErrors(errorMessages.length > 0 ? errorMessages : ["Registration failed."]);
        } else {
          setErrors(["Registration failed. Please try again."]);
        }
        setIsSubmitting(false);
        return;
      }


      setBackendMessage("Registration successful! Please verify your email.");
      setErrors([]);
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors(["An error occurred. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Right Section */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center blur-effect">
        <div className="w-2/3 flex flex-col items-center">
          <h2 className="text-[32px] font-bold text-[#007AFF] mb-4 text-center">Registration</h2>


          {backendMessage && <p className="text-green-500">{backendMessage}</p>}


          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border-gray-300 border rounded"
                placeholder="Full Name"
                type="text"
                required
              />
            </div>


            <div className="mb-4">
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border-gray-300 border rounded"
                placeholder="Username"
                type="text"
                required
              />
            </div>


            <div className="mb-4">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border-gray-300 border rounded"
                placeholder="Email"
                type="email"
                required
              />
            </div>


            {/* Password Field with Toggle */}
            <div className="mb-4 relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border-gray-300 border rounded pr-10" // Add padding for icon
                placeholder="Password"
                type={showPassword ? "text" : "password"} // Toggle input type
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>


            {/* Confirm Password Field with Toggle */}
            <div className="mb-4 relative">
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border-gray-300 border rounded pr-10" // Add padding for icon
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"} // Toggle input type
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>


            {/* Display validation errors */}
            {errors.length > 0 && (
              <div className="text-red-500 mb-4">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}


            <button
              className={`text-[16px] w-full px-4 py-2 bg-[#007AFF] text-white rounded hover:bg-blue-600 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>


      {/* Left Section */}
      <div
        className="flex-1 flex flex-col justify-start items-center relative shadow-2xl slide-in-right"
        style={{
          backgroundImage: "url('/clouds.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopLeftRadius: "120px",
          borderBottomLeftRadius: "120px",
        }}
      >
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