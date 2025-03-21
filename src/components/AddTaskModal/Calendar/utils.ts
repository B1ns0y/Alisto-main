export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  export const getFirstDayOfMonth = (year: number, month: number): number => {
    let firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };
  
  export const generateCalendarDays = (currentYear: number, currentMonth: number) => {
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
  
  export const isSelectedDay = (
    day: number, 
    isCurrentMonth: boolean, 
    selectedDate: Date | null, 
    currentMonth: number, 
    currentYear: number
  ): boolean => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear() &&
      isCurrentMonth
    );
  };
  
  export const isToday = (day: number, isCurrentMonth: boolean, currentMonth: number, currentYear: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear() &&
      isCurrentMonth
    );
  };
  
  export const isPastDate = (day: number, isCurrentMonth: boolean, currentMonth: number, currentYear: number): boolean => {
    if (!isCurrentMonth) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(currentYear, currentMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate < today;
  };