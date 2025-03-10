export const fetch_user = async () => {
    try {
      const token = localStorage.getItem("access_token"); // Ensure the token exists
      if (!token) throw new Error("No access token found");
  
      const response = await fetch("http://127.0.0.1:8000/api/users/user/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched user:", data);
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };
  