
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
  priority?: number;
}


export interface IUserProfile {
  username: string;
  email: string;
  password?: string;
}

export interface IAddTaskModalProps {
  isEditMode: boolean;
  taskData: {
    id?: string;
    title: string;
    description: string;
    dueDate: Date | null;
    dueTime: string;
    important?: boolean;
    completed?: boolean;
    userId: string; 
  };
  setTaskData: React.Dispatch<React.SetStateAction<{
    id?: string;
    title: string;
    description: string;
    dueDate: Date | null;
    dueTime: string;
    important?: boolean;
    completed?: boolean;
    userId: string; 
  }>>;
  handleSubmit: () => void;
  closeModal: () => void;
  userId: string;
}