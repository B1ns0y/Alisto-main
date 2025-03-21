import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  months: string[];
  years: number[];
  showMonthDropdown: boolean;
  showYearDropdown: boolean;
  setShowMonthDropdown: (show: boolean) => void;
  setShowYearDropdown: (show: boolean) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  months,
  years,
  showMonthDropdown,
  showYearDropdown,
  setShowMonthDropdown,
  setShowYearDropdown,
  setCurrentMonth,
  setCurrentYear
}) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="relative">
        <button 
          type="button"
          className="flex items-center gap-1 text-sm font-medium hover:bg-gray-100 p-1 rounded"
          onClick={() => setShowMonthDropdown(!showMonthDropdown)}
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
          onClick={() => setShowYearDropdown(!showYearDropdown)}
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
  );
};