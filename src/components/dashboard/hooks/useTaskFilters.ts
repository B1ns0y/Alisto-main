import { useState, useEffect } from 'react';
import { ITask } from '@/interface/interfaces';

export const useTaskFilters = (tasks: ITask[]) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('activeTab') || 'today';
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(query) && 
          (!task.description || !task.description.toLowerCase().includes(query))) {
        return false;
      }
    }

    // Tab filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    if (taskDate) {
      taskDate.setHours(0, 0, 0, 0);
    }
    
    switch (activeTab) {
      case 'today':
        return taskDate && taskDate.getTime() === today.getTime() && !task.completed;
      case 'upcoming':
        return taskDate && taskDate.getTime() > today.getTime() && !task.completed;
      case 'completed':
        return task.completed;
      case 'important':
        return task.important && !task.completed;
      default:
        return !task.completed;
    }
  });

  return {
    filteredTasks,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery
  };
};