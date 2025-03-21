import { fetchUserData } from "@/services/getUser/userService"
import { useQuery } from "@tanstack/react-query"

export const useQueryUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: fetchUserData,
    })
}