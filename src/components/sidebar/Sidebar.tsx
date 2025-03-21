import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { ITask } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTodos } from '@/hooks/tanstack/todos/useQueryTodos';

import UserProfileSection from '../sidebar/UserProfileSection';
import NavigationMenu from '../sidebar/NavigationMenu';
import LogoutButton from '../sidebar/LogoutButton';

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
  const [collapsed, setCollapsed] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const { data } = useTodos();
  
  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
  }, []);

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
      {/* Logo and Toggle */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          {!collapsed && (
            <span className="font-bold text-2xl flex items-center">
              <span>
                <img src='mainlogo.jpg' className='w-13 h-13 mr-4' alt="Logo"/>
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

      {/* User Profile Section */}
      <UserProfileSection 
        collapsed={collapsed} 
        userData={userData}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
      />

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

      {/* Navigation Menu */}
      <NavigationMenu 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        uncompletedTasksCount={uncompletedTasksCount}
        todayTasksCount={todayTasksCount}
        upcomingTasksCount={upcomingTasksCount}
        importantTasksCount={importantTasksCount}
        completedTasksCount={completedTasksCount}
      />
      
      {/* Logout Button */}
      <LogoutButton collapsed={collapsed} handleLogout={handleLogout} />
    </div>
  );
};

export default Sidebar;