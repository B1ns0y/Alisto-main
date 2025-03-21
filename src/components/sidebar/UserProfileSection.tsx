import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserProfileSectionProps {
  collapsed: boolean;
  userData: { username: string; profilePicture: string };
  completedTasksCount: number;
  totalTasksCount: number;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ 
  collapsed, 
  userData,
  completedTasksCount,
  totalTasksCount
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${collapsed ? 'py-4' : 'p-4'} border-b`}>
      <div className="flex items-center justify-center">
        {/* Profile Picture & Username */}
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className={`${collapsed ? 'w-8 h-8 mx-auto' : 'w-10 h-10'} rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden`}>
            {userData.profilePicture ? (
              <img src={userData.profilePicture} alt={userData.username} className="w-full h-full object-cover" />
            ) : (
              <img src="https://i.imgur.com/BLpauUN.jpeg" alt="Default Profile" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Username & Task Info */}
          {!collapsed && (
            <div className="ml-3">
              <div className="text-sm font-medium">{userData.username}</div>
              <div className="text-xs text-gray-500">{completedTasksCount}/{totalTasksCount} Tasks Done</div>
            </div>
          )}
        </div>

        {/* Dropdown Button */}
        {!collapsed && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:bg-gray-100 p-1.5 rounded-full focus:outline-none"
              aria-label="User menu"
            >
              <ChevronDown 
                size={16} 
                className={`text-gray-400 cursor-pointer hover:text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} 
              />
            </button>
            
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md py-1 w-36 z-10 border border-gray-100 animate-in fade-in slide-in-from-top-5 duration-200"
              >
                <Link 
                  to="/settings" 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full text-left"
                  onClick={() => setDropdownOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Settings
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileSection;