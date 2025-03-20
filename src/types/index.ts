
export interface Task {
  userId: any;
  deadline: Date;
  userData: any;
  id: string;
  title: string;
  description?: string;
  category?: string;
  tag?: string;
  completed: boolean;
  dueDate?: Date | null;
  dueTime?: string;
  important?: boolean;
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
