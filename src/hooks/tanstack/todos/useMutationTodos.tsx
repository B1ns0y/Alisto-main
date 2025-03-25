import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTodo, deleteTodo, updateTaskTitle, updateTodo } from "../../../services/todos/todos";
import { IAddTaskModalProps, IUpdateTask } from "@/interface/interfaces";

// Add todo mutation hook
export const useMutationAddTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IAddTaskModalProps) => addTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

// Delete todo mutation hook
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.refetchQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      console.log("Error deleting todo");
    },
  });
};

// Update todo mutation hook
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

// Update task title mutation hook
export const useMutationUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IUpdateTask) => updateTaskTitle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      console.log("Error updating task title");
    },
  });
};
