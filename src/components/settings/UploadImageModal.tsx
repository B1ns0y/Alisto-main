
import React from 'react';
import { Upload, X } from 'lucide-react';

interface UploadImageModalProps {
  onClose: () => void;
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Image</h2>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
          <Upload size={24} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">Click or drag file to upload</p>
          <p className="text-xs text-gray-400">Formats accepted are .jpg, .png, and .gif</p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={onClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadImageModal;
