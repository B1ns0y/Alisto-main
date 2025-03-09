
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Star, 
  CheckSquare, 
  Hash, 
  Menu, 
  Plus, 
  ChevronDown,
  LogOut,
  Home
} from 'lucide-react';
import { Project } from '../types';
import { useToast } from '../hooks/use-toast';

interface SidebarProps {
  projects: Project[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowAddTaskModal: (show: boolean) => void;
  completedTasksCount: number;
  totalTasksCount: number;
  uncompletedTasksCount: number;
  upcomingTasksCount: number;
  importantTasksCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  activeTab, 
  setActiveTab, 
  setShowAddTaskModal,
  completedTasksCount,
  totalTasksCount,
  uncompletedTasksCount,
  upcomingTasksCount,
  importantTasksCount
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been successfully logged out",
    });
    
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full shadow-sm overflow-hidden animate-fade-in">
      {/* Logo and User */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-bold text-2xl flex items-center">
            <span><a href='/home'><img src='favicon.webp' className='w-12 h-12 mr-2 hover:scale-105'></img></a></span>
            <span className="text-blue-500">A</span>
            <span className="text-green-500">L</span>
            <span className="text-primary">istō</span>
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Menu size={20} />
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <span>U</span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium">KazutoKei03</div>
            <div className="text-xs text-gray-500">{completedTasksCount}/{totalTasksCount} Tasks Done</div>
          </div>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </div>

      {/* Add Task Button */}
      <div className="p-4">
        <button 
          className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors group"
          onClick={() => setShowAddTaskModal(true)}
        >
          <Plus size={18} className="mr-2 transition-transform group-hover:rotate-90" />
          Add Task
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          <li 
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === 'today' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('today')}
          >
            <LayoutDashboard size={18} className="mr-3" />
            <span>Today</span>
            <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === 'today' ? 'bg-blue-100 text-blue-600' : ''}`}>
              {uncompletedTasksCount}
            </span>
          </li>
          <li 
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Calendar size={18} className="mr-3" />
            <span>Upcoming</span>
            <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === 'upcoming' ? 'bg-blue-100 text-blue-600' : ''}`}>
              {upcomingTasksCount}
            </span>
          </li>
          <li 
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === 'important' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('important')}
          >
            <Star size={18} className="mr-3" />
            <span>Important</span>
            <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === 'important' ? 'bg-blue-100 text-blue-600' : ''}`}>
              {importantTasksCount}
            </span>
          </li>
          <li 
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === 'completed' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckSquare size={18} className="mr-3" />
            <span>Completed</span>
            <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === 'completed' ? 'bg-blue-100 text-blue-600' : ''}`}>
              {completedTasksCount}
            </span>
          </li>
        </ul>

        <div className="px-2 pt-6 pb-2">
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wider">MY PROJECTS</h3>
        </div>

        <ul className="space-y-1">
          {projects.map(project => (
            <li 
              key={project.id} 
              className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === `project-${project.id}` ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab(`project-${project.id}`)}
            >
              <Hash size={18} className="mr-3" />
              <span>{project.id === 'school' ? 'School' : 
                     project.id === 'home' ? 'Home' : 
                     project.id === 'random' ? 'Random' : 
                     project.id === 'friends' ? 'Friends' : project.id}</span>
              <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === `project-${project.id}` ? 'bg-blue-100 text-blue-600' : ''}`}>
                {project.count}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t">
        <button 
          className="w-full flex items-center p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
