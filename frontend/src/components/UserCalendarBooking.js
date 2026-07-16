import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TranslatableText from './TranslatableText';
import styles from './UserCalendarBooking.module.css';

const UserCalendarBooking = () => {
  const { schedulingToken } = useParams();
  const navigate = useNavigate();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestDetails, setRequestDetails] = useState(null);
  const [lawyerDetails, setLawyerDetails] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  // Mock lawyer availability (9 AM to 6 PM, excluding blocked times)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Mock blocked times (in real app, fetch from lawyer's blocked schedule)
  const blockedTimes = new Set([
    '2025-08-17-13:00', // Today 1 PM blocked
    '2025-08-18-10:00', // Tomorrow 10 AM blocked
  ]);

  useEffect(() => {
    // Simulate loading request details from scheduling token
    const loadRequestDetails = async () => {
      setIsLoading(true);
      
      // In real implementation, validate token and fetch details from backend
      setTimeout(() => {
        // Mock data based on token
        setRequestDetails({
          id: 'REQ001',
          subject: 'Property Dispute Legal Advice',
          description: 'I am facing a boundary dispute with my neighbor.',
          userName: 'Rajesh Kumar',
          userEmail: 'rajesh@email.com',
          consultationType: 'free_30min'
        });
        
        setLawyerDetails({
          name: 'Legal Expert',
          specialization: 'Property Law',
          experience: '10+ years'
        });
        
        setIsLoading(false);
      }, 1000);
    };

    if (schedulingToken) {
      loadRequestDetails();
    } else {
      navigate('/');
    }
  }, [schedulingToken, navigate]);

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    startDate.setDate(startDate.getDate() - startDate.getDay());
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
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Handle date selection
  const handleDateClick = (date) => {
    // Don't allow booking in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return;
    
    setSelectedDate(date);
    setSelectedTime(null);
    
    // Generate available slots for this date
    const dateStr = date.toISOString().split('T')[0];
    const available = timeSlots.filter(slot => 
      !blockedTimes.has(`${dateStr}-${slot}`)
    );
    setAvailableSlots(available);
  };

  // Handle time selection
  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  // Handle booking confirmation
  const handleBookingConfirm = async () => {
    if (!selectedDate || !selectedTime || !requestDetails) return;
    
    setIsBooking(true);
    
    try {
      // Simulate API call to book the appointment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingData = {
        requestId: requestDetails.id,
        selectedDate: selectedDate.toISOString().split('T')[0],
        selectedTime: selectedTime,
        userName: requestDetails.userName,
        userEmail: requestDetails.userEmail
      };
      
      console.log('🎉 Appointment booked successfully:', bookingData);
      
      // In real implementation, call the parent component's handler
      // handleMeetingScheduled(bookingData);
      
      // Show success message and redirect
      alert('✅ Appointment Booked Successfully!\n\nYou will receive a confirmation email shortly with meeting details.');
      navigate('/booking-confirmation');
      
    } catch (error) {
      console.error('❌ Booking failed:', error);
      alert('❌ Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  // Check if date is available for booking
  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    const availableSlots = timeSlots.filter(slot => 
      !blockedTimes.has(`${dateStr}-${slot}`)
    );
    
    return availableSlots.length > 0;
  };

  // Utility functions
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isDateSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isDateInCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <h3>Loading your booking details...</h3>
      </div>
    );
  }

  if (!requestDetails || !lawyerDetails) {
    return (
      <div className={styles.errorContainer}>
        <h3>Invalid or Expired Link</h3>
        <p>This scheduling link is no longer valid. Please contact the lawyer for a new link.</p>
      </div>
    );
  }

  const calendarDays = getCalendarDays();

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.header}>
        <h1>Schedule Your Legal Consultation</h1>
        <div className={styles.requestInfo}>
          <h3>{requestDetails.subject}</h3>
          <p><strong>Lawyer:</strong> {lawyerDetails.name}</p>
          <p><strong>Duration:</strong> {requestDetails.consultationType.replace('_', ' ')}</p>
        </div>
      </div>

      <div className={styles.bookingContent}>
        {/* Calendar Section */}
        <div className={styles.calendarSection}>
          <div className={styles.calendarHeader}>
            <button 
              className={styles.navButton}
              onClick={() => navigateMonth(-1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <h3>
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
                <div key={day} className={styles.weekDay}>{day}</div>
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
                    ${isDateAvailable(date) ? styles.available : styles.unavailable}
                  `}
                  onClick={() => isDateAvailable(date) && handleDateClick(date)}
                >
                  {date.getDate()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Selection Section */}
        <div className={styles.timeSection}>
          {selectedDate ? (
            <>
              <h3>Available Times for {formatDate(selectedDate)}</h3>
              <div className={styles.timeSlots}>
                {availableSlots.map(time => (
                  <button
                    key={time}
                    className={`${styles.timeSlot} ${selectedTime === time ? styles.selectedTime : ''}`}
                    onClick={() => handleTimeClick(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
              
              {selectedTime && (
                <div className={styles.confirmationSection}>
                  <div className={styles.bookingSummary}>
                    <h4>Booking Summary</h4>
                    <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Duration:</strong> 30 minutes</p>
                    <p><strong>Type:</strong> Video Consultation</p>
                  </div>
                  
                  <button 
                    className={styles.confirmButton}
                    onClick={handleBookingConfirm}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <div className={styles.smallSpinner}></div>
                        <span>Booking...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check"></i>
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.selectDatePrompt}>
              <i className="fas fa-calendar-alt"></i>
              <h3>Select a date to see available times</h3>
              <p>Choose from the available dates highlighted in the calendar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCalendarBooking;
