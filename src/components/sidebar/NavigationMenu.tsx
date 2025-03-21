import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Star, 
  CheckSquare, 
  Notebook 
} from 'lucide-react';

interface NavigationMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  uncompletedTasksCount: number;
  todayTasksCount: number;
  upcomingTasksCount: number;
  importantTasksCount: number;
  completedTasksCount: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  uncompletedTasksCount,
  todayTasksCount,
  upcomingTasksCount,
  importantTasksCount,
  completedTasksCount
}) => {
  
  const navItems: NavItem[] = [
    {
      id: 'tasks',
      label: 'All Tasks',
      icon: <Notebook size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />,
      count: uncompletedTasksCount
    },
    {
      id: 'today',
      label: 'Today',
      icon: <LayoutDashboard size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />,
      count: todayTasksCount
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: <Calendar size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />,
      count: upcomingTasksCount
    },
    {
      id: 'important',
      label: 'Important',
      icon: <Star size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />,
      count: importantTasksCount
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckSquare size={18} className={collapsed ? 'mx-auto' : 'mr-3'} />,
      count: completedTasksCount
    }
  ];

  return (
    <nav className="flex-1 overflow-y-auto p-2">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li 
            key={item.id}
            className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab(item.id)}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && (
              <span className={`ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md ${activeTab === item.id ? 'bg-blue-100 text-blue-600' : ''}`}>
                {item.count}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;