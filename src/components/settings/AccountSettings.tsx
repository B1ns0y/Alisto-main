import React, { useEffect, useState } from "react";
import { Pencil, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UploadImageModal from "./UploadImageModal";
import DeleteAccountModal from "./DeleteAccountModal";
import EditUsernameModal from "../EditUsernameModal";
import EditPasswordModal from "../EditPasswordModal";
import { useUser } from "@/contexts/UserContext";

const API_URL = "http://127.0.0.1:8000/api/settings/";

const AccountSettings: React.FC = () => {
  const { username, setUsername, profilePicture, setProfilePicture } = useUser();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const { toast } = useToast();

  // 🚀 Fetch user settings on load
  useEffect(() => {
    console.log("Fetching user settings...");
    fetch(API_URL, {
      method: "GET",
      credentials: "include", // Ensures cookies are sent
    })
      .then((response) => {
        console.log("User settings response:", response);
        if (!response.ok) throw new Error("Failed to fetch user settings");
        return response.json();
      })
      .then((data) => {
        console.log("User settings data:", data);
        setUsername(data.username);
        setProfilePicture(data.profile_picture);
      })
      .catch((error) => {
        console.error("Error fetching user settings:", error);
        toast({
          title: "Error",
          description: "Failed to load account settings",
          variant: "destructive",
        });
      });
  }, []);

  // ✏️ Update username
  const handleUsernameUpdate = (newUsername: string) => {
    console.log("Updating username to:", newUsername);
    fetch(API_URL, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername }),
    })
      .then((response) => {
        console.log("Username update response:", response);
        if (!response.ok) throw new Error("Failed to update username");
        return response.json();
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
  const handlePasswordUpdate = (newPassword: string) => {
    console.log("Updating password...");
    fetch(API_URL, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((response) => {
        console.log("Password update response:", response);
        if (!response.ok) throw new Error("Failed to update password");
        return response.json();
      })
      .then((data) => {
        console.log("Password updated successfully:", data);
        toast({ title: "Success", description: "Password updated successfully" });
      })
      .catch((error) => {
        console.error("Error updating password:", error);
        toast({
          title: "Error",
          description: "Failed to update password",
          variant: "destructive",
        });
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
                {profilePicture ? (
                  <img src={profilePicture} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>
  
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
                  onClick={() => setShowUploadModal(true)}
                >
                  Edit
                </button>
  
                {/* ✅ Conditional Delete Button */}
                <button
                  className={`px-3 py-1 text-sm rounded ${
                    profilePicture
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!profilePicture}
                  onClick={() => profilePicture && setProfilePicture(null)}
                >
                  Delete
                </button>
              </div>
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
      {showUploadModal && <UploadImageModal onClose={() => setShowUploadModal(false)} />}
      {showEditUsernameModal && (
        <EditUsernameModal
          currentUsername={username}
          onClose={() => setShowEditUsernameModal(false)}
          onSave={handleUsernameUpdate}
        />
      )}
      {showEditPasswordModal && (
        <EditPasswordModal onClose={() => setShowEditPasswordModal(false)} onSave={handlePasswordUpdate} />
      )}
      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
    </>
  );
}

export default AccountSettings;
