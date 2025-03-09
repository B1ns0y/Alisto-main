
import React from 'react';
import { MoreHorizontal, Trash2, Star, Clock, Calendar } from 'lucide-react';
import { Task } from '../types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  toggleTaskCompletion: (id: string) => void;
  toggleTaskImportance: (id: string) => void;
  deleteTask: (id: string) => void;
  showTaskMenu: string | null;
  setShowTaskMenu: (id: string | null) => void;
  projectName?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  toggleTaskCompletion, 
  toggleTaskImportance,
  deleteTask, 
  showTaskMenu, 
  setShowTaskMenu,
  projectName
}) => {
  const formatDueDate = () => {
    if (!task.dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric' 
      };
      if (dueDate.getFullYear() !== today.getFullYear()) {
        options.year = 'numeric';
      }
      return new Date(task.dueDate).toLocaleDateString('en-US', options);
    }
  };
  
  return (
    <div 
      className={cn(
        "bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200",
        task.completed ? "opacity-70" : "",
        showTaskMenu === task.id ? "ring-2 ring-primary/20" : ""
      )}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <input 
            type="checkbox" 
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-medium text-gray-800 break-words",
              task.completed ? "line-through text-gray-400" : ""
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-1 shrink-0">
              {task.important && (
                <Star size={16} fill="currentColor" className="text-yellow-500" />
              )}
              
              <div className="relative">
                <button 
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTaskMenu(showTaskMenu === task.id ? null : task.id);
                  }}
                >
                  <MoreHorizontal size={16} />
                </button>
                
                {showTaskMenu === task.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border animate-in fade-in-50 slide-in-from-top-1">
                    <div className="py-1">
                      <button 
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                        onClick={() => toggleTaskImportance(task.id)}
                      >
                        <Star size={16} className={cn("mr-2", task.important ? "text-yellow-500 fill-current" : "text-gray-500")} />
                        {task.important ? 'Remove importance' : 'Mark as important'}
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete Task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 break-words">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            {projectName && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                 {projectName}
              </span>
            )}
            
            {task.dueDate && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                <Calendar size={12} className="mr-1" />
                {formatDueDate()}
              </span>
            )}
            
            {task.dueTime && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                <Clock size={12} className="mr-1" />
                {task.dueTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
