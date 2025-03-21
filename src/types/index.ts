
export interface ITask {
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


export interface IUserProfile {
  username: string;
  email: string;
  password?: string;
}


export interface UserData {
  username: string;
  profilePicture: string;
}

export interface NavItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}
