import { useState, useEffect } from 'react';
import { useTodos, useDeleteTodo, useUpdateTodo } from '@/hooks/tanstack/todos/useQueryTodos';
import { ITask } from '@/interface/interfaces';

export const useTasks = () => {
  const { data, isLoading, isError } = useTodos();
  const [tasks, setTasks] = useState<ITask[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks).map((task: any) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    })) : [];
  });

  useEffect(() => {
    if (data) {
      const formattedTasks = data.map((task: any) => {
        let dueDate = null;
        let dueTime = '';
        
        if (task.deadline) {
          const deadlineDate = new Date(task.deadline);
          dueDate = deadlineDate;
          
          const hours = deadlineDate.getHours();
          const minutes = deadlineDate.getMinutes();
          if (hours !== 0 || minutes !== 0) {
            dueTime = deadlineDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            });
          }
        }
        
        return {
          ...task,
          dueDate,
          dueTime,
          completed: task.is_completed,
          important: task.is_important
        };
      });
      
      setTasks(formattedTasks);
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return { tasks, setTasks, isLoading, isError };
};