import React from 'react';
import { ITask } from '../../interface/interfaces';
import TaskItem from '../TaskItem';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  activeTab: string;
  filteredTasks: ITask[];
  showTaskMenu: string | null;
  setShowTaskMenu: (id: string | null) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleTaskImportance: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (task: ITask) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  activeTab,
  filteredTasks,
  showTaskMenu,
  setShowTaskMenu,
  toggleTaskCompletion,
  toggleTaskImportance,
  deleteTask,
  editTask
}) => {
  // Check if a task is overdue
  const isTaskOverdue = (task: ITask) => {
    if (!task.dueDate || task.completed) return false;
    
    const now = new Date();
    const taskDate = new Date(task.dueDate);
    
    if (task.dueTime) {
      // If there's a specific time, compare with current time
      const [timeStr, period] = task.dueTime.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      
      // Convert to 24-hour format if needed
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      taskDate.setHours(hours, minutes);
      return taskDate.getTime() < now.getTime();
    } else {
      // If no specific time, just compare dates
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() < todayDate.getTime();
    }
  };
  
  // Group tasks by date for upcoming tab
  const getGroupedTasks = () => {
    if (activeTab !== 'upcoming') return null;
    
    const grouped: { [key: string]: ITask[] } = {};
    
    filteredTasks.forEach(task => {
      if (task.dueDate) {
        const dateStr = new Date(task.dueDate).toDateString();
        if (!grouped[dateStr]) {
          grouped[dateStr] = [];
        }
        grouped[dateStr].push(task);
      }
    });
    
    return grouped;
  };
  
  const groupedTasks = getGroupedTasks();
  
  const formatDeadline = (dueDate: Date | null, dueTime: string | undefined) => {
    if (!dueDate) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    let dateStr = '';
    
    if (taskDate.getTime() === today.getTime()) {
      dateStr = 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = taskDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: taskDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
      });
    }
    
    if (dueTime) {
      dateStr += ` at ${dueTime}`;
    }
    
    return dateStr;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return new Date(date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
        <ClipboardList size={48} className="text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-500">No tasks found</h3>
        <p className="text-gray-400 mt-2">
          {activeTab === 'today' 
            ? "You don't have any tasks for today" 
            : activeTab === 'upcoming'
            ? "You don't have any upcoming tasks"
            : activeTab === 'completed'
            ? "You haven't completed any tasks yet"
            : activeTab === 'important'
            ? "You don't have any important tasks"
            : "No tasks found"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {groupedTasks ? (
        // Grouped by date (for upcoming tab)
        Object.keys(groupedTasks)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map(dateStr => (
            <div key={dateStr} className="space-y-2">
              <h3 className="text-md font-medium text-gray-700 sticky top-0 bg-gray-50 p-2 z-10">
                {formatDate(new Date(dateStr))}
              </h3>
              <div className="space-y-3">
                {groupedTasks[dateStr].map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    toggleTaskCompletion={toggleTaskCompletion}
                    toggleTaskImportance={toggleTaskImportance}
                    deleteTask={deleteTask}
                    editTask={editTask}
                    showTaskMenu={showTaskMenu}
                    setShowTaskMenu={setShowTaskMenu}
                    deadline={formatDeadline(task.dueDate, task.dueTime)}
                    isOverdue={isTaskOverdue(task)}
                  />
                ))}
              </div>
            </div>
          ))
      ) : (
        // Regular list
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              toggleTaskCompletion={toggleTaskCompletion}
              toggleTaskImportance={toggleTaskImportance}
              deleteTask={deleteTask}
              editTask={editTask}
              showTaskMenu={showTaskMenu}
              setShowTaskMenu={setShowTaskMenu}
              deadline={formatDeadline(task.dueDate, task.dueTime)}
              isOverdue={isTaskOverdue(task)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;