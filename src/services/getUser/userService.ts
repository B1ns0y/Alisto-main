import axiosClient from "@/services/axiosClient";

export interface UserData {
  username: string;
  profile_picture?: string;
}

// Fetch user data
export const fetchUserData = async (): Promise<UserData> => {
  try {
    const response = await axiosClient.get("/users/user/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
