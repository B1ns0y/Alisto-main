import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarHeader } from './CalendarHeader';
import { TimeSelector } from './TimeSelector';
import { generateCalendarDays, isSelectedDay, isToday, isPastDate } from './utils';
import { TimeSelection } from '../types';

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  selectedDate: Date | null;
  selectedTime: TimeSelection;
  months: string[];
  years: number[];
  showMonthDropdown: boolean;
  showYearDropdown: boolean;
  setShowMonthDropdown: (show: boolean) => void;
  setShowYearDropdown: (show: boolean) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  handleDayClick: (day: number, isCurrentMonth: boolean) => void;
  incrementHour: () => void;
  decrementHour: () => void;
  incrementMinute: () => void;
  decrementMinute: () => void;
  togglePeriod: (period: 'AM' | 'PM') => void;
  prevMonth: () => void;
  nextMonth: () => void;
}

const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  currentYear,
  selectedDate,
  selectedTime,
  months,
  years,
  showMonthDropdown,
  showYearDropdown,
  setShowMonthDropdown,
  setShowYearDropdown,
  setCurrentMonth,
  setCurrentYear,
  handleDayClick,
  incrementHour,
  decrementHour,
  incrementMinute,
  decrementMinute,
  togglePeriod,
  prevMonth,
  nextMonth
}) => {
  return (
    <div className="p-4 bg-white rounded-lg">
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        months={months}
        years={years}
        showMonthDropdown={showMonthDropdown}
        showYearDropdown={showYearDropdown}
        setShowMonthDropdown={setShowMonthDropdown}
        setShowYearDropdown={setShowYearDropdown}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
      />
      
      <div className="flex justify-between mb-2">
        <button type="button" className="p-1 rounded-full hover:bg-gray-100" onClick={prevMonth}>
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex gap-1">
          {daysOfWeek.map(day => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <button type="button" className="p-1 rounded-full hover:bg-gray-100" onClick={nextMonth}>
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays(currentYear, currentMonth).map((day, index) => (
          <button
            key={index}
            type="button"
            disabled={!day.currentMonth}
            className={cn(
              "w-8 h-8 text-xs flex items-center justify-center rounded-full transition-colors",
              isSelectedDay(day.day, day.currentMonth, selectedDate, currentMonth, currentYear) && "bg-blue-600 text-white",
              !isSelectedDay(day.day, day.currentMonth, selectedDate, currentMonth, currentYear) && 
                isToday(day.day, day.currentMonth, currentMonth, currentYear) && "border border-blue-600 text-blue-600",
              !isSelectedDay(day.day, day.currentMonth, selectedDate, currentMonth, currentYear) && 
                !isToday(day.day, day.currentMonth, currentMonth, currentYear) && day.currentMonth && "hover:bg-gray-100",
              !day.currentMonth && "text-gray-300",
              isPastDate(day.day, day.currentMonth, currentMonth, currentYear) && "text-gray-400 line-through"
            )}
            onClick={() => handleDayClick(day.day, day.currentMonth)}
          >
            {day.day}
          </button>
        ))}
      </div>
      
      <TimeSelector
        selectedTime={selectedTime}
        incrementHour={incrementHour}
        decrementHour={decrementHour}
        incrementMinute={incrementMinute}
        decrementMinute={decrementMinute}
        togglePeriod={togglePeriod}
      />
    </div>
  );
};