import axiosClient from "./axiosClient";

import axios from "axios";
import { api } from "../../api/axios";
import { API_BASE_URL } from "../getUser/userService";
import { axiosClient } from "../axiosClient";

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
    const response = await axiosClient.delete(`/todos/delete_task/${id}/`);
    console.log("Delete response status:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("Delete error:", error.response?.status, error.response?.data);
    throw error;
  }
};
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

// Update a todo
export const updateTodo = async (todoData: any) => {
  try {
    const { id, ...updateData } = todoData;
    
    // Ensure project is correctly formatted
    if (updateData.project) {
      if (Array.isArray(updateData.project)) {
        updateData.project = updateData.project[0];
      }
      if (typeof updateData.project === "string" && !isNaN(parseInt(updateData.project, 10))) {
        updateData.project = parseInt(updateData.project, 10);
      }
    }

    const response = await axiosClient.patch(`/todos/update_task/${id}/`, updateData);
    return response.data;
  } catch (error: any) {
    console.error("Update API error details:", error.response?.data);
    throw error;
  }
};

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