import React, { useState, useRef, useEffect } from 'react';

const DatePicker = ({ selectedDate, onDateChange, minDate, maxDate, openUpwards = false, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [selectedDay, setSelectedDay] = useState(new Date(selectedDate));
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowYearDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update current month when selected date changes
  useEffect(() => {
    setCurrentMonth(new Date(selectedDate));
    setSelectedDay(new Date(selectedDate));
  }, [selectedDate]);

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date && date.toDateString() === selectedDay.toDateString();
  };

  const isDisabled = (date) => {
    if (!date) return true;
    
    const today = new Date();
    const min = minDate ? new Date(minDate) : new Date(1995, 5, 16); // APOD started June 16, 1995
    const max = maxDate ? new Date(maxDate) : today;
    
    return date < min || date > max;
  };

  const handleDateSelect = (date) => {
    if (date && !isDisabled(date)) {
      setSelectedDay(date);
      onDateChange(date);
      setIsOpen(false);
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDay(today);
    onDateChange(today);
    setIsOpen(false);
  };

  // Year dropdown functions
  const getAvailableYears = () => {
    const min = minDate ? new Date(minDate).getFullYear() : 1995;
    const max = maxDate ? new Date(maxDate).getFullYear() : new Date().getFullYear();
    const years = [];
    for (let year = max; year >= min; year--) {
      years.push(year);
    }
    return years;
  };

  const handleYearSelect = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setShowYearDropdown(false);
  };

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Date Picker Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={compact 
          ? "px-3 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none border border-gray-200 dark:border-gray-700"
          : "w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none"
        }
      >
        {compact ? (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
              {formatDateShort(selectedDay)}
            </span>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedDay)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Tarih Seç
                </div>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </button>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className={`absolute ${openUpwards ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden`}>
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center relative">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentMonth.getMonth()]}
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="text-lg font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {currentMonth.getFullYear()}
                  </button>
                  
                  {/* Year Dropdown */}
                  {showYearDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {getAvailableYears().map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearSelect(year)}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            year === currentMonth.getFullYear()
                              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 p-2 bg-gray-50 dark:bg-gray-700">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day)}
                disabled={isDisabled(day)}
                className={`
                  relative p-2 text-sm rounded-lg transition-all duration-200
                  ${!day 
                    ? 'cursor-default' 
                    : isDisabled(day)
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : isSelected(day)
                    ? 'bg-red-600 text-white font-semibold'
                    : isToday(day)
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold hover:bg-red-200 dark:hover:bg-red-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {day && day.getDate()}
                {isToday(day) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Footer with Today Button */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <button
              onClick={goToToday}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
            >
              Bugüne Git
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
