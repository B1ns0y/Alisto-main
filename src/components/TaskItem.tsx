import Portal from './ui/Portal'; // Ensure the file exists at this path or update the path to the correct location
import React from 'react';
import { MoreHorizontal, Trash2, Star, Clock, Calendar, Edit } from 'lucide-react';
import { ITask } from '../interface/interfaces';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: ITask;
  toggleTaskCompletion: (id: string) => void;
  toggleTaskImportance: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (task: ITask) => void;
  showTaskMenu: string | null;
  setShowTaskMenu: (id: string | null) => void;
  projectName?: string;
  deadline?: string;
  isOverdue: boolean; 
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
  deadline,
  isOverdue
}) => {
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

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

const formatDueDate = () => {
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
         
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 break-words">
              {task.description}
            </p>
          )}
          {/* Due date/time display */}
          <div className="flex items-center mt-2 text-sm">
            {deadline && (
              <span className={`flex items-center ${isOverdue && !task.completed ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                <span className="mr-1">📅</span>
                {deadline}
                {isOverdue && !task.completed && (
                  <span className="ml-2 bg-red-100 text-red-500 px-2 py-0.5 rounded-full text-xs font-medium">
                    OVERDUE
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;