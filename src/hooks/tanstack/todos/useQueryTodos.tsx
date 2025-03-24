import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../../../services/todos/todos";
import { useMutationAddTodo, useDeleteTodo, useUpdateTodo, useMutationUpdateTodo } from "./useMutationTodos";

const useQueryTodos = () => {
  // Fetch todos hook
  const useTodos = () => {
    return useQuery({
      queryKey: ["todos"],
      queryFn: fetchTodos,
    });
  };

  return { useTodos, useMutationAddTodo, useDeleteTodo, useUpdateTodo, useMutationUpdateTodo };
};

export default useQueryTodos;