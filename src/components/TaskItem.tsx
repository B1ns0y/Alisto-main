
import React from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  showTaskMenu: string | null;
  setShowTaskMenu: (id: string | null) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  toggleTaskCompletion, 
  deleteTask, 
  showTaskMenu, 
  setShowTaskMenu 
}) => {
  return (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="mt-1 mr-3">
          <input 
            type="checkbox" 
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
          />
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
          {task.location && <p className="text-sm text-gray-500 mt-1">{task.location}</p>}
          {task.category && <p className="text-sm text-gray-500 mt-1">{task.category}</p>}
          {task.tag && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                # {task.tag}
              </span>
            </div>
          )}
        </div>
        <div className="relative">
          <button 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            onClick={() => setShowTaskMenu(showTaskMenu === task.id ? null : task.id)}
          >
            <MoreHorizontal size={18} />
          </button>
          
          {showTaskMenu === task.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
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
  );
};

export default TaskItem;
