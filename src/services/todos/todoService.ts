import axiosClient from "@/services/axiosClient";

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
