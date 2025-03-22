import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Star, 
  CheckSquare, 
  Menu, 
  Plus, 
  ChevronDown,
  LogOut,
  Notebook,
  Home,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ITask } from '@/interface/interfaces'
import { useToast } from '../../hooks/use-toast';
import  useMutationTodo from '@/hooks/tanstack/todos/useQueryTodos'
import { fetchUserData } from '@/services/getUser/userService';

const { useTodos } = useMutationTodo();

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowAddTaskModal: (show: boolean) => void;
  completedTasksCount: number;
  totalTasksCount: number;
  uncompletedTasksCount: number;
  upcomingTasksCount: number;
  importantTasksCount: number;
  todayTasksCount: number;
  userData: { username: string; profilePicture: string };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  setShowAddTaskModal,
  completedTasksCount,
  totalTasksCount,
  uncompletedTasksCount,
  upcomingTasksCount,
  importantTasksCount,
  todayTasksCount,
  userData
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const { data, isLoading, isError } = useTodos();
  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]); // Runs only when `data` changes
  
  console.log(tasks);
  
  
  // Handle clicking outside of dropdown
  React.useEffect(() => {
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

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
  }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]
);
  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed.toString());
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
        
    navigate('/Home');
  };

  return (
    <div 
      className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r flex flex-col h-full shadow-sm overflow-hidden animate-fade-in transition-all duration-300 ease-in-out`}>
      {/* Logo and User */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          {!collapsed && (
            <span className="font-bold text-2xl flex items-center">
              <span>
                  <img src='mainlogo.jpg' className='w-13 h-13 mr-4'/>
              </span>
            </span>
          )}
          {collapsed && (
            <div className="w-13 h-13 mr-1 justify-center bg-white"></div>
          )}
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600 transition-colors"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Profile with Dropdown */}
      <div className={`${collapsed ? 'py-4' : 'p-4'} border-b`}>
        <div className="flex items-center justify-center ">
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

          {/* Dropdown Button (Now Properly Positioned) */}
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

      {/* Add Task Button */}
      <div className={`${collapsed ? 'px-2 py-4' : 'p-4'}`}>
        <button 
          className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors group"
          onClick={() => setShowAddTaskModal(true)}
        >
          <Plus size={18} className={`${collapsed ? '' : 'mr-2'} transition-transform group-hover:rotate-90`} />
          {!collapsed && "Add Task"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          <li 
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === 'tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('tasks')}
            title={collapsed ? "All Tasks" : undefined}
          >
            <Notebook size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>All Tasks</span>}
            {!collapsed && (
              <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === 'tasks' ? 'bg-blue-100 text-blue-600' : ''}`}>
                {uncompletedTasksCount}
              </span>
            )}
          </li>
          <li 
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-color ${activeTab === 'today' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('today')}
            title={collapsed ? "Today" : undefined}
          >
            <LayoutDashboard size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Today</span>}
            {!collapsed && (
              <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === 'today' ? 'bg-blue-100 text-blue-600' : ''}`}>
                {todayTasksCount}
              </span>
            )}
            </li>
          
          <li 
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('upcoming')}
            title={collapsed ? "Upcoming" : undefined}
          >
            <Calendar size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Upcoming</span>}
            {!collapsed && (
              <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === 'upcoming' ? 'bg-blue-100 text-blue-600' : ''}`}>
                {upcomingTasksCount}
              </span>
            )}
          </li>
          <li 
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === 'important' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('important')}
            title={collapsed ? "Important" : undefined}
          >
            <Star size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Important</span>}
            {!collapsed && (
              <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === 'important' ? 'bg-blue-100 text-blue-600' : ''}`}>
                {importantTasksCount}
              </span>
            )}
          </li>
          <li 
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === 'completed' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('completed')}
            title={collapsed ? "Completed" : undefined}
          >
            <CheckSquare size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />
            {!collapsed && <span>Completed</span>}
            {!collapsed && (
              <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === 'completed' ? 'bg-blue-100 text-blue-600' : ''}`}>
                {completedTasksCount}
              </span>
            )}
          </li>
        </ul>
      </nav>
      
      {/* Logout */}
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
    </div>
  );
};

export default Sidebar;