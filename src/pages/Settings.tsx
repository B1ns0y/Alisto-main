import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AccountSettings from '../components/settings/AccountSettings';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Account Settings</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-6">
        <AccountSettings />
      </main>
    </div>
  );
};

export default Settings;