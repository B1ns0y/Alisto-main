
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

export interface IUserLoginData {
  user_id?: number;
  username?: string;
  password?: string;
}

export interface IUserRegisterData {
  username: string;
  email:string;
  full_name: string;
  password: string;
  confirm_password: string;
}

export interface IUserProfile {
  user_id?: number;
  user_name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export interface IUserProfileUpdate {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export interface IAddTaskModalProps {
  id?: string;
  title: string;
  description: string;
  dueDate: Date | null;
  dueTime: string;
  important?: boolean;
  completed?: boolean;
  userId: string; 
  };

  export interface IUpdateTask {
    id: number;
    newTitle?: string;
    newDescription?: string;
    newDueDate?: Date | null;
    newDueTime?: string;
    completed?: boolean;
    important?: boolean;
  }

  export interface IUserResetPassword {
    password: string;
    confirm_password: string;
    uidb64: string;
    token: string;
  }