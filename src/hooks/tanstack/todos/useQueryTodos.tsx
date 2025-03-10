import { fetch_todos } from "@/services/todos/todos"
import { useQuery } from "@tanstack/react-query"

export const useQueryTodos = () => {
    return useQuery({
        queryKey: ["todos"],
        queryFn: fetch_todos,
    })
}