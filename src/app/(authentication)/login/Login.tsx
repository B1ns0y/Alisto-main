"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosClient } from "@/services/axiosClient";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import AuthTerms from "./AuthTerms";
import GoogleSignIn from "./GoogleSignIn";


const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => router.push("/dashboard"))
        .catch(() => localStorage.removeItem("access_token"));
    }


    // Load saved credentials if "Remember Me" was checked
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
  }, [router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");


    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/token/`, { username, password });


      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("user_id", response.data.id);
        localStorage.setItem("user_email", response.data.email);
        localStorage.setItem("user_name", response.data.username);


        if (rememberMe) {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }


        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.status === 401 ? "Invalid username or password. Please try again." : "Wrong credentials or the user does not exist.");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log("Google response:", credentialResponse);


    if (!credentialResponse.credential) {
      setError("Google authentication failed.");
      return;
    }


    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/google/`,
        { credential: credentialResponse.credential },
        { headers: { "Content-Type": "application/json" } }
      );


      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("user_email", response.data.email);
        localStorage.setItem("user_name", response.data.name);


        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.response ? error.response.data.error || "Google authentication failed." : "Request configuration error.");
    }
  };


  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center relative shadow-2xl slide-in bg-cover bg-center"
        style={{ backgroundImage: "url('/clouds.png')", borderTopRightRadius: "120px", borderBottomRightRadius: "120px" }}>
        <div className="text-center px-4">
          <h1 className="text-[72px] font-bold text-[#007AFF] mt-12">Welcome</h1>
          <h2 className="text-[36px] text-[#007AFF] font-bold">── to AListō ──</h2>
          <p className="text-[18px] text-white mt-2 mb-4 italic">Your Plans, Your Moves, AListō Grooves</p>
          <p className="mt-2 text-black text-[14px]">Don't have an account?</p>
          <Link href="/authentication/signup">
            <button className="text-[16px] mt-2 mb-4 w-[250px] py-2 border-2 border-blue-300 text-[#007AFF] rounded hover:bg-blue-50 transition-all">Register</button>
          </Link>
        </div>
      </div>


      <div className="flex-1 bg-white flex flex-col justify-center items-center blur-effect">
        <div className="w-2/3 flex flex-col items-center">
          <h2 className="text-[32px] font-bold text-[#007AFF] mb-4 text-center">Login</h2>
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <form className="w-full" onSubmit={handleLogin}>
            <input className="w-full px-4 py-2 mb-4 border-gray-300 border rounded" placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <button type="submit" className="w-full px-4 py-2 bg-[#007AFF] text-white rounded hover:bg-blue-600 transition-all" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            <hr className="my-5 w-full border-gray-300" />
            <AuthTerms />
            <GoogleSignIn onSuccess={handleGoogleSuccess} />
          </form>
        </div>
      </div>
    </div>
  );
};


export default Login;