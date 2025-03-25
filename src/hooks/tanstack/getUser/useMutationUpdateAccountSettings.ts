import { IUserProfileUpdate } from "@/interface/interfaces";
import { updateUser } from "@/services/getUser/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutationUpdateAccountSettings = () => {
    

    const useMutationUpdateUsername = () => {
        const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async (data: IUserProfileUpdate) => updateUser(data), // Ensure this returns updated user data
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(["user"], (oldData: any) => ({
                    ...oldData,
                    username: updatedUser.username, // ✅ Ensure updated data is set
                }));
    
                queryClient.invalidateQueries({ queryKey: ["user"] }); // ✅ This will trigger a fresh fetch
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