import Portal from '../components/Portal'; // Ensure the file exists at this path or update the path to the correct location
import React from 'react';
import { MoreHorizontal, Trash2, Star, Clock, Calendar, Edit } from 'lucide-react';
import { Task } from '../types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  toggleTaskCompletion: (id: string) => void;
  toggleTaskImportance: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (task: Task) => void;
  showTaskMenu: string | null;
  setShowTaskMenu: (id: string | null) => void;
  projectName?: string;
  deadline?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  toggleTaskCompletion, 
  toggleTaskImportance,
  deleteTask,
  editTask, 
  showTaskMenu, 
  setShowTaskMenu,
  projectName,
  deadline 
}) => {
  // Create a ref to the menu button
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  
  // Handle click outside to close the menu
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
        setShowTaskMenu(null);
      }
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowTaskMenu]);

  // In your TaskItem.tsx file, modify the formatDueDate function to handle both dueDate and deadline
const formatDueDate = () => {
  // First check if we have a dueDate (frontend format)
  if (task.dueDate) {
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
  }
  
  // If no dueDate but we have a deadline (backend format), use that instead
  if (task.deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const deadlineDate = new Date(task.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    if (deadlineDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (deadlineDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric' 
      };
      if (deadlineDate.getFullYear() !== today.getFullYear()) {
        options.year = 'numeric';
      }
      return new Date(task.deadline).toLocaleDateString('en-US', options);
    }
  }
  
  return null;
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
                  ref={menuButtonRef} // Add this ref
                >
                  <MoreHorizontal size={16} />
                </button>
                
                {showTaskMenu === task.id &&  (
                  <Portal>
                    <div
                      className="fixed bg-white rounded-md shadow-lg border py-1"
                      style={{
                        zIndex: 9999,
                        width: '12rem',
                        top: menuButtonRef.current?.getBoundingClientRect().bottom + window.scrollY + 5,
                        left: menuButtonRef.current?.getBoundingClientRect().right - 192 + window.scrollX,
                      }}
                    >
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent any default action
                          e.stopPropagation(); // Stop event propagation

                          console.log("Delete button clicked for task ID:", task.id); // Log click event

                          deleteTask(task.id); // Call delete function
                          setShowTaskMenu(null);
                        }}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete Task
                      </button>
                    </div>
                  </Portal>
                )}
              </div>
            </div>
          </div>
          {deadline && (
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <svg 
                className="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              {deadline}
            </div>
          )}
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
            
            {(task.dueDate || task.deadline) && (
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
