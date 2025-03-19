
export interface Task {
  deadline: Date;
  userData: any;
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
