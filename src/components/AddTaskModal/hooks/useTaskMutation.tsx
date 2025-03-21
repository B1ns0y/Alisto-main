import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '@/middleware/api';
import { ITask } from '@/interface/interfaces';

export const useTaskMutation = (isEditMode: boolean, closeModal: () => void) => {
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: ITask) => {
      const url = isEditMode 
        ? `${import.meta.env.VITE_API_BASE_URL}/todos/update_task/${taskData.id}` 
        : `${import.meta.env.VITE_API_BASE_URL}/todos/create_task/`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      let deadline = null;
      if (taskData.dueDate) {
        const date = new Date(taskData.dueDate);
        
        if (taskData.dueTime) {
          const [timeStr, period] = taskData.dueTime.split(' ');
          const [hourStr, minuteStr] = timeStr.split(':');
          let hours = parseInt(hourStr);
          const minutes = parseInt(minuteStr);
          
          if (period === 'PM' && hours < 12) {
            hours += 12;
          } else if (period === 'AM' && hours === 12) {
            hours = 0;
          }
          
          date.setHours(hours, minutes, 0, 0);
        } else {
          date.setHours(0, 0, 0, 0);
        }
        
        deadline = date.toISOString();
      }

      const apiData = {
        title: taskData.title,
        description: taskData.description,
        deadline: deadline,
        is_important: Boolean(taskData.important),
        user: taskData.userId
      };

      const response = await api({
        method,
        url,
        data: apiData,
        headers: getAuthHeaders()
      });
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      closeModal();
      navigate('/dashboard');
    }
  });
};