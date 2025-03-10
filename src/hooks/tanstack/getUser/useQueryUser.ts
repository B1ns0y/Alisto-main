import { fetch_user } from "@/services/getUser/getUser"
import { useQuery } from "@tanstack/react-query"

export const useQueryUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: fetch_user,
    })
}


