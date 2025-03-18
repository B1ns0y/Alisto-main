import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // New state for "Remember Me"
  const navigate = useNavigate();

  // ✅ Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => navigate("/dashboard")) // Redirect if token is valid
        .catch(() => localStorage.removeItem("access_token")); // Clear invalid token

    // Load saved credentials from local storage if "Remember Me" was checked
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
    }
  }, [navigate]);

  // ✅ Google Login Function (Fixed)
  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log("Google response:", credentialResponse);
  
    if (!credentialResponse.credential) {
      console.error("Google login failed: No credential received");
      setError("Google authentication failed.");
      return;
    }
  
    try {
      // Include withCredentials if your server expects cookies
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/google/`,
        { credential: credentialResponse.credential },
        { 
          headers: { "Content-Type": "application/json" },
          // withCredentials: true
        }
      );
  
      console.log("Backend response:", response.data);
  
      if (response.status === 200) {
        const { access, refresh, user_id, email, name } = response.data;
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_name", name);
        
        // Add a small delay to ensure tokens are saved before navigation
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Google login failed:", error);
  
      if (error.response) {
        setError(error.response.data.error || "Google authentication failed.");
        console.error("Server error details:", error.response.data);
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Request configuration error: " + error.message);
      }
    }
  };
  

  // ✅ Normal Login Function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/token/`, {
        username,
        password,
      });

      console.log("Logged in user: ", response.data)

      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Save credentials to local storage if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }

        navigate("/dashboard");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else {
        setError("Wrong credentials or the user does not exist.");
      }
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left Section */}
      <div
        className="flex-1 flex flex-col justify-start items-center relative shadow-2xl slide-in"
        style={{
          backgroundImage: "url('/clouds.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopRightRadius: "120px",
          borderBottomRightRadius: "120px",
        }}
      >
        <div className="text-center px-4">
          <h1 className="text-[72px] font-bold text-[#007AFF] mt-12">Welcome</h1>
          <h2 className="text-[36px] text-[#007AFF] font-bold">── to AListō ──</h2>
          <p className="text-[18px] text-white mt-2 mb-4 italic">
            Your Plans, Your Moves, AListō Grooves
          </p>
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
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <form className="w-full" onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border-gray-300 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 relative">
              <input
                className="w-full px-4 py-2 border-gray-300 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                  <div className="relative w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <label htmlFor="remember" className="text-[14px] ml-1">
                  Remember me
                </label>
              </div>
              <Link
                to="/set-password"
                className="text-[#007AFF] text-[14px] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="text-[16px] w-full px-4 py-2 bg-[#007AFF] text-white rounded hover:bg-blue-600 transition-all"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <hr className="my-5 w-full border-gray-300" />
            <p className="text-[14px]">
              By continuing with Google, you agree to AListō’s{" "}
              <a href="Terms">
                <b>Terms of Service</b>
              </a>{" "}
              and{" "}
              <a href="Privacy">
                <b>Privacy Policy.</b>
              </a>
            </p>

            {/* ✅ Google Sign-In Button (Fixed) */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Google login failed")}
              width="250px"
            />
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
