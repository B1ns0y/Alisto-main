import { axiosClient } from "../axiosClient";
import axios from "axios"; // Ensure axios is imported if used in other functions

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Define API Base URL

// Fetch all todos
export const fetchTodos = async () => {
  try {
    console.log("Fetching todos...");
    const response = await axiosClient.get(`/todos/`);
    console.log("Todos API response:", response.status, response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching todos:", error.response?.status, error.response?.data || error.message);
    throw new Error("Failed to fetch todos");
  }
};

// Add a new todo
export const addTodo = async (todoData: any) => {
  try {
    const response = await axiosClient.post(`/todos/create_task/`, todoData);
    return response.data;
  } catch (error: any) {
    console.error("Error adding todo:", error.response?.data);
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (id: string) => {
  try {
    console.log(`Attempting to delete task with ID: ${id}`);
    const token = localStorage.getItem("access_token");

    const response = await axiosClient.delete(`/todos/delete_task/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Delete response status:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("Delete error:", error.response?.status, error.response?.data);
    throw error;
  }
};

// Update a todo
export const updateTodo = async (todoData: any) => {
  try {
    const { id, ...updateData } = todoData;
    const token = localStorage.getItem("access_token");

    // Ensure project is correctly formatted
    if (updateData.project) {
      if (Array.isArray(updateData.project)) {
        updateData.project = updateData.project[0];
      }
      if (typeof updateData.project === "string" && !isNaN(parseInt(updateData.project, 10))) {
        updateData.project = parseInt(updateData.project, 10);
      }
    }

    const response = await axios.patch(`${API_BASE_URL}/todos/update_task/${id}/`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Update API error details:", error.response?.data);
    throw error;
  }
};
