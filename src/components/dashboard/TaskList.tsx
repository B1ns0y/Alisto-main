
import React from 'react';
import { Inbox, LayoutDashboard, Calendar, Star, CheckSquare, Hash } from 'lucide-react';
import { Task, Project } from '../../types';
import TaskItem from '../TaskItem';

interface TaskListProps {
  activeTab: string;
  filteredTasks: Task[];
  projects: Project[];
  showTaskMenu: string | null;
  setShowTaskMenu: (id: string | null) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  activeTab, 
  filteredTasks, 
  projects,
  showTaskMenu, 
  setShowTaskMenu, 
  toggleTaskCompletion, 
  deleteTask 
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'inbox':
        return 'Inbox';
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming';
      case 'important':
        return 'Important';
      case 'completed':
        return 'Completed';
      default:
        if (activeTab.startsWith('project-')) {
          const projectId = activeTab.replace('project-', '');
          const project = projects.find(p => p.id === projectId);
          return project ? project.name : 'Project';
        }
        return 'Tasks';
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'inbox':
        return <Inbox size={16} className="mr-2" />;
      case 'today':
        return <LayoutDashboard size={16} className="mr-2" />;
      case 'upcoming':
        return <Calendar size={16} className="mr-2" />;
      case 'important':
        return <Star size={16} className="mr-2" />;
      case 'completed':
        return <CheckSquare size={16} className="mr-2" />;
      default:
        if (activeTab.startsWith('project-')) {
          return <Hash size={16} className="mr-2" />;
        }
        return <LayoutDashboard size={16} className="mr-2" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">{getTabTitle()}</h1>
      <div className="flex items-center text-gray-500 mb-6">
        {getTabIcon()}
        <span>To do ({filteredTasks.filter(t => !t.completed).length})</span>
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-white">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              toggleTaskCompletion={toggleTaskCompletion}
              deleteTask={deleteTask}
              showTaskMenu={showTaskMenu}
              setShowTaskMenu={setShowTaskMenu}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
