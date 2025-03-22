import React, { useEffect, useState } from "react";
import { Pencil, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UploadImageModal from "../components/settings/UploadImageModal";
import DeleteAccountModal from "../components/settings/DeleteAccountModal";
import EditUsernameModal from "../components/modals/EditUsernameModal";
import EditPasswordModal from "../components/modals/EditPasswordModal";
import { useUser } from "@/contexts/UserContext";
import api from "@/middleware/api";

// Define a constant for the default profile picture
const DEFAULT_PROFILE_PICTURE = "https://i.imgur.com/BLpauUN.jpeg";

const AccountSettings: React.FC = () => {
  const { username, setUsername, profilePicture, setProfilePicture } = useUser();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

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
    
    api.get(`/user/`)
      .then((response) => {
        console.log("User settings response:", response);
        return response.data;
      })
      .then((data) => {
        console.log("User data:", data);
        if (data && data.id) {
          localStorage.setItem("user_id", data.id);
        }
        // Update user context with fetched data
        if (data && data.username) {
          setUsername(data.username);
        }
        if (data && data.profile_picture) {
          setProfilePicture(data.profile_picture);
        } else {
          // Explicitly set default profile picture if none exists
          setProfilePicture(DEFAULT_PROFILE_PICTURE);
        }
      })
      .catch((error) => {
        console.error("Error fetching user settings:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user settings",
          variant: "destructive",
        });
      });
  }, [setUsername, setProfilePicture, toast]);

  // ✏️ Update username
  const handleUsernameUpdate = (newUsername: string) => {
    console.log("Updating username to:", newUsername);
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in. Please log in to update your username.",
        variant: "destructive",
      });
      return;
    }
    
    api.put(`/users/update/`, {
      username: newUsername
    })
      .then((response) => {
        console.log("Username settings response:", response);
        return response.data;
      })
      .then((data) => {
        console.log("Username updated successfully:", data);
        setUsername(newUsername);
        toast({ title: "Success", description: "Username updated successfully" });
      })
      .catch((error) => {
        console.error("Error updating username:", error);
        toast({
          title: "Error",
          description: "Failed to update username",
          variant: "destructive",
        });
      });
  };

  // 🔒 Update password
  const handlePasswordUpdate = (newPassword, confirmPassword) => {
    console.log("Updating password...");
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in. Please log in to update your password.",
        variant: "destructive",
      });
      return;
    }
    
    // Set loading state
    setIsUpdating(true);
    
    api.put(`/users/update-password/`, {
      new_password: newPassword,
      confirm_password: confirmPassword
    })
      .then((response) => {
        console.log("Password settings response:", response);
        toast({ 
          title: "Success", 
          description: "Password updated successfully." 
        });
        
        // Close the modal
        setShowEditPasswordModal(false);
      })
      .catch((error) => {
        console.error("Error updating password:", error);
        let errorMessage = "Failed to update password";
        
        // Try to extract specific validation errors from the response
        if (error.response && error.response.data) {
          if (error.response.data.current_password) {
            errorMessage = error.response.data.current_password;
          } else if (error.response.data.new_password) {
            errorMessage = error.response.data.new_password;
          } else if (error.response.data.confirm_password) {
            errorMessage = error.response.data.confirm_password;
          } else if (error.response.data.non_field_errors) {
            errorMessage = error.response.data.non_field_errors[0];
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      })
      .finally(() => {
        // Reset loading state
        setIsUpdating(false);
      });
  };

  // Handle profile picture upload success
  const handleProfilePictureUpdate = (newProfilePicture: string) => {
    setProfilePicture(newProfilePicture);
    toast({ 
      title: "Success", 
      description: "Profile picture updated successfully" 
    });
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
  
          {/* ✅ Profile Picture Section (Fixed Alignment & Delete Button) */}
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={profilePicture || DEFAULT_PROFILE_PICTURE}
                className="w-full h-full object-cover"
                alt="Profile"
                onError={(e) => (e.currentTarget.src = DEFAULT_PROFILE_PICTURE)} // Fallback if image fails to load
              />
            </div>
            <button
              className="px-3 py-1 text-sm font-medium text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => setShowUploadModal(true)}
            >
              Update Photo
            </button>
          </div>
          </div>
        </div>
      </div>
  
      {/* ✅ Delete Account Section Restored */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold text-red-500">Delete Account</h2>
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
        </p>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>
  
      {/* ✅ Modals */}
      {showUploadModal && (
        <UploadImageModal 
          onClose={() => setShowUploadModal(false)} 
          onUpload={handleProfilePictureUpdate} 
        />
      )}

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
      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
    </>
  );
}

export default AccountSettings;