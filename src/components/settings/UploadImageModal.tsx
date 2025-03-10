import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UploadImageModalProps {
  onClose: () => void;
  onUpload?: (imageUrl: string) => void;
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({ onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    try {
      const response = await fetch("/api/user/upload-profile-picture/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Add authentication token if needed
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      if (onUpload) {
        onUpload(data.profile_picture);
      }

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-in fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Upload Profile Picture</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400",
              previewUrl ? "py-4" : "py-10"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-32 h-32 mx-auto rounded-full object-cover" />
            ) : (
              <div className="space-y-2">
                <ImageIcon className="w-6 h-6 mx-auto text-gray-500" />
                <p className="text-sm font-medium">Drag and drop your image here</p>
                <p className="text-xs text-gray-500">or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-blue-500 hover:text-blue-600"
                >
                  Browse files
                </button>
              </div>
            )}
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Cancel
            </button>
            <button onClick={handleUpload} disabled={!selectedFile || isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
              {isLoading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImageModal;
