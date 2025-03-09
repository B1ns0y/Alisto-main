
import React from 'react';

interface SettingsTabsProps {
  activeTab: 'general' | 'account';
  onTabChange: (tab: 'general' | 'account') => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b flex">
        <button
          className={`px-6 py-3 text-sm font-medium flex items-center ${
            activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => onTabChange('general')}
        >
          <span className="mr-2">🔍</span>
          General
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium flex items-center ${
            activeTab === 'account' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
          onClick={() => onTabChange('account')}
        >
          <span className="mr-2">👤</span>
          Account
        </button>
      </div>
    </div>
  );
};

export default SettingsTabs;
