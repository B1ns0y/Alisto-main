import api from "@/middleware/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


  const VerifyEmail  = () => {
  const { uid, token } = useParams(); 
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("UID:", uid, "Token:", token);
    if (!uid || !token) {
      setError("Invalid verification link.");
      return;
    }

    const url = `/users/verify-email/${uid}/${token}/`;
    console.log("Calling API URL:", url);
    api
      .get(`/users/verify-email/${uid}/${token}/`)
      .then((response) => {
        console.log("Verification response:", response.data);
        setMessage(
          "✅ Email verified successfully! Redirecting to login in a second..."
        );
        setTimeout(() => navigate("/login"), 10000);
      })
      .catch((err) => {
        console.error("Verification error:", err);
        setError(err.response?.data?.error || "Email verification failed.");
      });
  }, [uid, token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 max-w-md w-full bg-white rounded shadow-lg text-center">
        {message ? (
          <div className="text-green-600">
            <h2 className="text-xl font-bold">✅ Verification Successful!</h2>
            <p>{message}</p>
            <p>Redirecting to login...</p>
          </div>
        ) : error ? (
          <div className="text-red-600">
            <h2 className="text-xl font-bold">❌ Verification Failed</h2>
            <p>{error}</p>
          </div>
        ) : (
          <h2 className="text-xl font-bold">🔄 Verifying Email...</h2>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
