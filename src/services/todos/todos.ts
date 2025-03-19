import axios from "axios";
import { api } from "../../api/axios";


import { API_BASE_URL } from "../getUser/userService";
import { axiosClient } from "../axiosClient";
// Fetch all todos



export const fetchTodos = async () => {
    try {
        const token = localStorage.getItem("access_token");
        console.log("Fetching todos with token:", token ? "Token exists" : "No token");
        
        const response = await axiosClient.get(`/todos/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        
        console.log("Todos API response:", response.status, response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching todos:", error.response?.status, error.response?.data || error.message);
        throw new Error("Failed to fetch todos");
    }
};



// Add a new todo
export const addTodo = async (todoData) => {
    const token = localStorage.getItem('access_token');
    const response = await axiosClient.post(
      `/todos/create_task/`,
      todoData,
    );
    return response.data;
  };
  
export const deleteTodo = async (id) => {
    try {
      console.log("deleteTodo function called with ID:", id);
      const token = localStorage.getItem('access_token');
      console.log(`Attempting to delete task with ID: ${id}`);
      
      // Check if this URL structure matches your backend
      const response = await axios.delete(`${API_BASE_URL}/todos/delete_task/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Delete response status:", response.status);
      return response.data;
    } catch (error) {
      console.error("Delete error:", error.response?.status, error.response?.data);
      throw error;
    }
  };

export const updateTodo = async (todoData) => {
    const { id, ...updateData } = todoData;
    const token = localStorage.getItem('access_token');
    
    // If project is an array or non-number string, convert it appropriately
    if (updateData.project) {
      if (Array.isArray(updateData.project)) {
        updateData.project = updateData.project[0];
      }
      if (typeof updateData.project === 'string' && !isNaN(parseInt(updateData.project, 10))) {
        updateData.project = parseInt(updateData.project, 10);
      }
    }
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}/todos/update_task/${id}/`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update API error details:", error.response?.data);
      throw error;
    }
  };

export const fetchProjects = async () => {
    try {
        const token = localStorage.getItem("access_token"); // Retrieve token from storage
        const response = await axios.get("${API_BASE_URL}/todos/", {
            headers: {
                Authorization: `Bearer ${token}`, // Attach token
            },
            withCredentials: true,
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Unexpected error fetching todo:", error);
        throw new Error("Unexpected error fetching todo");
    }
};
    