// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import axiosClient from "@/services/axiosClient";

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  profilePicture: string | null;
  setProfilePicture: (url: string | null) => void;
  updateUser: (data: { username?: string; profilePicture?: string }) => Promise<void>;
  initializeUser: (userData: any) => void; // Add this new function to the interface
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>("User");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Function to initialize user with default profile picture
  const initializeUser = (userData: any) => {
    // If no profile picture is provided, use the default
    setUsername(userData.username);
    setProfilePicture(userData.profile_picture || "https://i.imgur.com/VzvjjDg.jpeg");
  };

  // Fetch user data from Django when the app loads
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      
      // Prevents unnecessary requests if no token is found
      if (!token) {
        console.warn("No access token found. Skipping user data fetch.");
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Use initializeUser instead of setting values directly
        initializeUser(response.data);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        
        // Logout user if the token is invalid or expired
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          console.warn("Session expired. Logging out.");
        }
      }
    };

    fetchUserData();
  }, []);

  // Function to update user details in Django
  const updateUser = async (data: { username?: string; profilePicture?: string }) => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      console.error("No access token found. Cannot update user.");
      return;
    }

    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/users/user/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (data.username) setUsername(response.data.username);
      if (data.profilePicture) setProfilePicture(response.data.profile_picture || "https://i.imgur.com/VzvjjDg.jpeg");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      username, 
      setUsername, 
      profilePicture, 
      setProfilePicture, 
      updateUser,
      initializeUser // Add this to the context value
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};