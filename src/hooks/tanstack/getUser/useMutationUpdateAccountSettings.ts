import { IUserProfileUpdate } from "@/interface/interfaces";
import { updateUser } from "@/services/getUser/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutationUpdateAccountSettings = () => {
    

    const useMutationUpdateUsername = () => {
        const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async (data: IUserProfileUpdate) => updateUser(data),
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(["user"], (oldData: any) => ({
                    ...oldData,
                    username: updatedUser.username,
                }));
    
                queryClient.invalidateQueries({ queryKey: ["user"] }); 
            },
        });
    };
    

    const useMutationUpdatePassword = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (data: IUserProfileUpdate) => updateUser(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["user"] });
            },
        });
    }
    return { useMutationUpdateUsername, useMutationUpdatePassword };
}
export default useMutationUpdateAccountSettings;