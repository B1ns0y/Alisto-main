import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, addTodo, deleteTodo, updateTaskTitle, updateTodo } from "../../../services/todos/todos";
import { IAddTaskModalProps, IUpdateTask } from "@/interface/interfaces";

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
        queryClient.refetchQueries({ queryKey: ["todos"] });
      },
      onError: () => {
        console.log("Error deleting todo");
        
      }
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

  const useMutationUpdateTodo = () =>{
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (data: IUpdateTask) => updateTaskTitle(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"]});
      },
      onError: () => {
        
      }
      });
    }


  return { useTodos, useMutationAddTodo, useDeleteTodo, useUpdateTodo, useMutationUpdateTodo };
}
  
export default useMutationTodo;