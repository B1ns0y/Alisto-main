import axios from "axios";

export const fetch_todos = async () => {
    try {
        const token = localStorage.getItem("access_token"); // Retrieve token from storage
        const response = await axios.get("http://localhost:8000/api/todos/", {
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
