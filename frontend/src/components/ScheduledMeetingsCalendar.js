import React, { useState, useEffect } from 'react';
import styles from './ScheduledMeetingsCalendar.module.css';
import TranslatableText from './TranslatableText';

const ScheduledMeetingsCalendar = ({ consultationRequests, onBlockTime, onBlockDay, onMeetingClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [blockedTimeSlots, setBlockedTimeSlots] = useState(new Set());
  const [blockedDays, setBlockedDays] = useState(new Set());

  // Generate time slots from 9 AM to 6 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get meetings for a specific date
  const getMeetingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return consultationRequests.filter(req => 
      req.status === 'scheduled' && req.scheduledDate === dateStr
    );
  };

  // Check if a date has meetings
  const dateHasMeetings = (date) => {
    return getMeetingsForDate(date).length > 0;
  };

  // Get current month calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Adjust to start from Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());
    // Adjust to end on Saturday
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days = [];
    const currentDateIter = new Date(startDate);
    
    while (currentDateIter <= endDate) {
      days.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
    
    return days;
  };

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setDragStart(null);
    setDragEnd(null);
  };

  // Handle time slot mouse events for dragging
  const handleTimeSlotMouseDown = (timeSlot) => {
    if (blockedTimeSlots.has(`${selectedDate.toISOString().split('T')[0]}-${timeSlot}`)) {
      return; // Can't drag on blocked slots
    }
    setIsDragging(true);
    setDragStart(timeSlot);
    setDragEnd(timeSlot);
    setSelectedTimeSlot(timeSlot);
  };

  const handleTimeSlotMouseEnter = (timeSlot) => {
    if (isDragging && dragStart) {
      setDragEnd(timeSlot);
    }
  };

  const handleTimeSlotMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      setIsDragging(false);
      // Don't clear drag selection immediately - let user decide to block
    }
  };

  // Get selected time range for blocking
  const getSelectedTimeRange = () => {
    if (!dragStart || !dragEnd) return null;
    
    const startIndex = timeSlots.indexOf(dragStart);
    const endIndex = timeSlots.indexOf(dragEnd);
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    
    return timeSlots.slice(start, end + 1);
  };

  // Block selected time range
  const blockSelectedTime = () => {
    const selectedRange = getSelectedTimeRange();
    if (!selectedRange || selectedRange.length === 0) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const newBlockedSlots = new Set(blockedTimeSlots);
    
    selectedRange.forEach(slot => {
      newBlockedSlots.add(`${dateStr}-${slot}`);
    });
    
    setBlockedTimeSlots(newBlockedSlots);
    
    // Call parent callback
    if (onBlockTime) {
      onBlockTime(dateStr, selectedRange);
    }
    
    // Clear selection
    setDragStart(null);
    setDragEnd(null);
    setSelectedTimeSlot(null);
  };

  // Block entire day
  const blockEntireDay = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const newBlockedDays = new Set(blockedDays);
    newBlockedDays.add(dateStr);
    setBlockedDays(newBlockedDays);
    
    // Also block all time slots for this day
    const newBlockedSlots = new Set(blockedTimeSlots);
    timeSlots.forEach(slot => {
      newBlockedSlots.add(`${dateStr}-${slot}`);
    });
    setBlockedTimeSlots(newBlockedSlots);
    
    // Call parent callback
    if (onBlockDay) {
      onBlockDay(dateStr);
    }
  };

  // Check if time slot is blocked
  const isTimeSlotBlocked = (timeSlot) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return blockedTimeSlots.has(`${dateStr}-${timeSlot}`) || blockedDays.has(dateStr);
  };

  // Check if time slot is in selected range
  const isTimeSlotInSelectedRange = (timeSlot) => {
    if (!dragStart || !dragEnd) return false;
    
    const startIndex = timeSlots.indexOf(dragStart);
    const endIndex = timeSlots.indexOf(dragEnd);
    const currentIndex = timeSlots.indexOf(timeSlot);
    
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    
    return currentIndex >= start && currentIndex <= end;
  };

  // Get meeting at specific time
  const getMeetingAtTime = (timeSlot) => {
    const meetings = getMeetingsForDate(selectedDate);
    return meetings.find(meeting => meeting.scheduledTime === timeSlot);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isDateSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Check if date is in current month
  const isDateInCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const calendarDays = getCalendarDays();
  const selectedDateMeetings = getMeetingsForDate(selectedDate);
  const selectedTimeRange = getSelectedTimeRange();

  return (
    <div className={styles.scheduledMeetingsContainer}>
      {/* Left Side - Calendar */}
      <div className={styles.calendarSection}>
        <div className={styles.calendarHeader}>
          <button 
            className={styles.navButton}
            onClick={() => navigateMonth(-1)}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3 className={styles.monthTitle}>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            className={styles.navButton}
            onClick={() => navigateMonth(1)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className={styles.calendar}>
          <div className={styles.weekDays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>
          
          <div className={styles.calendarGrid}>
            {calendarDays.map((date, index) => (
              <div
                key={index}
                className={`${styles.calendarDay} 
                  ${isDateInCurrentMonth(date) ? styles.currentMonth : styles.otherMonth}
                  ${isToday(date) ? styles.today : ''}
                  ${isDateSelected(date) ? styles.selected : ''}
                  ${blockedDays.has(date.toISOString().split('T')[0]) ? styles.blockedDay : ''}
                `}
                onClick={() => handleDateClick(date)}
              >
                <span className={styles.dayNumber}>{date.getDate()}</span>
                {dateHasMeetings(date) && (
                  <div className={styles.meetingIndicator}>
                    <span className={styles.meetingDot}></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Block Entire Day Button */}
        <div className={styles.calendarActions}>
          <button 
            className={styles.blockDayButton}
            onClick={blockEntireDay}
            disabled={blockedDays.has(selectedDate.toISOString().split('T')[0])}
          >
            <i className="fas fa-ban"></i>
            <TranslatableText text="Block this entire day" />
          </button>
        </div>
      </div>

      {/* Right Side - Daily Schedule */}
      <div className={styles.scheduleSection}>
        <div className={styles.scheduleHeader}>
          <h3 className={styles.selectedDateTitle}>
            {formatDate(selectedDate)}
          </h3>
          {selectedDateMeetings.length > 0 && (
            <span className={styles.meetingCount}>
              {selectedDateMeetings.length} meeting{selectedDateMeetings.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className={styles.timeSlotContainer}>
          {timeSlots.map((timeSlot, index) => {
            const meeting = getMeetingAtTime(timeSlot);
            const isBlocked = isTimeSlotBlocked(timeSlot);
            const isSelected = isTimeSlotInSelectedRange(timeSlot);
            
            return (
              <div
                key={timeSlot}
                className={`${styles.timeSlot} 
                  ${isBlocked ? styles.blocked : ''}
                  ${isSelected ? styles.selectedSlot : ''}
                  ${meeting ? styles.hasMeeting : ''}
                `}
                onMouseDown={() => !isBlocked && handleTimeSlotMouseDown(timeSlot)}
                onMouseEnter={() => handleTimeSlotMouseEnter(timeSlot)}
                onMouseUp={handleTimeSlotMouseUp}
              >
                <div className={styles.timeLabel}>
                  {timeSlot}
                </div>
                <div className={styles.timeContent}>
                  {isBlocked && !meeting ? (
                    <div className={styles.blockedIndicator}>
                      <i className="fas fa-ban"></i>
                      <span>Blocked</span>
                    </div>
                  ) : meeting ? (
                    <div 
                      className={styles.meetingInfo}
                      onClick={() => onMeetingClick && onMeetingClick(meeting)}
                      style={{ cursor: 'pointer' }}
                      title="Click to view meeting details"
                    >
                      <div className={styles.meetingClient}>
                        <i className="fas fa-user"></i>
                        {meeting.userName}
                      </div>
                      <div className={styles.meetingSubject}>
                        {meeting.subject}
                      </div>
                      <div className={styles.meetingType}>
                        {meeting.consultationType.replace('_', ' ')}
                      </div>
                      <div className={styles.meetingActions}>
                        <i className="fas fa-eye" title="View details"></i>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.emptySlot}>
                      <span>Available</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Block Time Actions */}
        {selectedTimeRange && selectedTimeRange.length > 0 && (
          <div className={styles.blockTimeActions}>
            <div className={styles.selectionInfo}>
              <span>
                Selected: {selectedTimeRange[0]} - {selectedTimeRange[selectedTimeRange.length - 1]}
                ({selectedTimeRange.length} hour{selectedTimeRange.length !== 1 ? 's' : ''})
              </span>
            </div>
            <div className={styles.actionButtons}>
              <button 
                className={styles.blockTimeButton}
                onClick={blockSelectedTime}
              >
                <i className="fas fa-ban"></i>
                <TranslatableText text="Block this time" />
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => {
                  setDragStart(null);
                  setDragEnd(null);
                  setSelectedTimeSlot(null);
                }}
              >
                <i className="fas fa-times"></i>
                <TranslatableText text="Cancel" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledMeetingsCalendar;
