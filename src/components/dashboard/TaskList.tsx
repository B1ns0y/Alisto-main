
import React from 'react';
import { Task, Project } from '../../types';
import TaskItem from '../TaskItem';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  activeTab: string;
  filteredTasks: Task[];
  projects: Project[];
  showTaskMenu: string | null;
  setShowTaskMenu: (id: string | null) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleTaskImportance: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  activeTab,
  filteredTasks,
  projects,
  showTaskMenu,
  setShowTaskMenu,
  toggleTaskCompletion,
  toggleTaskImportance,
  deleteTask,
  editTask
}) => {
  // Group tasks by date for upcoming tab
  const getGroupedTasks = () => {
    if (activeTab !== 'upcoming') return null;
    
    const grouped: { [key: string]: Task[] } = {};
    
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
  
  const getProjectName = (projectId: string) => {
    switch (projectId) {
      case 'work':
        return 'Work';
      case 'personal':
        return 'Personal';
      case 'education':
        return 'Education';
      case 'health':
        return 'Health';
      default:
        return 'Unknown Project';
    }
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
                    projectName={task.project ? getProjectName(task.project) : undefined}
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
              projectName={task.project ? getProjectName(task.project) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;

