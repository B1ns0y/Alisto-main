
import React, { useState } from 'react';
import { Pencil, User } from 'lucide-react';
import UploadImageModal from './UploadImageModal';
import DeleteAccountModal from './DeleteAccountModal';
import { useToast } from "@/hooks/use-toast";

const AccountSettings: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
              <div className="text-gray-900">User</div>
            </div>
            <button className="text-blue-500 hover:text-blue-600">
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
            <button className="text-blue-500 hover:text-blue-600">
              <Pencil size={18} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                <User size={32} className="text-gray-400" />
              </div>
              <div className="space-x-2">
                <button 
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  onClick={() => setShowUploadModal(true)}
                >
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
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
        <UploadImageModal onClose={() => setShowUploadModal(false)} />
      )}

      {showDeleteModal && (
        <DeleteAccountModal 
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
        />
      )}
    </>
  );
};

export default AccountSettings;
