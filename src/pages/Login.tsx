import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import GoogleSignIn from "./GoogleSignIn";
import api from "@/middleware/api";
import { IUserLoginData } from "@/interface/interfaces";
import useMutationAuth from "@/hooks/tanstack/auth/useMutationAuth";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const { useMutationLogin } = useMutationAuth();
  const { mutate: loginUser, loading } = useMutationLogin();

  const handleLogin = async (data: IUserLoginData) => {
    try {
      await loginUser(data);
    } catch (error: any) {
      console.log("Login error:", error);
      setError("Invalid credentials or the user does not exist.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setError("Google authentication failed.");
      return;
    }

    try {
      const response = await api.post("users/google/", { credential: credentialResponse.credential });

      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("user_email", response.data.email);
        localStorage.setItem("user_name", response.data.name);

        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.response ? error.response.data.error || "Google authentication failed." : "Request configuration error.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left panel with clouds and computer image */}
      <div className="flex-1 flex flex-col justify-center items-center relative shadow-2xl slide-in bg-cover bg-center"
        style={{ backgroundImage: "url('/clouds.png')", borderTopRightRadius: "120px", borderBottomRightRadius: "120px" }}>
        <div className="text-center px-4 flex flex-col items-center">
          <div className="mb-8">
            <h1 className="text-7xl font-bold text-[#007AFF]">Welcome</h1>
            <h2 className="text-4xl text-[#007AFF] font-bold mt-2">── to AListō ──</h2>
            <p className="text-lg text-white mt-2 italic">Your Plans, Your Moves, AListō Grooves</p>
          </div>
          
          <div className="mt-4">
            <p className="text-black text-sm">Don't have an account?</p>
            <Link to="/register">
              <button className="text-base mt-2 w-60 py-2 border-2 border-blue-300 text-[#007AFF] rounded hover:bg-blue-50 transition-all">Register</button>
            </Link>
          </div>
          
          {/* Computer graphic - you'll need to add your own image */}
          <div className="mt-8">
            <img src="/cat.png" alt="Computer" className="w-64" />
          </div>
        </div>
      </div>

      {/* Right panel with login form */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center">
        <div className="w-2/3 max-w-md flex flex-col items-center">
          <h2 className="text-4xl font-bold text-[#007AFF] mb-6 text-center">Login</h2>
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <form className="w-full" onSubmit={(e) => {e.preventDefault(); handleLogin({ username, password });}}>
            <input 
              className="w-full px-4 py-2 mb-4 border-gray-300 border rounded" 
              placeholder="Username" 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
            
            <div className="relative mb-4">
              <input 
                className="w-full px-4 py-2 border-gray-300 border rounded" 
                placeholder="Password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button 
                type="button"
                className="absolute right-3 top-2.5 text-gray-500" 
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">Remember me</label>
              </div>
              <Link to="/set-password" className="text-sm text-[#007AFF]">
                Forgot Password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-[#007AFF] text-white rounded hover:bg-blue-600 transition-all" 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            
            <hr className="my-5 w-full border-gray-300" />
            
            <p className="text-sm text-center mb-4">
              By continuing with Google, you agree to AListō's{' '}
              <Link to="/terms" className="text-[#007AFF]">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="text-[#007AFF]">Privacy Policy</Link>.
            </p>
            
            <button 
              type="button"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-all flex items-center justify-center"
              onClick={() => {
                // Trigger Google Sign In
                const googleSignInButton = document.querySelector('[aria-labelledby="button-label"]');
                if (googleSignInButton) {
                  (googleSignInButton as HTMLElement).click();
                }
              }}
            >
              <img src="/Google.png" alt="Google" className="w-5 h-5 mr-2" />
              Or sign in with Google
            </button>
            
            {/* Hidden GoogleSignIn component for functionality */}
            <div className="hidden">
              <GoogleSignIn onSuccess={handleGoogleSuccess} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;