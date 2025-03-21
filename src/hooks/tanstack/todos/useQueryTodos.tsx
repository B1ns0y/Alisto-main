import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, addTodo, deleteTodo, updateTodo } from "../../../services/todos/todos";
import { IAddTaskModalProps } from "@/interface/interfaces";

const useMutationTodo = () => {

  // Fetch todos hook
  const useTodos = () => {
    return useQuery({
      queryKey: ["todos"],
      queryFn: fetchTodos,
    });
  };

  // Add todo mutation hook
  const useMutationAddTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: IAddTaskModalProps ) => addTodo(data),
      onSuccess: () => {
        //message here to show success
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    });
  };


  // Delete todo mutation hook
  const useDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: deleteTodo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    });
  };

  const useUpdateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: updateTodo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    });
  };
  return { useTodos, useMutationAddTodo, useDeleteTodo, useUpdateTodo };
}
export default useMutationTodo;