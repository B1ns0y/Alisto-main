import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast, useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { IUserProfileUpdate } from '@/interface/interfaces';
import { useQueryClient } from '@tanstack/react-query';

interface EditUsernameModalProps {
  currentUsername: string;
  onClose: () => void;
  onSave: (data: IUserProfileUpdate) => void;
}



const EditUsernameModal: React.FC<EditUsernameModalProps> = ({ 
  currentUsername, 
  onClose, 
  onSave
   
}) => {
  const [userProfile, setUserProfile] = useState<IUserProfileUpdate>({ username: currentUsername });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userProfile.username.trim() === '') {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(userProfile);
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Your username has been updated",
      });
      console.log(userProfile.username);
      
      onClose();
      // Invalidate and refetch user settings to update the displayed userna
      queryClient.refetchQueries({queryKey: ["user"]});
     
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-in fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Edit Username</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={userProfile.username}
              onChange={(e) => setUserProfile({ ...userProfile, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
              autoFocus
            />
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
              disabled={isLoading}
              className={cn(
                "px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUsernameModal;