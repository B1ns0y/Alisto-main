import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Star, AlertCircle } from 'lucide-react';
import { ITask } from '@/interface/interfaces';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/middleware/api'; 
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AddTaskModalProps {
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
  errorMessage: string | null;
}


const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  isEditMode,
  taskData, 
  setTaskData, 
  handleSubmit: parentHandleSubmit, 
  closeModal,
  userId,
  errorMessage
}) => {
  const { user, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [effectiveUserId, setEffectiveUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const effectiveUserId = userId || user?.id || localStorage.getItem("user_id");
    if (effectiveUserId) {
      setTaskData(prev => ({
        ...prev,
        userId: effectiveUserId
      }));
      setEffectiveUserId(effectiveUserId);
    }
  }, [userId, user, setTaskData]);
  
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(taskData.dueDate);
  const [selectedTime, setSelectedTime] = useState<{hour: number, minute: number, period: 'AM' | 'PM'}>(() => {
    if (taskData.dueTime) {
      const [timeStr, period] = taskData.dueTime.split(' ');
      const [hourStr, minuteStr] = timeStr.split(':');
      return {
        hour: parseInt(hourStr),
        minute: parseInt(minuteStr),
        period: period as 'AM' | 'PM'
      };
    }
    return {
      hour: 10,
      minute: 0,
      period: 'AM'
    };
  });

  const handleMinuteInput = (value: string) => {
    const minuteValue = parseInt(value);
    
    // If input is empty, reset to 0
    if (isNaN(minuteValue)) {
      setSelectedTime(prev => ({...prev, minute: 0}));
      return;
    }

    // If input is over 59, wrap to 00
    const processedMinute = minuteValue > 59 ? 0 : minuteValue;
    
    setSelectedTime(prev => ({
      ...prev, 
      minute: processedMinute
    }));
  };

  const handleHourInput = (value: string) => {
    const hourValue = parseInt(value);
    
    // If input is empty, reset to 10
    if (isNaN(hourValue)) {
      setSelectedTime(prev => ({...prev, hour: 10}));
      return;
    }

    // Limit hour between 1 and 12
    const processedHour = Math.max(1, Math.min(12, hourValue));
    
    setSelectedTime(prev => ({
      ...prev, 
      hour: processedHour
    }));
  };

  
  const [currentMonth, setCurrentMonth] = useState(
    taskData.dueDate ? taskData.dueDate.getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    taskData.dueDate ? taskData.dueDate.getFullYear() : new Date().getFullYear()
  );
  
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
  const queryClient = useQueryClient();
  
  // Add error state
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Fix the mutation function to handle dates properly
  const taskMutation = useMutation({
    // In your task mutation function
    mutationFn: async (taskData: ITask) => {
      // Get token from localStorage
      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const url = isEditMode 
        ? `${import.meta.env.VITE_API_BASE_URL}/todos/update_task/${taskData.id}` 
        : `${import.meta.env.VITE_API_BASE_URL}/todos/create_task/`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      // Prepare deadline
      let deadline = null;
      if (taskData.dueDate) {
        const date = new Date(taskData.dueDate);
        
        // Parse the time string
        if (taskData.dueTime) {
          const [timeStr, period] = taskData.dueTime.split(' ');
          const [hours, minutes] = timeStr.split(':').map(Number);
          
          // Convert to 24-hour format if PM
          let hour = hours;
          if (period === 'PM' && hours < 12) {
            hour += 12;
          } else if (period === 'AM' && hours === 12) {
            hour = 0;
          }
          
          date.setHours(hour, minutes, 0, 0);
        }
        
        deadline = date.toISOString();
      }
      
      // Add authorization to headers explicitly
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      
      const apiData = {
        title: taskData.title,
        description: taskData.description,
        deadline: deadline,
        is_important: Boolean(taskData.important),
        // Either don't send user ID or get it from a reliable source
        ...(taskData.userId && { user: taskData.userId })
      };
      
      try {
        const response = await api({
          method,
          url,
          data: apiData,
          headers
        });
        
        return response.data;
      } catch (error: any) {
        // Handle 401 Unauthorized errors by redirecting to login
        if (error.response && error.response.status === 401) {
          // Clear invalid auth data
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user");
          
          throw new Error("Authentication expired. Please log in again.");
        }
        console.error("API Error Details:", error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.refetchQueries({ queryKey: ["todos"] });
      // Close the modal
      closeModal();
      // Navigate to dashboard
      navigate('/dashboard');
    },
    onError: (error: any) => {
      // Enhanced error handling to show more specific messages
      const errorMessage = error.response?.data?.detail ||
                          error.response?.data?.message || 
                          error.response?.data?.user?.[0] || 
                          "Failed to save task. Please try again.";
      setApiError(errorMessage);
      console.error("Task mutation error:", error);
    }
  });
    
  useEffect(() => {
    setSelectedDate(taskData.dueDate);
  }, [taskData.dueDate]);
  
  useEffect(() => {
    if (selectedDate) {
      // Get the most reliable user ID
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
      
      // Check if selected date is valid (not in the past)
      validateDate(selectedDate);
    }
  }, [selectedDate, selectedTime, userId, user]);
  
  const validateDate = (date: Date | null) => {
    if (!date) {
      setDateError(null); // No error for no date
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
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    let firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    const daysInPrevMonth = getDaysInMonth(
      currentMonth === 0 ? currentYear - 1 : currentYear, 
      currentMonth === 0 ? 11 : currentMonth - 1
    );
    
    const calendarDays = [];
    
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        isPrevMonth: true
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        currentMonth: true,
        isPrevMonth: false,
        isNextMonth: false
      });
    }
    
    const remainingCells = 42 - calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
      calendarDays.push({
        day: i,
        currentMonth: false,
        isNextMonth: true
      });
    }
    
    return calendarDays;
  };

  const isSelectedDay = (day: number, isCurrentMonth: boolean) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear() &&
      isCurrentMonth
    );
  };

  const isToday = (day: number, isCurrentMonth: boolean) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear() &&
      isCurrentMonth
    );
  };

  const isPastDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(currentYear, currentMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate < today;
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

  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
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
    setSelectedTime(prev => ({
      ...prev,
      period
    }));
  };

  const formatTime = () => {
    const { hour, minute, period } = selectedTime;
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  const toggleImportant = () => {
    setTaskData(prev => ({
      ...prev,
      important: !prev.important
    }));
  };
  
  // Add function to clear deadline
  const clearDeadline = () => {
    setSelectedDate(null);
    setTaskData(prev => ({
      ...prev,
      dueDate: null,
      dueTime: ""
    }));
    setDateError(null);
  };

  // New handleFormSubmit that fixes the issue with the add task button
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate date if present
    if (taskData.dueDate) {
      validateDate(taskData.dueDate);
      if (dateError) return;
  
      // Validate time if date is today
      const today = new Date();
      if (
        taskData.dueDate.getFullYear() === today.getFullYear() &&
        taskData.dueDate.getMonth() === today.getMonth() &&
        taskData.dueDate.getDate() === today.getDate()
      ) {
        const currentTime = new Date();
        const selectedTime = new Date(taskData.dueDate);
        const [timeStr, period] = taskData.dueTime.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        let hour = hours;
        if (period === 'PM' && hours < 12) {
          hour += 12;
        } else if (period === 'AM' && hours === 12) {
          hour = 0;
        }
        selectedTime.setHours(hour, minutes, 0, 0);
  
        if (selectedTime < currentTime) {
          setDateError("Task should not be overdue");
          return;
        }
      }
    }
  
    setApiError(null);
  
    if (!effectiveUserId) {
      setApiError("User ID is required but not available. Please log in again.");
      return;
    }
  
    // Update the taskData with our verified userId
    const updatedTaskData = {
      ...taskData,
      userId: effectiveUserId
    };
  
    setTaskData(updatedTaskData);
  
    // Prepare task data for submission
    const newTask: ITask = {
      ...updatedTaskData,
      id: updatedTaskData.id ?? '',
      completed: updatedTaskData.completed ?? false,
      dueDate: updatedTaskData.dueDate,
      userId: effectiveUserId,
      deadline: undefined,
      userData: {}
    };
  
    // Use mutation to submit the task
    taskMutation.mutate(newTask);
  
    // Also call the parent's handleSubmit if provided
    if (typeof parentHandleSubmit === 'function') {
      parentHandleSubmit();
    }
  };
  
  // Modify validation to only check title, not date error
  const isFormValid = taskData.title.trim() !== '' && !dateError;
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in-50 zoom-in-95">
        <div className="mb-5 flex justify-between">
          <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Task' : 'Add Task'}</h2>
          <button 
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
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
              className={`px-3 py-1.5 text-sm border rounded-full flex items-center gap-2 ${taskData.important ? 'border-yellow-300 bg-yellow-50 text-yellow-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              onClick={toggleImportant}
            >
              <Star size={16} fill={taskData.important ? "currentColor" : "none"} />
              Important
            </button>
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}
          {dateError && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={16} />
              {dateError}
            </div>
          )}
          
          {apiError && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={16} />
              {apiError}
            </div>
          )}
          
          {showCalendar && (
            <div className="mt-4 border border-gray-200 rounded-lg shadow-sm animate-in fade-in-50 zoom-in-95">
              <div className="p-4 bg-white rounded-lg">
                <div className="mb-4 flex justify-between items-center">
                  <div className="relative">
                    <button 
                      type="button"
                      className="flex items-center gap-1 text-sm font-medium hover:bg-gray-100 p-1 rounded"
                      onClick={() => setShowMonthDropdown(prev => !prev)}
                    >
                      {months[currentMonth]}
                      <ChevronDown size={16} />
                    </button>
                    
                    {showMonthDropdown && (
                      <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-40 max-h-48 overflow-y-auto">
                        {months.map((month, index) => (
                          <div 
                            key={month} 
                            className={`p-1 text-sm cursor-pointer rounded hover:bg-gray-100 ${index === currentMonth ? 'bg-blue-50 text-blue-600' : ''}`}
                            onClick={() => {
                              setCurrentMonth(index);
                              setShowMonthDropdown(false);
                            }}
                          >
                            {month}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button 
                      type="button"
                      className="flex items-center gap-1 text-sm font-medium hover:bg-gray-100 p-1 rounded"
                      onClick={() => setShowYearDropdown(prev => !prev)}
                    >
                      {currentYear}
                      <ChevronDown size={16} />
                    </button>
                    
                    {showYearDropdown && (
                      <div className="absolute z-10 top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-24 max-h-48 overflow-y-auto">
                        {years.map(year => (
                          <div 
                            key={year} 
                            className={`p-1 text-sm cursor-pointer rounded hover:bg-gray-100 ${year === currentYear ? 'bg-blue-50 text-blue-600' : ''}`}
                            onClick={() => {
                              setCurrentYear(year);
                              setShowYearDropdown(false);
                            }}
                          >
                            {year}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mb-2">
                  <button 
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={prevMonth}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex gap-1">
                    {daysOfWeek.map(day => (
                      <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={nextMonth}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      disabled={!day.currentMonth}
                      className={cn(
                        "w-8 h-8 text-xs flex items-center justify-center rounded-full transition-colors",
                        isSelectedDay(day.day, day.currentMonth) && "bg-blue-600 text-white",
                        !isSelectedDay(day.day, day.currentMonth) && isToday(day.day, day.currentMonth) && "border border-blue-600 text-blue-600",
                        !isSelectedDay(day.day, day.currentMonth) && !isToday(day.day, day.currentMonth) && day.currentMonth && "hover:bg-gray-100",
                        !day.currentMonth && "text-gray-300",
                        isPastDate(day.day, day.currentMonth) && "text-gray-400 line-through"
                      )}
                      onClick={() => handleDayClick(day.day, day.currentMonth)}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center relative">
                      <button 
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded absolute -top-6"
                        onClick={incrementHour}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <input 
                        type="number" 
                        value={selectedTime.hour} 
                        onChange={(e) => handleHourInput(e.target.value)}
                        min={1} 
                        max={12} 
                        className="w-10 text-center font-mono border rounded px-1 py-0.5 text-sm focus:outline-blue-500"
                        style={{ appearance: 'textfield' }}
                      />
                      <button 
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded absolute -bottom-6"
                        onClick={decrementHour}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <div className="text-lg font-mono mt-2">:</div>
                    <div className="flex flex-col items-center relative">
                      <button 
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded absolute -top-6"
                        onClick={incrementMinute}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <input 
                        type="number" 
                        value={selectedTime.minute.toString().padStart(2, '0')} 
                        onChange={(e) => handleMinuteInput(e.target.value)}
                        min={0} 
                        max={59} 
                        className="w-10 text-center font-mono border rounded px-1 py-0.5 text-sm focus:outline-blue-500"
                        style={{ appearance: 'textfield' }}
                      />
                      <button 
                        type="button"
                        className="p-1 hover:bg-gray-100 rounded absolute -bottom-6"
                        onClick={decrementMinute}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      <button 
                        type="button"
                        className={`px-2 py-1 text-xs rounded ${selectedTime.period === 'AM' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                        onClick={() => togglePeriod('AM')}
                      >
                        AM
                      </button>
                      <button 
                        type="button"
                        className={`px-2 py-1 text-xs rounded ${selectedTime.period === 'PM' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                        onClick={() => togglePeriod('PM')}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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