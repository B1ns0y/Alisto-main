
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SettingsTabs from '../components/settings/SettingsTabs';
import AccountSettings from '../components/settings/AccountSettings';
import GeneralSettings from '../components/settings/GeneralSettings';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'account'>('account');

  const handleTabChange = (tab: 'general' | 'account') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-6">
        <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
        {activeTab === 'account' && <AccountSettings />}
        {activeTab === 'general' && <GeneralSettings />}
      </main>
    </div>
  );
};

export default Settings;
