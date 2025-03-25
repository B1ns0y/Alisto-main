import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  searchQuery, 
  setSearchQuery,
  activeTab
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'today':
        return 'Today\'s Tasks';
      case 'upcoming':
        return 'Upcoming Tasks';
      case 'important':
        return 'Important Tasks';
      case 'completed':
        return 'Completed Tasks';
      default:
        return 'All Tasks';
    }
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm animate-fade-in">
      <h1 className="text-xl font-bold text-gray-800">{getHeaderTitle()}</h1>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-100 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
          />
        </div>       
      </div>
    </header>
  );
};

export default DashboardHeader;