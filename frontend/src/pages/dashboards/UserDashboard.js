import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useConsultationRequests } from '../../contexts/ConsultationRequestContext';
import TranslatableText from '../../components/TranslatableText';
import VideoCallInterface from '../../components/VideoCallInterface';
import jsPDF from 'jspdf';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    requests,
    cancelRequest,
    requestMeetingFromUser,
    scheduleMeeting,
    completeMeeting,
    sendMessage
  } = useConsultationRequests();

  const [activeTab, setActiveTab] = useState('consultations');
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeVideoConsultation, setActiveVideoConsultation] = useState(null);
  const [selectedLawyerForScheduling, setSelectedLawyerForScheduling] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Redirect to home if not authenticated or not a user
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'user') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper to generate relative date strings
  const getRelativeDateStr = (daysOffset) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  };

  // Filter user's requests
  const userRequests = requests.filter(r => r.userId === user?.id);

  // consultations list - map context requests to user dashboard format
  const consultations = userRequests
    .filter(r => r.status !== 'rejected' && r.status !== 'cancelled')
    .map(r => {
      let statusStr = '';
      if (r.status === 'pending') statusStr = 'Pending Approval';
      else if (r.status === 'active') statusStr = 'Approved - Schedule Now';
      else if (r.status === 'scheduled') statusStr = `Scheduled for ${formatDate(r.scheduledDate)} at ${r.scheduledTime}`;
      else if (r.status === 'completed') statusStr = 'Completed';
      else statusStr = r.status;

      return {
        ...r,
        status: statusStr,
        meetingApproved: r.meetingApproved || r.meetingRequestStatus === 'approved' || r.status === 'scheduled' || r.status === 'completed'
      };
    });

  const selectedConsultation = consultations.find(c => c.id === selectedConsultationId) || null;

  // requestHistory - complete history
  const requestHistory = userRequests.map(r => {
    let statusStr = '';
    if (r.status === 'pending') statusStr = 'Pending';
    else if (r.status === 'active') statusStr = 'Approved';
    else if (r.status === 'scheduled') statusStr = 'Scheduled';
    else if (r.status === 'completed') statusStr = 'Completed';
    else if (r.status === 'rejected') statusStr = 'Rejected';
    else if (r.status === 'cancelled') statusStr = 'Cancelled';
    else statusStr = r.status;

    return {
      id: r.id,
      lawyerName: r.lawyerName,
      lawyerPhoto: r.lawyerPhoto || '/api/placeholder/50/50',
      specialization: r.specialization,
      dateSent: r.requestDate,
      status: statusStr,
      legalIssue: r.subject
    };
  });

  // approvedLawyers - lawyers available for scheduling
  const approvedLawyers = consultations
    .filter(c => c.meetingApproved && c.status === 'Approved - Schedule Now')
    .map(c => ({
      id: c.lawyerId,
      name: c.lawyerName,
      photo: c.lawyerPhoto,
      specialization: c.specialization,
      consultationId: c.id,
      status: c.status,
      availableSlots: [
        { date: getRelativeDateStr(1), time: '10:00', available: true },
        { date: getRelativeDateStr(1), time: '14:00', available: false },
        { date: getRelativeDateStr(1), time: '16:00', available: true },
        { date: getRelativeDateStr(2), time: '09:00', available: true },
        { date: getRelativeDateStr(2), time: '11:00', available: true },
        { date: getRelativeDateStr(2), time: '15:00', available: true },
        { date: getRelativeDateStr(3), time: '10:00', available: true },
        { date: getRelativeDateStr(3), time: '13:00', available: true },
        { date: getRelativeDateStr(3), time: '17:00', available: true }
      ]
    }));

  // Mock data for downloaded documents
  useEffect(() => {
    const mockDocuments = [
      {
        id: 1,
        name: 'Draft Complaint Template',
        category: 'Legal Templates',
        downloadDate: '2025-08-17',
        fileUrl: '/documents/draft-complaint-template.pdf',
        description: 'Comprehensive legal complaint draft template with proper formatting'
      },
      {
        id: 2,
        name: 'Consumer Complaint Form',
        category: 'Consumer Rights',
        downloadDate: '2025-08-12',
        fileUrl: '/documents/consumer-complaint-form.pdf',
        description: 'Standard format for filing consumer complaints'
      },
      {
        id: 3,
        name: 'Rent Agreement Template',
        category: 'Property Law',
        downloadDate: '2025-08-08',
        fileUrl: '/documents/rent-agreement-template.pdf',
        description: 'Comprehensive rental agreement template'
      },
      {
        id: 4,
        name: 'Power of Attorney Format',
        category: 'Legal Documentation',
        downloadDate: '2025-08-05',
        fileUrl: '/documents/power-of-attorney.pdf',
        description: 'General power of attorney document'
      },
      {
        id: 5,
        name: 'Divorce Petition (Mutual Consent)',
        category: 'Family Law',
        downloadDate: '2025-08-03',
        fileUrl: '/documents/divorce-petition-mutual.pdf',
        description: 'Mutual consent divorce petition template'
      },
      {
        id: 6,
        name: 'Property Sale Agreement',
        category: 'Property Law',
        downloadDate: '2025-07-30',
        fileUrl: '/documents/property-sale-agreement.pdf',
        description: 'Standard property sale agreement format'
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  // Send message function
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConsultation) return;
    sendMessage(selectedConsultation.id, 'user', user?.name || 'You', newMessage.trim());
    setNewMessage('');
  };

  // Handle meeting request
  const handleRequestMeeting = (consultation) => {
    if (!consultation.hasActiveConversation) {
      alert('You must start a conversation before requesting a meeting.');
      return;
    }

    if (consultation.meetingRequestStatus === 'sent') {
      alert('You have already sent a meeting request. Please wait for the lawyer\'s response.');
      return;
    }

    requestMeetingFromUser(consultation.id);
  };

  // Get meeting request button based on status
  const getMeetingRequestButton = (consultation) => {
    if (!consultation.hasActiveConversation) {
      return null;
    }

    switch (consultation.meetingRequestStatus) {
      case 'none':
        return (
          <button 
            className={styles.requestMeetingButton}
            onClick={() => handleRequestMeeting(consultation)}
          >
            <i className="fas fa-video"></i>
            <TranslatableText text="Request a Meeting" />
          </button>
        );
      case 'sent':
        return (
          <button 
            className={`${styles.requestMeetingButton} ${styles.disabled}`}
            disabled
          >
            <i className="fas fa-clock"></i>
            <TranslatableText text="Meeting Request Sent" />
          </button>
        );
      case 'approved':
        return (
          <button 
            className={`${styles.requestMeetingButton} ${styles.approved}`}
            onClick={() => handleScheduleMeeting(consultation)}
          >
            <i className="fas fa-calendar-plus"></i>
            <TranslatableText text="Schedule Now" />
          </button>
        );
      case 'rejected':
        return (
          <button 
            className={`${styles.requestMeetingButton} ${styles.rejected}`}
            disabled
          >
            <i className="fas fa-times"></i>
            <TranslatableText text="Request Rejected" />
          </button>
        );
      case 'scheduled':
      case 'completed':
        return null;
      default:
        return null;
    }
  };

  // Download document function
  const handleDownloadDocument = (doc) => {
    if (doc.name === 'Draft Complaint Template') {
      generateDraftComplaintPDF();
    } else {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert(`${doc.name} downloaded successfully!`);
    }
  };

  // Generate Draft Complaint PDF
  const generateDraftComplaintPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DRAFT COMPLAINT TEMPLATE', 105, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('IN THE COURT OF:', 20, 40);
    pdf.setFont('helvetica', 'normal');
    pdf.text('_________________________________________________', 20, 48);
    pdf.text('(Name and Address of the Court)', 20, 55);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('CASE TYPE:', 20, 75);
    pdf.setFont('helvetica', 'normal');
    pdf.text('_________________________________________________', 20, 83);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('CASE NUMBER:', 20, 100);
    pdf.setFont('helvetica', 'normal');
    pdf.text('_________________________________________________', 20, 108);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('COMPLAINANT/PETITIONER:', 20, 125);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Name: ____________________________________', 20, 135);
    pdf.text('Address: __________________________________', 20, 145);
    pdf.text('___________________________________________', 20, 155);
    pdf.text('Phone: ____________________________________', 20, 165);
    pdf.text('Email: ____________________________________', 20, 175);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('RESPONDENT/DEFENDANT:', 20, 195);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Name: ____________________________________', 20, 205);
    pdf.text('Address: __________________________________', 20, 215);
    pdf.text('___________________________________________', 20, 225);
    
    pdf.addPage();
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('SUBJECT OF COMPLAINT:', 20, 20);
    pdf.setFont('helvetica', 'normal');
    pdf.text('_________________________________________________', 20, 28);
    pdf.text('_________________________________________________', 20, 36);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('FACTS OF THE CASE:', 20, 55);
    pdf.setFont('helvetica', 'normal');
    pdf.text('1. ___________________________________________', 20, 65);
    pdf.text('   ___________________________________________', 20, 73);
    pdf.text('', 20, 81);
    pdf.text('2. ___________________________________________', 20, 89);
    pdf.text('   ___________________________________________', 20, 97);
    pdf.text('', 20, 105);
    pdf.text('3. ___________________________________________', 20, 113);
    pdf.text('   ___________________________________________', 20, 121);
    pdf.text('', 20, 129);
    pdf.text('4. ___________________________________________', 20, 137);
    pdf.text('   ___________________________________________', 20, 145);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('LEGAL GROUNDS:', 20, 165);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Under Section(s): ____________________________', 20, 175);
    pdf.text('Of Act: ___________________________________', 20, 185);
    pdf.text('Constitutional Grounds: _______________________', 20, 195);
    pdf.text('_____________________________________________', 20, 203);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('RELIEF SOUGHT:', 20, 220);
    pdf.setFont('helvetica', 'normal');
    pdf.text('1. ___________________________________________', 20, 230);
    pdf.text('2. ___________________________________________', 20, 240);
    pdf.text('3. ___________________________________________', 20, 250);
    
    pdf.addPage();
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('DOCUMENTS ATTACHED:', 20, 20);
    pdf.setFont('helvetica', 'normal');
    pdf.text('1. ___________________________________________', 20, 30);
    pdf.text('2. ___________________________________________', 20, 40);
    pdf.text('3. ___________________________________________', 20, 50);
    pdf.text('4. ___________________________________________', 20, 60);
    pdf.text('5. ___________________________________________', 20, 70);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('VERIFICATION:', 20, 100);
    pdf.setFont('helvetica', 'normal');
    pdf.text('I, the above-named complainant/petitioner, do hereby', 20, 110);
    pdf.text('verify that the contents of this complaint are true', 20, 120);
    pdf.text('and correct to the best of my knowledge and belief.', 20, 130);
    pdf.text('No part of it is false and nothing material has been', 20, 140);
    pdf.text('concealed.', 20, 150);
    
    pdf.text('Place: ____________________', 20, 180);
    pdf.text('Date: _____________________', 20, 190);
    
    pdf.text('_________________________', 20, 220);
    pdf.text('Signature of Complainant', 20, 230);
    
    pdf.text('_________________________', 120, 220);
    pdf.text('Signature of Advocate', 120, 230);
    pdf.text('(if represented)', 120, 240);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Instructions: Fill in all the blanks with relevant information.', 20, 270);
    pdf.text('Attach all supporting documents. Consult a lawyer for legal advice.', 20, 280);
    
    pdf.save('Draft_Complaint_Template.pdf');
    alert('Draft Complaint Template downloaded successfully!');
  };

  // Format time for messages
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    if (!status) return '#6c757d';
    if (status === 'Pending Approval') return '#ffc107';
    if (status === 'Approved - Schedule Now') return '#0056b3';
    if (status === 'Completed') return '#28a745';
    if (status.includes('Scheduled for')) return '#17a2b8';
    return '#6c757d';
  };

  // Check if join call button should be enabled (10 minutes before meeting)
  const canJoinCall = (consultation) => {
    if (!consultation.scheduledDate || !consultation.scheduledTime) return false;
    
    const scheduledDateTime = new Date(`${consultation.scheduledDate}T${consultation.scheduledTime}`);
    const now = new Date();
    const timeDiff = scheduledDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    return minutesDiff <= 10 && minutesDiff >= -30;
  };

  // Handle schedule meeting with specific lawyer
  const handleScheduleMeetingWithLawyer = (lawyer, date, time) => {
    scheduleMeeting(lawyer.consultationId, date, time);

    setSelectedLawyerForScheduling(null);
    setShowCalendar(false);
    setActiveTab('consultations');

    alert(`Meeting scheduled successfully with ${lawyer.name} on ${formatDate(date)} at ${time}!`);
  };

  // Handle schedule meeting action (from consultation card)
  const handleScheduleMeeting = (consultation) => {
    // Find the lawyer in approved lawyers list
    const lawyer = approvedLawyers.find(l => l.consultationId === consultation.id);
    if (lawyer) {
      setSelectedLawyerForScheduling(lawyer);
      setShowCalendar(true);
      setActiveTab('schedule-meeting');
    } else {
      alert('This lawyer is not available for scheduling at the moment.');
    }
  };

  // Select lawyer for scheduling (from Schedule a Meeting page)
  const handleSelectLawyerForScheduling = (lawyer) => {
    setSelectedLawyerForScheduling(lawyer);
    setShowCalendar(true);
  };

  // Render Schedule Meeting Tab
  const renderScheduleMeeting = () => {
    if (showCalendar && selectedLawyerForScheduling) {
      return renderLawyerCalendar(selectedLawyerForScheduling);
    }

    const availableLawyers = approvedLawyers.filter(lawyer => 
      lawyer.status === 'Approved - Schedule Now'
    );

    return (
      <div className={styles.scheduleMeetingPage}>
        <div className={styles.pageHeader}>
          <h3><TranslatableText text="Schedule a Meeting" /></h3>
          <p className={styles.pageDescription}>
            <TranslatableText text="Select a lawyer who has approved your consultation request to schedule a video meeting" />
          </p>
        </div>
        
        {availableLawyers.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-calendar-times"></i>
            <h4><TranslatableText text="No Lawyers Available for Scheduling" /></h4>
            <p><TranslatableText text="You can only schedule meetings with lawyers who have approved your consultation requests." /></p>
            <button 
              className={styles.backToConsultationsBtn}
              onClick={() => setActiveTab('consultations')}
            >
              <i className="fas fa-arrow-left"></i>
              <TranslatableText text="Back to My Consultations" />
            </button>
          </div>
        ) : (
          <div className={styles.approvedLawyersGrid}>
            <div className={styles.sectionHeader}>
              <h4><TranslatableText text="Lawyers Available for Scheduling" /></h4>
              <span className={styles.lawyerCount}>
                {availableLawyers.length} lawyer{availableLawyers.length !== 1 ? 's' : ''} available
              </span>
            </div>
            
            {availableLawyers.map(lawyer => (
              <div key={lawyer.id} className={styles.approvedLawyerCard}>
                <div className={styles.lawyerCardHeader}>
                  <img 
                    src={lawyer.photo} 
                    alt={lawyer.name}
                    className={styles.lawyerPhoto}
                  />
                  <div className={styles.lawyerInfo}>
                    <h4>{lawyer.name}</h4>
                    <p className={styles.specialization}>{lawyer.specialization}</p>
                    <div className={styles.approvalBadge}>
                      <i className="fas fa-check-circle"></i>
                      <span><TranslatableText text="Meeting Approved" /></span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.lawyerCardActions}>
                  <button 
                    className={styles.selectLawyerBtn}
                    onClick={() => handleSelectLawyerForScheduling(lawyer)}
                  >
                    <i className="fas fa-calendar-plus"></i>
                    <TranslatableText text="View Calendar & Schedule" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render Lawyer Calendar
  const renderLawyerCalendar = (lawyer) => {
    // Group available slots by date
    const slotsByDate = lawyer.availableSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {});

    return (
      <div className={styles.lawyerCalendarPage}>
        <div className={styles.calendarHeader}>
          <button 
            className={styles.backButton}
            onClick={() => {
              setShowCalendar(false);
              setSelectedLawyerForScheduling(null);
            }}
          >
            <i className="fas fa-arrow-left"></i>
            <TranslatableText text="Back to Lawyer Selection" />
          </button>
          
          <div className={styles.selectedLawyerInfo}>
            <img 
              src={lawyer.photo} 
              alt={lawyer.name}
              className={styles.lawyerAvatar}
            />
            <div>
              <h3><TranslatableText text="Schedule with" /> {lawyer.name}</h3>
              <p>{lawyer.specialization}</p>
            </div>
          </div>
        </div>

        <div className={styles.calendarContent}>
          <h4><TranslatableText text="Available Time Slots" /></h4>
          <p className={styles.calendarDescription}>
            <TranslatableText text="Select a date and time that works best for you" />
          </p>

          <div className={styles.datesGrid}>
            {Object.entries(slotsByDate).map(([date, slots]) => (
              <div key={date} className={styles.dateCard}>
                <div className={styles.dateHeader}>
                  <h5>{formatDate(date)}</h5>
                  <span className={styles.dayOfWeek}>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </span>
                </div>
                
                <div className={styles.timeSlots}>
                  {slots.map(slot => (
                    <button
                      key={`${slot.date}-${slot.time}`}
                      className={`${styles.timeSlot} ${!slot.available ? styles.unavailable : ''}`}
                      disabled={!slot.available}
                      onClick={() => slot.available && handleScheduleMeetingWithLawyer(lawyer, slot.date, slot.time)}
                    >
                      <i className="fas fa-clock"></i>
                      {slot.time}
                      {!slot.available && <span className={styles.bookedLabel}>Booked</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Handle join video call
  const handleJoinCall = (consultation) => {
    setActiveVideoConsultation(consultation);
    setShowVideoCall(true);
  };

  // Handle end video call
  const handleEndCall = () => {
    setShowVideoCall(false);
    setActiveVideoConsultation(null);
    
    // Update consultation status to completed
    if (activeVideoConsultation) {
      setConsultations(prev => 
        prev.map(c => 
          c.id === activeVideoConsultation.id 
            ? { 
                ...c, 
                status: 'Completed',
                lastMessage: 'Video consultation completed successfully.'
              }
            : c
        )
      );
    }
  };

  // Get the appropriate button for consultation status
  const getConsultationButton = (consultation) => {
    switch (consultation.status) {
      case 'Pending Approval':
        return (
          <button className={`${styles.viewChatButton} ${styles.disabled}`} disabled>
            <i className="fas fa-clock"></i>
            <TranslatableText text="Awaiting Approval" />
          </button>
        );
      case 'Approved - Schedule Now':
        return (
          <button 
            className={styles.scheduleButton}
            onClick={() => handleScheduleMeeting(consultation)}
          >
            <i className="fas fa-calendar-plus"></i>
            <TranslatableText text="Schedule Meeting" />
          </button>
        );
      case 'Completed':
        return (
          <button className={styles.viewChatButton}>
            <i className="fas fa-comment"></i>
            <TranslatableText text="View Conversation" />
          </button>
        );
      default:
        if (consultation.status.includes('Scheduled for')) {
          const canJoin = canJoinCall(consultation);
          return (
            <button 
              className={`${styles.joinCallButton} ${!canJoin ? styles.disabled : ''}`}
              onClick={() => canJoin && handleJoinCall(consultation)}
              disabled={!canJoin}
              title={!canJoin ? 'Call will be available 10 minutes before scheduled time' : 'Join video call'}
            >
              <i className="fas fa-video"></i>
              <TranslatableText text="Join Call" />
            </button>
          );
        }
        return (
          <button className={styles.viewChatButton}>
            <i className="fas fa-comment"></i>
            <TranslatableText text="View Conversation" />
          </button>
        );
    }
  };

  // Render Consultations Tab
  const renderConsultations = () => {
    if (selectedConsultation) {
      return (
        <div className={styles.chatInterface}>
          <div className={styles.chatHeader}>
            <button 
              className={styles.backButton}
              onClick={() => setSelectedConsultationId(null)}
            >
              <i className="fas fa-arrow-left"></i>
              <TranslatableText text="Back to Consultations" />
            </button>
            <div className={styles.lawyerInfo}>
              <img 
                src={selectedConsultation.lawyerPhoto} 
                alt={selectedConsultation.lawyerName}
                className={styles.lawyerAvatar}
              />
              <div>
                <h3>{selectedConsultation.lawyerName}</h3>
                <p>{selectedConsultation.specialization}</p>
              </div>
            </div>
          </div>

          <div className={styles.messagesContainer}>
            {selectedConsultation.messages.length === 0 ? (
              <div className={styles.emptyConversation}>
                <i className="fas fa-comments"></i>
                <h4><TranslatableText text="Start Your Conversation" /></h4>
                <p><TranslatableText text="Send your first message to begin chatting with this lawyer. Once the conversation starts, you'll be able to request a video meeting." /></p>
              </div>
            ) : (
              selectedConsultation.messages.map(message => (
                <div 
                  key={message.id} 
                  className={`${styles.message} ${styles[message.sender]}`}
                >
                  <div className={styles.messageHeader}>
                    <strong>{message.senderName}</strong>
                    <span className={styles.messageTime}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className={styles.messageText}>{message.text}</p>
                </div>
              ))
            )}
          </div>

          <div className={styles.messageInput}>
            {/* Meeting Request Button */}
            {getMeetingRequestButton(selectedConsultation) && (
              <div className={styles.meetingRequestSection}>
                {getMeetingRequestButton(selectedConsultation)}
              </div>
            )}
            
            <div className={styles.textInputSection}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className={styles.messageTextarea}
                rows="3"
              />
              <button 
                onClick={handleSendMessage}
                className={styles.sendButton}
                disabled={!newMessage.trim()}
              >
                <i className="fas fa-paper-plane"></i>
                <TranslatableText text="Send" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.consultationsList}>
        <h3><TranslatableText text="My Consultations" /></h3>
        <p className={styles.sectionDescription}>
          <TranslatableText text="View and continue your conversations with legal experts" />
        </p>
        
        {consultations.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-comments"></i>
            <h4><TranslatableText text="No Consultations Yet" /></h4>
            <p><TranslatableText text="Start a conversation with a lawyer to see your consultations here" /></p>
          </div>
        ) : (
          <div className={styles.consultationsGrid}>
            {consultations.map(consultation => (
              <div 
                key={consultation.id} 
                className={styles.consultationCard}
                onClick={() => setSelectedConsultationId(consultation.id)}
              >
                <div className={styles.cardHeader}>
                  <img 
                    src={consultation.lawyerPhoto} 
                    alt={consultation.lawyerName}
                    className={styles.lawyerPhoto}
                  />
                  <div className={styles.lawyerDetails}>
                    <h4>{consultation.lawyerName}</h4>
                    <p className={styles.specialization}>{consultation.specialization}</p>
                    <p className={styles.initiatedDate}>
                      Started: {formatDate(consultation.initiatedDate)}
                    </p>
                    {!consultation.hasActiveConversation && (
                      <p className={styles.conversationStatus}>
                        <i className="fas fa-info-circle"></i>
                        Send a message to start conversation
                      </p>
                    )}
                  </div>
                  <div 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(consultation.status) }}
                  >
                    {consultation.status}
                  </div>
                </div>
                
                <div className={styles.lastMessage}>
                  <p>{consultation.lastMessage}</p>
                  <span className={styles.lastMessageDate}>
                    {formatDate(consultation.lastMessageDate)}
                  </span>
                </div>
                
                <div className={styles.cardFooter}>
                  {getConsultationButton(consultation)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Get status badge color for request history
  const getRequestHistoryStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ffc107'; // Yellow
      case 'Approved': return '#28a745'; // Green
      case 'Rejected': return '#dc3545'; // Red
      case 'Cancelled': return '#6c757d'; // Grey
      default: return '#6c757d'; // Gray
    }
  };

  // Handle cancel request
  const handleCancelRequest = (requestId) => {
    const request = requestHistory.find(r => r.id === requestId);
    if (!request) return;

    // Show confirmation dialog
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your consultation request to ${request.lawyerName}?\n\nThis action cannot be undone and the lawyer will no longer see your request.`
    );

    if (confirmCancel) {
      // Update the request status to 'Cancelled'
      setRequestHistory(prev => 
        prev.map(r => 
          r.id === requestId 
            ? { ...r, status: 'Cancelled' }
            : r
        )
      );

      // Show success message
      alert(`Your consultation request to ${request.lawyerName} has been cancelled successfully.`);
      
      // In a real application, you would also:
      // 1. Remove the request from the lawyer's dashboard
      // 2. Send a notification to the backend
      // 3. Update the database
    }
  };

  // Render Request History Tab
  const renderRequestHistory = () => {
    return (
      <div className={styles.requestHistoryList}>
        <h3><TranslatableText text="Request History" /></h3>
        <p className={styles.sectionDescription}>
          <TranslatableText text="Complete history of all consultation requests you have sent to lawyers" />
        </p>
        
        {requestHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-history"></i>
            <h4><TranslatableText text="No Request History" /></h4>
            <p><TranslatableText text="You haven't sent any consultation requests yet" /></p>
          </div>
        ) : (
          <div className={styles.requestHistoryTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}><strong><TranslatableText text="Lawyer" /></strong></div>
                <div className={styles.tableCell}><strong><TranslatableText text="Specialization" /></strong></div>
                <div className={styles.tableCell}><strong><TranslatableText text="Date Sent" /></strong></div>
                <div className={styles.tableCell}><strong><TranslatableText text="Legal Issue" /></strong></div>
                <div className={styles.tableCell}><strong><TranslatableText text="Status" /></strong></div>
                <div className={styles.tableCell}><strong><TranslatableText text="Action" /></strong></div>
              </div>
            </div>
            
            <div className={styles.tableBody}>
              {requestHistory
                .sort((a, b) => new Date(b.dateSent) - new Date(a.dateSent)) // Sort by newest first
                .map(request => (
                <div key={request.id} className={styles.requestHistoryRow}>
                  <div className={styles.tableCell}>
                    <div className={styles.lawyerInfoCell}>
                      <img 
                        src={request.lawyerPhoto} 
                        alt={request.lawyerName}
                        className={styles.lawyerPhotoSmall}
                      />
                      <span className={styles.lawyerNameCell}>{request.lawyerName}</span>
                    </div>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.specializationCell}>{request.specialization}</span>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.dateSentCell}>{formatDate(request.dateSent)}</span>
                  </div>
                  <div className={styles.tableCell}>
                    <span className={styles.legalIssueCell}>{request.legalIssue}</span>
                  </div>
                  <div className={styles.tableCell}>
                    <span 
                      className={styles.requestHistoryStatusBadge}
                      style={{ backgroundColor: getRequestHistoryStatusColor(request.status) }}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    {request.status === 'Pending' ? (
                      <button 
                        className={styles.cancelRequestButton}
                        onClick={() => handleCancelRequest(request.id)}
                        title="Cancel this consultation request"
                      >
                        <i className="fas fa-times"></i>
                        <TranslatableText text="Cancel Request" />
                      </button>
                    ) : (
                      <span className={styles.noActionText}>—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Documents Tab
  const renderDocuments = () => {
    return (
      <div className={styles.documentsList}>
        <h3><TranslatableText text="My Documents" /></h3>
        <p className={styles.sectionDescription}>
          <TranslatableText text="Access all your downloaded legal document templates" />
        </p>
        
        {documents.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-file-alt"></i>
            <h4><TranslatableText text="No Documents Downloaded" /></h4>
            <p><TranslatableText text="Download legal templates to see them here" /></p>
          </div>
        ) : (
          <div className={styles.documentsGrid}>
            {documents.map(document => (
              <div key={document.id} className={styles.documentCard}>
                <div className={styles.documentIcon}>
                  <i className="fas fa-file-pdf"></i>
                </div>
                
                <div className={styles.documentInfo}>
                  <h4>{document.name}</h4>
                  <p className={styles.documentCategory}>{document.category}</p>
                  <p className={styles.documentDescription}>{document.description}</p>
                  <p className={styles.downloadDate}>
                    Downloaded: {formatDate(document.downloadDate)}
                  </p>
                </div>
                
                <div className={styles.documentActions}>
                  <button 
                    className={styles.downloadAgainButton}
                    onClick={() => handleDownloadDocument(document)}
                  >
                    <i className="fas fa-download"></i>
                    <TranslatableText text="Download Again" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.userDashboard}>
      {/* Video Call Interface */}
      {showVideoCall && activeVideoConsultation && (
        <VideoCallInterface
          consultation={activeVideoConsultation}
          onEndCall={handleEndCall}
          userRole="user"
        />
      )}
      
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2><TranslatableText text="My Dashboard" /></h2>
          <p>Welcome, {user?.name}</p>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'consultations' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('consultations');
              setSelectedConsultationId(null);
              setShowCalendar(false);
              setSelectedLawyerForScheduling(null);
            }}
          >
            <i className="fas fa-comments"></i>
            <TranslatableText text="My Consultations" />
            {consultations.filter(c => c.status === 'Active' || c.status === 'Awaiting Reply' || c.status === 'Approved - Schedule Now').length > 0 && (
              <span className={styles.notificationBadge}>
                {consultations.filter(c => c.status === 'Active' || c.status === 'Awaiting Reply' || c.status === 'Approved - Schedule Now').length}
              </span>
            )}
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'schedule-meeting' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('schedule-meeting');
              setSelectedConsultationId(null);
              setShowCalendar(false);
              setSelectedLawyerForScheduling(null);
            }}
          >
            <i className="fas fa-calendar-plus"></i>
            <TranslatableText text="Schedule a Meeting" />
            {approvedLawyers.filter(l => l.status === 'Approved - Schedule Now').length > 0 && (
              <span className={styles.approvalCountBadge}>
                {approvedLawyers.filter(l => l.status === 'Approved - Schedule Now').length}
              </span>
            )}
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'request-history' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('request-history');
              setSelectedConsultationId(null);
              setShowCalendar(false);
              setSelectedLawyerForScheduling(null);
            }}
          >
            <i className="fas fa-history"></i>
            <TranslatableText text="Request History" />
            <span className={styles.countBadge}>
              {requestHistory.length}
            </span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'documents' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('documents');
              setShowCalendar(false);
              setSelectedLawyerForScheduling(null);
            }}
          >
            <i className="fas fa-file-alt"></i>
            <TranslatableText text="My Documents" />
            <span className={styles.countBadge}>
              {documents.length}
            </span>
          </button>
          
          <button 
            className={styles.navItem}
            onClick={handleLogout}
            style={{ marginTop: 'auto', borderTop: '1px solid #e9ecef', color: '#dc3545' }}
          >
            <i className="fas fa-sign-out-alt"></i>
            <TranslatableText text="Logout" />
          </button>
        </nav>
      </div>
      
      <div className={styles.mainContent}>
        {activeTab === 'consultations' && renderConsultations()}
        {activeTab === 'schedule-meeting' && renderScheduleMeeting()}
        {activeTab === 'request-history' && renderRequestHistory()}
        {activeTab === 'documents' && renderDocuments()}
      </div>
    </div>
  );
};

export default UserDashboard;
