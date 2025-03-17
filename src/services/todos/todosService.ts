import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Update with your actual backend URL

export const fetchUserTasks = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_BASE_URL}/tasks/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
