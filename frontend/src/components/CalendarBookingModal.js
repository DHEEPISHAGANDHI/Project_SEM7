import React, { useState } from 'react';
import styles from './CalendarBookingModal.module.css';

const CalendarBookingModal = ({ lawyer, consultationRequest, onClose, onBookingConfirmed }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [callType, setCallType] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Mock lawyer availability - in real app, this would come from API
  const lawyerAvailability = {
    '2025-08-18': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    '2025-08-19': ['09:00', '10:30', '14:00', '15:30'],
    '2025-08-20': ['10:00', '11:00', '15:00', '16:00'],
    '2025-08-21': ['09:00', '10:00', '14:00', '15:00', '16:00'],
    '2025-08-22': ['10:00', '11:00', '14:00'],
    '2025-08-25': ['09:00', '10:00', '11:00', '14:00', '15:00'],
    '2025-08-26': ['09:00', '10:30', '14:00', '15:30', '16:00'],
    '2025-08-27': ['10:00', '11:00', '15:00'],
    '2025-08-28': ['09:00', '14:00', '15:00', '16:00'],
    '2025-08-29': ['10:00', '11:00', '14:00', '15:00']
  };

  // Helper functions
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeSlot = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dateString = formatDate(currentDate);
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isToday = formatDate(currentDate) === formatDate(today);
      const isPast = currentDate < today;
      const isAvailable = lawyerAvailability[dateString] && lawyerAvailability[dateString].length > 0;

      days.push({
        date: new Date(currentDate),
        dateString,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isPast,
        isAvailable: isAvailable && !isPast,
        isSelectable: isAvailable && !isPast && isCurrentMonth
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleCallTypeSelect = (type) => {
    setCallType(type);
  };

  const handleBookMeeting = async () => {
    if (!selectedDate || !selectedTimeSlot || !callType) return;

    setIsBooking(true);

    const meetingData = {
      consultationRequestId: consultationRequest.id,
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      scheduledDate: selectedDate,
      scheduledTime: selectedTimeSlot,
      scheduledDateTime: `${selectedDate}T${selectedTimeSlot}:00`,
      callType: callType,
      meetingType: callType === 'video' ? 'Video Call' : 'Voice-only Call',
      status: 'scheduled',
      meetingId: `MEET_${Date.now()}`,
      meetingLink: `https://legal-platform.com/meeting/${Date.now()}`,
      bookedAt: new Date().toISOString()
    };

    console.log('Meeting booked:', meetingData);

    // Simulate API call
    setTimeout(() => {
      setIsBooking(false);
      setIsBooked(true);
      if (onBookingConfirmed) {
        onBookingConfirmed(meetingData);
      }
      setTimeout(() => {
        onClose();
      }, 4000);
    }, 2000);
  };

  if (!lawyer || !consultationRequest) return null;

  if (isBooked) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>Meeting Scheduled Successfully!</h3>
            <p>Your 30-minute consultation with <strong>{lawyer.name}</strong> has been confirmed.</p>
            
            <div className={styles.meetingDetails}>
              <h4>Meeting Details:</h4>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>📅 Date:</span>
                <span>{formatDisplayDate(selectedDate)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>⏰ Time:</span>
                <span>{formatTimeSlot(selectedTimeSlot)} (30 minutes)</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  {callType === 'video' ? '📹' : '📞'} Meeting Type:
                </span>
                <span>{callType === 'video' ? 'Video Call' : 'Voice-only Call'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>🔗 Meeting Link:</span>
                <span className={styles.meetingLink}>Available in your dashboard</span>
              </div>
            </div>

            <div className={styles.nextStepsInfo}>
              <h4>What's Next:</h4>
              <ul>
                <li>Meeting link will be available in your dashboard 15 minutes before the call</li>
                <li>You'll receive email reminders 24 hours and 1 hour before the meeting</li>
                <li>Test your camera/microphone before the meeting for best experience</li>
              </ul>
            </div>

            <button className={styles.closeButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.lawyerInfo}>
            <img src={lawyer.image} alt={lawyer.name} className={styles.lawyerAvatar} />
            <div>
              <h3>Book Consultation with {lawyer.name}</h3>
              <p>{lawyer.specialization}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.requestSummary}>
            <h4>Approved Consultation Request</h4>
            <p><strong>Legal Issue:</strong> {consultationRequest.legalIssue}</p>
            <p><strong>Description:</strong> {consultationRequest.issueDescription}</p>
          </div>

          {!selectedDate && (
            <div className={styles.calendarSection}>
              <h4>Step 1: Select a Date</h4>
              <p className={styles.instruction}>Choose an available date for your 30-minute consultation</p>
              
              <div className={styles.calendar}>
                <div className={styles.calendarHeader}>
                  <h5>August 2025</h5>
                </div>
                
                <div className={styles.calendarWeekDays}>
                  <div className={styles.weekDay}>Sun</div>
                  <div className={styles.weekDay}>Mon</div>
                  <div className={styles.weekDay}>Tue</div>
                  <div className={styles.weekDay}>Wed</div>
                  <div className={styles.weekDay}>Thu</div>
                  <div className={styles.weekDay}>Fri</div>
                  <div className={styles.weekDay}>Sat</div>
                </div>
                
                <div className={styles.calendarDays}>
                  {generateCalendarDays().map((day, index) => (
                    <div
                      key={index}
                      className={`${styles.calendarDay} 
                        ${!day.isCurrentMonth ? styles.otherMonth : ''} 
                        ${day.isToday ? styles.today : ''} 
                        ${day.isPast ? styles.pastDay : ''} 
                        ${day.isAvailable ? styles.availableDay : ''} 
                        ${day.isSelectable ? styles.selectableDay : ''}`}
                      onClick={() => day.isSelectable ? handleDateSelect(day.dateString) : null}
                    >
                      <span className={styles.dayNumber}>{day.day}</span>
                      {day.isAvailable && (
                        <span className={styles.availabilityIndicator}>
                          {lawyerAvailability[day.dateString]?.length} slots
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedDate && !selectedTimeSlot && (
            <div className={styles.timeSlotSection}>
              <h4>Step 2: Select a Time Slot</h4>
              <p className={styles.dateDisplay}>
                📅 {formatDisplayDate(selectedDate)}
              </p>
              
              <div className={styles.timeSlots}>
                {lawyerAvailability[selectedDate]?.map((timeSlot) => (
                  <button
                    key={timeSlot}
                    type="button"
                    className={styles.timeSlot}
                    onClick={() => handleTimeSlotSelect(timeSlot)}
                  >
                    <span className={styles.timeText}>{formatTimeSlot(timeSlot)}</span>
                    <span className={styles.durationText}>30 min</span>
                  </button>
                ))}
              </div>

              <button 
                className={styles.backButton} 
                onClick={() => setSelectedDate(null)}
              >
                ← Back to Calendar
              </button>
            </div>
          )}

          {selectedDate && selectedTimeSlot && !callType && (
            <div className={styles.callTypeSection}>
              <h4>Step 3: Choose Meeting Type</h4>
              <p className={styles.meetingSummary}>
                📅 {formatDisplayDate(selectedDate)} at {formatTimeSlot(selectedTimeSlot)}
              </p>
              
              <div className={styles.callTypeOptions}>
                <div 
                  className={`${styles.callTypeOption} ${callType === 'video' ? styles.selected : ''}`}
                  onClick={() => handleCallTypeSelect('video')}
                >
                  <div className={styles.callTypeIcon}>
                    <i className="fas fa-video"></i>
                  </div>
                  <div className={styles.callTypeInfo}>
                    <h5>Video Call</h5>
                    <p>Face-to-face consultation via video call</p>
                  </div>
                </div>
                
                <div 
                  className={`${styles.callTypeOption} ${callType === 'voice' ? styles.selected : ''}`}
                  onClick={() => handleCallTypeSelect('voice')}
                >
                  <div className={styles.callTypeIcon}>
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className={styles.callTypeInfo}>
                    <h5>Voice-only Call</h5>
                    <p>Audio-only consultation via phone call</p>
                  </div>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button 
                  className={styles.backButton} 
                  onClick={() => setSelectedTimeSlot(null)}
                >
                  ← Back to Time Slots
                </button>
              </div>
            </div>
          )}

          {selectedDate && selectedTimeSlot && callType && (
            <div className={styles.confirmationSection}>
              <h4>Step 4: Confirm Your Booking</h4>
              
              <div className={styles.bookingSummary}>
                <h5>Meeting Summary:</h5>
                <div className={styles.summaryDetails}>
                  <p><strong>Lawyer:</strong> {lawyer.name}</p>
                  <p><strong>Date:</strong> {formatDisplayDate(selectedDate)}</p>
                  <p><strong>Time:</strong> {formatTimeSlot(selectedTimeSlot)} (30 minutes)</p>
                  <p><strong>Type:</strong> {callType === 'video' ? '📹 Video Call' : '📞 Voice-only Call'}</p>
                  <p><strong>Legal Issue:</strong> {consultationRequest.legalIssue}</p>
                </div>
              </div>

              <div className={styles.finalActions}>
                <button 
                  className={styles.backButton} 
                  onClick={() => setCallType('')}
                >
                  ← Back to Call Type
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={handleBookMeeting}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Booking Meeting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-calendar-check"></i>
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarBookingModal;
