
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

export interface IAddTaskModalProps {
  isEditMode: boolean;
  id?: string;
  title: string;
  description: string;
  dueDate: Date | null;
  dueTime: string;
  important?: boolean;
  completed?: boolean;
  userId: string; 
  };