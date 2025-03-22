import { IUserLoginData } from "@/interface/interfaces";
import { loginUser } from "@/services/getUser/userService";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useMutationAuth = () => {

    const useMutationLogin = () => {
        const [loading, setLoading] = useState(false);
        const [rememberMe, setRememberMe] = useState(false);
        const [error, setError] = useState("");
        const navigate = useNavigate();

        const mutation = useMutation({
            mutationFn: async (data: IUserLoginData) => {
                setLoading(true);
                return loginUser(data);
            },
            onSuccess: (res) => {
                if (res?.status === 200){
                    const data = res?.data;
                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("refresh_token", data.refresh);
                    localStorage.setItem("user_id", data.id);
                    localStorage.setItem("user_email", data.email);
                    localStorage.setItem("user_name", data.username);

                    if (rememberMe) {
                        localStorage.setItem("saved_username", data.username);
                      } else {
                        localStorage.removeItem("saved_username");
                      }

                    navigate("/dashboard");
                }
            },
            onError: (err: any) => {
                setError(err.response?.status === 401 ? "Invalid username or password. Please try again." : "Wrong credentials or the user does not exist.");
                console.log(err);
            },
            onSettled: () => {
                setLoading(false);
            },
        });
        return {...mutation, loading};
    }
    return { useMutationLogin };
}
export default useMutationAuth;