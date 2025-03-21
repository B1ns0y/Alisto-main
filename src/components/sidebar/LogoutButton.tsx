import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  collapsed: boolean;
  handleLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ collapsed, handleLogout }) => {
  return (
    <div className={`${collapsed ? 'px-2 py-4' : 'p-4'} border-t`}>
      <button 
        className="w-full flex items-center p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors justify-center"
        onClick={handleLogout}
        title={collapsed ? "Logout" : undefined}
      >
        <LogOut size={18} className={collapsed ? '' : 'mr-3'} />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
};

export default LogoutButton;