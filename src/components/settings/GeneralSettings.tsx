
import React from 'react';
import { useToast } from "@/hooks/use-toast";

const GeneralSettings: React.FC = () => {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your settings have been updated successfully",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">General Settings</h2>
      <p className="text-sm text-gray-500 mb-6">Customize your application preferences.</p>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700">
              Email Notifications
            </label>
            <p className="text-sm text-gray-500">Receive email notifications for task reminders</p>
          </div>
          <div className="form-switch">
            <input 
              type="checkbox" 
              className="h-5 w-10 rounded-full cursor-pointer" 
              defaultChecked 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700">
              Dark Mode
            </label>
            <p className="text-sm text-gray-500">Switch between light and dark theme</p>
          </div>
          <div className="form-switch">
            <input 
              type="checkbox" 
              className="h-5 w-10 rounded-full cursor-pointer" 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700">
              Sound Effects
            </label>
            <p className="text-sm text-gray-500">Play sounds when completing tasks</p>
          </div>
          <div className="form-switch">
            <input 
              type="checkbox" 
              className="h-5 w-10 rounded-full cursor-pointer" 
            />
          </div>
        </div>
        
        <div className="border-t pt-6 flex justify-end">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
