
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Settings, LogOut } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ searchQuery, setSearchQuery }) => {
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
    <header className="border-b p-4 flex justify-between items-center bg-white">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search Tasks"
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>
      <div className="flex items-center">
        <button 
          className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={20} />
        </button>
        <Link to="/settings">
          <button className="ml-4 text-gray-500 hover:text-gray-700 transition-colors">
            <Settings size={20} />
          </button>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
