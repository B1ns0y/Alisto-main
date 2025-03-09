import React, { useState } from 'react';
import { Pencil, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import UploadImageModal from './UploadImageModal';
import DeleteAccountModal from './DeleteAccountModal';
import EditUsernameModal from '../EditUsernameModal';
import EditPasswordModal from '../EditPasswordModal';

const AccountSettings: React.FC = () => {
  const [username, setUsername] = useState('User');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const { toast } = useToast();

  const handleDeleteAccount = (password: string) => {
    if (password.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive",
      });
      return;
    }
    
    setShowDeleteModal(false);
    toast({
      title: "Account deleted",
      description: "Your account has been deleted successfully",
      variant: "destructive",
    });
  };

  const handleUsernameUpdate = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handlePasswordUpdate = (currentPassword: string, newPassword: string) => {
    // In a real app, you would send this to your API
    console.log('Password updated', { currentPassword, newPassword });
  };

  const handleProfilePictureUpload = (imageUrl: string) => {
    setProfilePicture(imageUrl);
  };

  const handleDeleteProfilePicture = () => {
    setProfilePicture(null);
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed",
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <p className="text-sm text-gray-500 mb-6">Please update your profile settings here.</p>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="text-gray-900">{username}</div>
            </div>
            <button 
              className="text-blue-500 hover:text-blue-600 transition-colors" 
              onClick={() => setShowEditUsernameModal(true)}
              aria-label="Edit username"
            >
              <Pencil size={18} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="text-gray-900">••••••••••••••••••</div>
            </div>
            <button 
              className="text-blue-500 hover:text-blue-600 transition-colors" 
              onClick={() => setShowEditPasswordModal(true)}
              aria-label="Change password"
            >
              <Pencil size={18} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>
              <div className="space-x-2">
                <button 
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  onClick={() => setShowUploadModal(true)}
                >
                  Edit
                </button>
                <button 
                  className={`px-3 py-1 ${profilePicture ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'} text-white text-sm rounded transition-colors`}
                  onClick={handleDeleteProfilePicture}
                  disabled={!profilePicture}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-red-500 mb-2">Delete Account</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please enter your current password to proceed to account deletion.
            </p>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadImageModal 
          onClose={() => setShowUploadModal(false)} 
          onUpload={handleProfilePictureUpload}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal 
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
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
    </>
  );
};

export default AccountSettings;