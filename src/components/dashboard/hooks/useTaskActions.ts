import { useUpdateTodo, useDeleteTodo } from '@/hooks/tanstack/todos/useQueryTodos';
import { ITask } from '@/interface/interfaces';

interface UseTaskActionsProps {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  toast: any;
}

export const useTaskActions = ({ tasks, setTasks, toast }: UseTaskActionsProps) => {
  const updateTaskMutation = useUpdateTodo();
  const deleteTaskMutation = useDeleteTodo();

  const handleAddTask = () => {
    if (!tasks.length) return;
    
    const taskToAdd = tasks[tasks.length - 1];
    if (taskToAdd.title.trim() === '') return;
    
    toast({
      title: taskToAdd.id ? "Task updated" : "Task added",
      description: `"${taskToAdd.title}" has been ${taskToAdd.id ? 'updated' : 'added'}.`,
    });
  };

  const toggleTaskCompletion = (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    const updateData = {
      id,
      is_completed: !taskToUpdate.completed,
      title: taskToUpdate.title,
      description: taskToUpdate.description || "",
      deadline: taskToUpdate.dueDate ? new Date(taskToUpdate.dueDate).toISOString() : null,
      is_important: taskToUpdate.important || false
    };

    updateTaskMutation.mutate(updateData, {
      onSuccess: () => {
        const updatedTasks = tasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        
        setTasks(updatedTasks);
        
        toast({
          title: !taskToUpdate.completed ? "Task completed" : "Task reopened",
          description: `"${taskToUpdate.title}" has been marked as ${!taskToUpdate.completed ? 'completed' : 'incomplete'}.`,
        });
      },
      onError: (error) => {
        toast({
          title: "Update failed",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        });
        console.error("Failed to update task:", error);
      }
    });
  };

  const toggleTaskImportance = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, important: !task.important } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    if (!id) {
      toast({
        title: "Error",
        description: "Cannot delete task: Invalid ID",
        variant: "destructive",
      });
      return;
    }

    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;

    deleteTaskMutation.mutate(id, {
      onSuccess: () => {
        setTasks(tasks.filter(task => task.id !== id));
        toast({
          title: "Task deleted",
          description: `"${taskToDelete.title}" has been removed successfully.`,
        });
      },
      onError: () => {
        toast({
          title: "Deletion failed",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return {
    handleAddTask,
    toggleTaskCompletion,
    toggleTaskImportance,
    deleteTask
  };
};