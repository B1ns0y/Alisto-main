import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Calendar } from './Calendar/Calendar';
import { useTaskMutation } from './hooks/useTaskMutation';
import { AddTaskModalProps, TimeSelection } from './types';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  isEditMode,
  taskData, 
  setTaskData, 
  handleSubmit: parentHandleSubmit,
  closeModal,
  userId
}) => {
  const { user } = useAuth();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(taskData.dueDate);
  const [selectedTime, setSelectedTime] = useState<TimeSelection>(() => {
    if (taskData.dueTime) {
      const [timeStr, period] = taskData.dueTime.split(' ');
      const [hourStr, minuteStr] = timeStr.split(':');
      return {
        hour: parseInt(hourStr),
        minute: parseInt(minuteStr),
        period: period as 'AM' | 'PM'
      };
    }
    return { hour: 10, minute: 0, period: 'AM' };
  });
  
  const [currentMonth, setCurrentMonth] = useState(taskData.dueDate ? taskData.dueDate.getMonth() : new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(taskData.dueDate ? taskData.dueDate.getFullYear() : new Date().getFullYear());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const taskMutation = useTaskMutation(isEditMode, closeModal);

  useEffect(() => {
    const getUserId = () => {
      if (user?.id && user.id !== "undefined") return user.id;
      if (userId && userId !== "undefined") return userId;
      const storedUserId = localStorage.getItem("user_id");
      if (storedUserId && storedUserId !== "undefined" && storedUserId !== "null") return storedUserId;
      return null;
    };
    
    const effectiveUserId = getUserId();
    if (effectiveUserId) {
      setTaskData(prev => ({ ...prev, userId: effectiveUserId }));
    }
  }, [user, userId]);

  useEffect(() => {
    setSelectedDate(taskData.dueDate);
  }, [taskData.dueDate]);

  useEffect(() => {
    if (selectedDate) {
      const effectiveUserId = 
        taskData.userId !== "undefined" ? taskData.userId : 
        userId !== "undefined" ? userId : 
        user?.id || 
        localStorage.getItem("user_id") || 
        "";
      
      setTaskData(prev => ({
        ...prev,
        userId: effectiveUserId,
        dueDate: selectedDate instanceof Date ? selectedDate : null,
        dueTime: formatTime()
      }));
      
      validateDate(selectedDate);
    }
  }, [selectedDate, selectedTime, userId, user]);

  const validateDate = (date: Date | null) => {
    if (!date) {
      setDateError(null);
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDateOnly = new Date(date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    
    if (selectedDateOnly < today) {
      setDateError("Due date cannot be in the past");
    } else {
      setDateError(null);
    }
  };

  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const incrementHour = () => {
    setSelectedTime(prev => ({
      ...prev,
      hour: prev.hour === 12 ? 1 : prev.hour + 1
    }));
  };

  const decrementHour = () => {
    setSelectedTime(prev => ({
      ...prev,
      hour: prev.hour === 1 ? 12 : prev.hour - 1
    }));
  };

  const incrementMinute = () => {
    setSelectedTime(prev => ({
      ...prev,
      minute: prev.minute === 55 ? 0 : prev.minute + 5
    }));
  };

  const decrementMinute = () => {
    setSelectedTime(prev => ({
      ...prev,
      minute: prev.minute === 0 ? 55 : prev.minute - 5
    }));
  };

  const togglePeriod = (period: 'AM' | 'PM') => {
    setSelectedTime(prev => ({ ...prev, period }));
  };

  const formatTime = () => {
    const { hour, minute, period } = selectedTime;
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  const toggleImportant = () => {
    setTaskData(prev => ({ ...prev, important: !prev.important }));
  };
  
  const clearDeadline = () => {
    setSelectedDate(null);
    setTaskData(prev => ({ ...prev, dueDate: null, dueTime: "" }));
    setDateError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate date if present and return if there's an error
    if (taskData.dueDate) {
      validateDate(taskData.dueDate);
      if (dateError) {
        return;
      }
    }

    setApiError(null);
    const effectiveUserId = taskData.userId || user?.id || userId || localStorage.getItem("user_id");
    
    if (!effectiveUserId) {
      setApiError("User ID is required but not available. Please log in again.");
      return;
    }

    const updatedTaskData = { ...taskData, userId: effectiveUserId };
    setTaskData(updatedTaskData);
    taskMutation.mutate(updatedTaskData);
    
    if (typeof parentHandleSubmit === 'function') {
      parentHandleSubmit();
    }
  };
  
  // Form is valid if there's a title and no date error
  const isFormValid = taskData.title.trim() !== '' && !dateError;
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in-50 zoom-in-95">
        <div className="mb-5 flex justify-between">
          <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Task' : 'Add Task'}</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            value={taskData.title}
            onChange={(e) => setTaskData({...taskData, title: e.target.value})}
            className="w-full p-2 text-xl font-medium placeholder-gray-400 border-none focus:outline-none"
            placeholder="Task name"
            autoFocus
          />
          
          <textarea
            value={taskData.description}
            onChange={(e) => setTaskData({...taskData, description: e.target.value})}
            className="w-full p-2 text-sm text-gray-700 border-none focus:outline-none resize-none"
            placeholder="Description"
            rows={2}
          />
          
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedDate ? (
              <div className="flex gap-1">
                <button 
                  type="button"
                  className="px-3 py-1.5 text-sm border rounded-full flex items-center gap-2 border-blue-300 bg-blue-50 text-blue-700"
                  onClick={() => setShowCalendar(prev => !prev)}
                >
                  <CalendarIcon size={16} />
                  {selectedDate.toLocaleDateString()}
                </button>
                <button 
                  type="button"
                  className="px-3 py-1.5 text-sm border rounded-full flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={clearDeadline}
                >
                  <X size={16} />
                  Clear
                </button>
              </div>
            ) : (
              <button 
                type="button"
                className="px-3 py-1.5 text-sm border rounded-full flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowCalendar(prev => !prev)}
              >
                <CalendarIcon size={16} />
                Set date & time
              </button>
            )}
            <button 
              type="button"
              className={`px-3 py-1.5 text-sm border rounded-full flex items-center gap-2 ${
                taskData.important ? 'border-yellow-300 bg-yellow-50 text-yellow-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={toggleImportant}
            >
              <Star size={16} fill={taskData.important ? "currentColor" : "none"} />
              Important
            </button>
          </div>
          
          {(dateError || apiError) && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={16} />
              {dateError || apiError}
            </div>
          )}
          
          {showCalendar && (
            <div className="mt-4 border border-gray-200 rounded-lg shadow-sm animate-in fade-in-50 zoom-in-95">
              <Calendar
                currentMonth={currentMonth}
                currentYear={currentYear}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                months={months}
                years={years}
                showMonthDropdown={showMonthDropdown}
                showYearDropdown={showYearDropdown}
                setShowMonthDropdown={setShowMonthDropdown}
                setShowYearDropdown={setShowYearDropdown}
                setCurrentMonth={setCurrentMonth}
                setCurrentYear={setCurrentYear}
                handleDayClick={handleDayClick}
                incrementHour={incrementHour}
                decrementHour={decrementHour}
                incrementMinute={incrementMinute}
                decrementMinute={decrementMinute}
                togglePeriod={togglePeriod}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
              />
            </div>
          )}
        
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || taskMutation.isPending}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isFormValid && !taskMutation.isPending
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
            >
              {taskMutation.isPending 
                ? 'Saving...' 
                : isEditMode 
                  ? 'Update Task' 
                  : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;