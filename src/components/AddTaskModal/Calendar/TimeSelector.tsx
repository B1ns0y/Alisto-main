import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TimeSelection } from '../types';

interface TimeSelectorProps {
  selectedTime: TimeSelection;
  incrementHour: () => void;
  decrementHour: () => void;
  incrementMinute: () => void;
  decrementMinute: () => void;
  togglePeriod: (period: 'AM' | 'PM') => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  incrementHour,
  decrementHour,
  incrementMinute,
  decrementMinute,
  togglePeriod
}) => {
  return (
    <div className="mt-4 flex justify-between items-center">
      <div className="text-xs text-gray-500">Time</div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={incrementHour}>
            <ChevronUp size={14} />
          </button>
          <div className="w-8 text-center font-mono">{selectedTime.hour.toString().padStart(2, '0')}</div>
          <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={decrementHour}>
            <ChevronDown size={14} />
          </button>
        </div>
        
        <div className="text-lg font-mono">:</div>
        
        <div className="flex flex-col items-center">
          <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={incrementMinute}>
            <ChevronUp size={14} />
          </button>
          <div className="w-8 text-center font-mono">{selectedTime.minute.toString().padStart(2, '0')}</div>
          <button type="button" className="p-1 hover:bg-gray-100 rounded" onClick={decrementMinute}>
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
  );
};