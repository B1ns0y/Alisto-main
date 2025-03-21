import { Dispatch, SetStateAction } from 'react';

export interface TaskData {
  id?: string;
  title: string;
  description: string;
  dueDate: Date | null;
  dueTime: string;
  important?: boolean;
  completed?: boolean;
  userId: string;
}

export interface TimeSelection {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

export interface AddTaskModalProps {
  isEditMode: boolean;
  taskData: TaskData;
  setTaskData: Dispatch<SetStateAction<TaskData>>;
  handleSubmit: () => void;
  closeModal: () => void;
  userId: string;
}

export interface CalendarDay {
  day: number;
  currentMonth: boolean;
  isPrevMonth?: boolean;
  isNextMonth?: boolean;
}