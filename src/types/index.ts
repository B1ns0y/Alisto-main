
export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tag?: string;
  completed: boolean;
  project?: string;
  dueDate?: Date | null;
  dueTime?: string;
  important?: boolean;
  location?: string;
}

export interface Project {
  id: string;
  name: string;
  count: number;
}

export interface UserProfile {
  username: string;
  email: string;
  avatar?: string;
  preferences: {
    darkMode: boolean;
    emailNotifications: boolean;
    soundEffects: boolean;
  }
}
