import React, { useEffect, useState } from "react";
import { Pencil, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditUsernameModal from "../components/modals/EditUsernameModal";
import EditPasswordModal from "../components/modals/EditPasswordModal";
import { useUser } from "@/contexts/UserContext";
import api from "@/middleware/api";
import useMutationUpdateAccountSettings from "@/hooks/tanstack/getUser/useMutationUpdateAccountSettings";
import { fetchUserData, updateUser } from "@/services/getUser/userService";
import { IUserProfileUpdate } from "@/interface/interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryUser } from "@/hooks/tanstack/getUser/useQueryUser";

// Define a constant for the default profile picture
const DEFAULT_PROFILE_PICTURE = "https://i.imgur.com/BLpauUN.jpeg";

const AccountSettings: React.FC = () => {
  const { username, setUsername, profilePicture, setProfilePicture } = useUser();
  const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const { useMutationUpdateUsername, useMutationUpdatePassword } = useMutationUpdateAccountSettings();

  const { mutate: updateUsername } = useMutationUpdateUsername();
  const { mutate: updatePassword } = useMutationUpdatePassword();

  // 🚀 Fetch user settings on load
  useEffect(() => {
    console.log("Fetching user settings...");
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in. Please log in to access your settings.",
        variant: "destructive",
      });
      return;
    }
  }, [setUsername, setProfilePicture, toast]);

   // ✏️ Update username
   const handleUsernameUpdate = (data: IUserProfileUpdate) => {
    console.log("Updating username to:", data.username);
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in. Please log in to update your username.",
        variant: "destructive",
      });
      return;
    }

    updateUsername(data);
    setUsername(data.username);
  };

  // 🔒 Update password
  const handlePasswordUpdate = (data: IUserProfileUpdate) => {
    console.log("Updating password...");
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in.",
        variant: "destructive",
      });
      return;
    }
    
    // Set loading state
    setIsUpdating(true);
    
    updatePassword(data);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        {/* ✅ Your Profile Header with Description */}
        <h2 className="text-xl font-semibold">Your Profile</h2>
        <p className="text-sm text-gray-500 mb-4">Please update your profile settings here.</p>
  
        <div className="space-y-6">
          {/* ✅ Username */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="text-gray-900">{username}</div>
            </div>
            <button className="text-blue-500" onClick={() => setShowEditUsernameModal(true)}>
              <Pencil size={18} />
            </button>
          </div>
  
          {/* ✅ Password */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="text-gray-900">•••••••••••</div>
            </div>
            <button className="text-blue-500" onClick={() => setShowEditPasswordModal(true)}>
              <Pencil size={18} />
            </button>
          </div>
  
          {/* ✅ Profile Picture Section (View only - no update button) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={profilePicture || DEFAULT_PROFILE_PICTURE}
                  className="w-full h-full object-cover"
                  alt="Profile"
                  onError={(e) => (e.currentTarget.src = DEFAULT_PROFILE_PICTURE)} // Fallback if image fails to load
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* ✅ Modals */}
      {showEditUsernameModal && (
        <EditUsernameModal
          currentUsername={username} 
          onClose={() => setShowEditUsernameModal(false)}
          onSave={handleUsernameUpdate}
          
        />
      )}
      {showEditPasswordModal && (
        <EditPasswordModal 
          onClose={() => setShowEditPasswordModal(false)} 
          onSave={handlePasswordUpdate} 

        />
      )}
    </>
  );
}

export default AccountSettings;