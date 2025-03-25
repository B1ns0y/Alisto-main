import { useToast } from "@/hooks/use-toast";
import { IUserLoginData, IUserRegisterData, IUserResetPassword } from "@/interface/interfaces";
import api from "@/middleware/api";
import { register, resetPassword, resetPasswordConfirm } from "@/services/auth/auth";
import { loginUser } from "@/services/getUser/userService";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useMutationAuth = () => {
    const useMutationResetPassword = () => {
        const { toast } = useToast();
        const navigate = useNavigate();
        return useMutation({
            mutationFn: async (data: IUserResetPassword) => resetPasswordConfirm(data),
            onSuccess: () => {
                navigate("/login");
                toast({
                    title: "Email sent",
                    description: "Password reset successfully"
                })
            },
            onError: (error: any) => {
                toast({
                    title: "Error",
                    description: error.response?.data?.error || "Error resetting password"
                })
            }
        })
    }

    const useMutationResetPasswordEmail = () => {
        const { toast } = useToast();
        const navigate = useNavigate();
        return useMutation({
            mutationFn: async (email:string) => resetPassword(email),
            onSuccess: () => {
                setTimeout(() => navigate("/login"), 2000);
                toast({
                    title: "Email sent",
                    description: "Password reset email sent successfully. Check your email."
                })
            },
            onError: (error: any) => {
                toast({
                    title: "Error",
                    description: error.response?.data?.error || "Error sending password reset email."
                })
            }
        })
    }

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
                    console.log("Sheesh", res)
                    console.log("111111", res.data.user.id)
                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("refresh_token", data.refresh);
                    localStorage.setItem("user_id", data.user.id);
                    localStorage.setItem("user_email", data.user.email);
                    localStorage.setItem("user_name", data.user.username);

                    if (rememberMe) {
                        localStorage.setItem("saved_username", data.user.username);
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


    const useMutationRegister = () => {
        const { toast } = useToast();
        const navigate = useNavigate();
        return useMutation({
            mutationFn: async (data: IUserRegisterData) => register(data),
            onSuccess: () => {
                navigate("/login");
                toast({
                    title: "Account created", 
                    description: "Account created successfully"
                })
            },
            onError: (err: any) => {
                toast({
                    title: "Error", 
                    description: err.response?.data?.error || "Error creating account"
                })
            }
        })
    }

    return { useMutationLogin, useMutationRegister, useMutationResetPasswordEmail, useMutationResetPassword };
}
export default useMutationAuth;