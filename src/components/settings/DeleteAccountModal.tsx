
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DeleteAccountModalProps {
  onClose: () => void;
  onDelete: (password: string) => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose, onDelete }) => {
  const [currentPassword, setCurrentPassword] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Are you sure?</h2>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          This action is permanent. Once you delete your account, all your data will be lost and cannot be recovered.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter your password:
          </label>
          <input 
            type="password" 
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        
        <div className="flex justify-center space-x-3 pt-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => onDelete(currentPassword)}
          >
            Delete Account
          </button>
          <button
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
