import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Hash } from 'lucide-react';
import { Project } from '../types';
import { cn } from '@/lib/utils';

interface AddTaskModalProps {
  newTask: {
    title: string;
    location: string;
    category: string;
    tag: string;
    project: string;
  };
  setNewTask: React.Dispatch<React.SetStateAction<{
    title: string;
    location: string;
    category: string;
    tag: string;
    project: string;
  }>>;
  handleAddTask: () => void;
  setShowAddTaskModal: (show: boolean) => void;
  projects: Project[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  newTask, 
  setNewTask, 
  handleAddTask, 
  setShowAddTaskModal,
  projects
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{hour: number, minute: number, period: 'AM' | 'PM'}>({
    hour: 10,
    minute: 0,
    period: 'AM'
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = [2024, 2025, 2026, 2027, 2028];
  
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
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

  const handleProjectSelect = (projectId: string) => {
    setNewTask({...newTask, project: projectId});
    setShowProjectSelector(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in-50 zoom-in-95">
        <div className="mb-5 flex justify-between">
          <h2 className="text-xl font-bold text-gray-600">Add Task</h2>
          <button 
            onClick={() => setShowAddTaskModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            className="w-full p-2 text-xl font-medium placeholder-gray-400 border-none focus:outline-none"
            placeholder="Enter Task Name"
          />
          
          <input
            type="text"
            value={newTask.location}
            onChange={(e) => setNewTask({...newTask, location: e.target.value})}
            className="w-full p-2 text-sm text-gray-500 border-none focus:outline-none"
            placeholder="Description"
          />
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              className="px-2 py-1 text-xs border border-gray-300 rounded-full text-gray-500 hover:bg-gray-100"
              onClick={() => setShowCalendar(prev => !prev)}
            >
              ⏱ {selectedDate ? selectedDate.toLocaleDateString() : 'Set Date & Time'}
            </button>
            
            <button 
              className={`px-2 py-1 text-xs border ${newTask.project ? 'border-blue-300 bg-blue-50' : 'border-gray-300'} rounded-full text-gray-500 hover:bg-gray-100`}
              onClick={() => setShowProjectSelector(prev => !prev)}
            >
              📎 {newTask.project ? projects.find(p => p.id === newTask.project)?.name || 'Project' : 'Project'}
            </button>
            
          </div>
          
          {showProjectSelector && (
            <div className="mt-4 border border-gray-100 rounded-lg shadow-sm">
              <div className="p-4 bg-white rounded-lg">
                <h3 className="text-sm font-medium mb-2">My Projects</h3>
                
                <div className="space-y-2">
                  {projects.map(project => (
                    <div 
                      key={project.id}
                      className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${newTask.project === project.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                      onClick={() => handleProjectSelect(project.id)}
                    >
                      <Hash size={16} className="mr-2 text-gray-500" />
                      <span>{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {showCalendar && (
            <div className="mt-4 border border-gray-100 rounded-lg shadow-sm">
              <div className="p-4 bg-white rounded-t-lg">
                <h3 className="text-center font-medium mb-4">Set Date</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="relative">
                    <button
                      className="px-3 py-1 border rounded-md flex items-center justify-between w-28"
                      onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    >
                      {months[currentMonth]}
                    </button>
                    
                    {showMonthDropdown && (
                      <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg w-36 max-h-60 overflow-y-auto">
                        {months.map((month, idx) => (
                          <button
                            key={month}
                            className={cn(
                              "w-full px-3 py-1 text-left hover:bg-blue-50",
                              currentMonth === idx ? "text-blue-500 font-medium" : ""
                            )}
                            onClick={() => {
                              setCurrentMonth(idx);
                              setShowMonthDropdown(false);
                            }}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button
                      className="px-3 py-1 border rounded-md flex items-center justify-between w-20"
                      onClick={() => setShowYearDropdown(!showYearDropdown)}
                    >
                      {currentYear}
                    </button>
                    
                    {showYearDropdown && (
                      <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg w-24 max-h-60 overflow-y-auto">
                        {years.map((year) => (
                          <button
                            key={year}
                            className={cn(
                              "w-full px-3 py-1 text-left hover:bg-blue-50",
                              currentYear === year ? "text-blue-500 font-medium" : ""
                            )}
                            onClick={() => {
                              setCurrentYear(year);
                              setShowYearDropdown(false);
                            }}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="grid grid-cols-7 gap-1 w-full">
                    {daysOfWeek.map(day => (
                      <div
                        key={day}
                        className="text-xs text-center font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={nextMonth}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      className={cn(
                        "h-8 w-8 text-sm rounded-full flex items-center justify-center",
                        day.currentMonth ? "text-gray-700" : "text-gray-400",
                        isSelectedDay(day.day, day.currentMonth) ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                      )}
                      onClick={() => handleDayClick(day.day, day.currentMonth)}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-b-lg border-t">
                <h3 className="text-center font-medium mb-4">Set Time</h3>
                
                <div className="flex items-center justify-center space-x-2">
                  <div className="relative flex flex-col items-center">
                    <button onClick={incrementHour} className="hover:bg-gray-100 p-1 rounded">
                      <ChevronUp size={16} />
                    </button>
                    <div className="w-10 text-center">{selectedTime.hour}</div>
                    <button onClick={decrementHour} className="hover:bg-gray-100 p-1 rounded">
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  
                  <div className="text-xl font-medium">:</div>
                  
                  <div className="relative flex flex-col items-center">
                    <button onClick={incrementMinute} className="hover:bg-gray-100 p-1 rounded">
                      <ChevronUp size={16} />
                    </button>
                    <div className="w-10 text-center">{selectedTime.minute.toString().padStart(2, '0')}</div>
                    <button onClick={decrementMinute} className="hover:bg-gray-100 p-1 rounded">
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  
                  <div className="ml-2 flex">
                    <button
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-l-md border",
                        selectedTime.period === 'AM' ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                      )}
                      onClick={() => togglePeriod('AM')}
                    >
                      AM
                    </button>
                    <button
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-r-md border-t border-r border-b",
                        selectedTime.period === 'PM' ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                      )}
                      onClick={() => togglePeriod('PM')}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-8 mt-8 border-t">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors rounded"
              onClick={() => setShowAddTaskModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
