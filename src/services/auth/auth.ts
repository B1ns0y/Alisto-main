import { IUserResetPassword } from "@/interface/interfaces";
import api from "@/middleware/api";


export const register = async (payload:any) => {
    try {
        const res = await api.post(`/users/register/`, payload);  
        return res.data;   
    } catch (error) {
        throw error
    }
}

export const resetPassword = async (email:string) => {
    try {
        const response = await api.post(`/password-reset/`, {email: email.trim()});
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "No user is associated with this email address.");
    }
}

export const resetPasswordConfirm = async (data: IUserResetPassword) => {
    try {
        const res = await api.post(`/password-reset-confirm/${data.uidb64}/${data.token}/`, data);
        return res.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.error || 'Error resetting password. Please try again.');
    }
}