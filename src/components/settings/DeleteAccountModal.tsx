import React, { useState } from "react";
import { X, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/settings/`;

interface DeleteAccountModalProps {
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting to delete account...");

      const response = await fetch(API_URL, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      console.log("Delete response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting account:", errorData);
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete account.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("Account deleted successfully.");
      toast({ title: "Success", description: "Account deleted successfully." });

      // Redirect to login page after account deletion
      navigate("/login");
    } catch (error) {
      console.error("Unexpected error deleting account:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-in fade-in duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-red-500">Delete Account</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start space-x-3 mb-4 p-3 bg-red-50 rounded-md text-red-800">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">This action cannot be undone</p>
              <p className="text-xs mt-1">
                Once you delete your account, all of your data will be permanently removed.
                This action cannot be undone.
              </p>
            </div>
          </div>

          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your password to confirm
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors",
                  (isLoading || !password.trim()) && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
