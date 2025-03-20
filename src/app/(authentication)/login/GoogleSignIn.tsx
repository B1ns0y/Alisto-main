"use client";
import React from "react";
import { GoogleLogin } from "@react-oauth/google";


interface GoogleSignInProps {
  onSuccess: (credentialResponse: any) => void;
}


const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess }) => {
  return (
    <div className="flex justify-center items-center h-[70px]">
      <GoogleLogin onSuccess={onSuccess} onError={() => console.log("Google login failed")} width="250px" />
    </div>
  );
};


export default GoogleSignIn;