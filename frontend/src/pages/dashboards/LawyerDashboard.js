import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TranslatableText from '../../components/TranslatableText';
import VideoCallInterface from '../../components/VideoCallInterface';
import ScheduledMeetingsCalendar from '../../components/ScheduledMeetingsCalendar';
import styles from './LawyerDashboard.module.css';

const LawyerDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [consultationRequests, setConsultationRequests] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeVideoConsultation, setActiveVideoConsultation] = useState(null);
  const [consultationTab, setConsultationTab] = useState('new-requests'); // 'new-requests', 'active-consultations' or 'scheduled-meetings'
  const [lawyerStats, setLawyerStats] = useState({
    totalRequests: 0,
    acceptedRequests: 0,
    rejectedRequests: 0,
    acceptanceRate: 100
  });
  const [lawyerProfile, setLawyerProfile] = useState({
    profilePhoto: null,
    clinicName: '',
    address: '',
    contactEmail: '',
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    openingTime: '09:00',
    closingTime: '17:00'
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeChatRequest, setActiveChatRequest] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState({});
  const [newChatMessage, setNewChatMessage] = useState('');
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [proposedTimeSlots, setProposedTimeSlots] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  // Redirect to home if not authenticated or not a lawyer
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'lawyer') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock data for consultation requests - replace with actual API calls
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setDate(nextMonth.getDate() + 15);

    const mockRequests = [
      {
        id: 'REQ001',
        userId: 'USER001',
        userName: 'Rajesh Kumar',
        userEmail: 'rajesh@email.com',
        subject: 'Property Dispute Legal Advice',
        description: 'I am facing a boundary dispute with my neighbor. They have constructed a wall that encroaches on my property. I need legal guidance on how to proceed.',
        requestDate: '2024-08-15',
        status: 'pending', // pending, active, scheduled, completed, rejected
        consultationType: 'free_30min',
        urgency: 'medium',
        scheduledDate: null,
        scheduledTime: null
      },
      {
        id: 'REQ002',
        userId: 'USER002',
        userName: 'Priya Sharma',
        userEmail: 'priya@email.com',
        subject: 'Employment Contract Review',
        description: 'I need help reviewing my employment contract. There are some clauses I don\'t understand and want to ensure my rights are protected.',
        requestDate: '2024-08-14',
        status: 'active',
        consultationType: 'free_30min',
        urgency: 'low',
        scheduledDate: null,
        scheduledTime: null,
        canSchedule: true // User can now schedule after lawyer approval
      },
      {
        id: 'REQ003',
        userId: 'USER003',
        userName: 'Amit Singh',
        userEmail: 'amit@email.com',
        subject: 'Consumer Rights Issue',
        description: 'I purchased a defective product and the company is refusing to provide a refund or replacement. What are my legal options?',
        requestDate: '2024-08-13',
        status: 'scheduled',
        consultationType: 'free_30min',
        urgency: 'high',
        scheduledDate: today.toISOString().split('T')[0],
        scheduledTime: '11:00'
      },
      {
        id: 'REQ004',
        userId: 'USER004',
        userName: 'Meena Gupta',
        userEmail: 'meena@email.com',
        subject: 'Divorce Proceedings',
        description: 'I need assistance with filing for divorce. My husband has been abusive and I want to ensure I get proper alimony and child custody.',
        requestDate: '2024-08-16',
        status: 'pending',
        consultationType: 'free_30min',
        urgency: 'high',
        scheduledDate: null,
        scheduledTime: null
      },
      {
        id: 'REQ005',
        userId: 'USER005',
        userName: 'Suresh Patel',
        userEmail: 'suresh@email.com',
        subject: 'Business Partnership Dispute',
        description: 'My business partner is not fulfilling his obligations as per our partnership agreement. I need legal advice on how to proceed.',
        requestDate: '2024-08-12',
        status: 'scheduled',
        consultationType: 'free_30min',
        urgency: 'medium',
        scheduledDate: dayAfter.toISOString().split('T')[0],
        scheduledTime: '16:00'
      },
      {
        id: 'REQ006',
        userId: 'USER006',
        userName: 'Kavya Reddy',
        userEmail: 'kavya@email.com',
        subject: 'Property Registration Issues',
        description: 'I am facing issues with property registration. The documents are being rejected and I need legal guidance.',
        requestDate: '2024-08-10',
        status: 'scheduled',
        consultationType: 'free_30min',
        urgency: 'medium',
        scheduledDate: nextWeek.toISOString().split('T')[0],
        scheduledTime: '10:00'
      },
      {
        id: 'REQ007',
        userId: 'USER007',
        userName: 'Arjun Nair',
        userEmail: 'arjun@email.com',
        subject: 'Employment Termination',
        description: 'I was wrongfully terminated from my job. I need to understand my rights and possible legal recourse.',
        requestDate: '2024-08-11',
        status: 'scheduled',
        consultationType: 'free_30min',
        urgency: 'high',
        scheduledDate: nextMonth.toISOString().split('T')[0],
        scheduledTime: '15:00'
      },
      {
        id: 'REQ008',
        userId: 'USER008',
        userName: 'Deepika Shah',
        userEmail: 'deepika@email.com',
        subject: 'Tenant Rights',
        description: 'My landlord is trying to evict me without proper notice. I need legal advice on tenant rights.',
        requestDate: '2024-08-09',
        status: 'scheduled',
        consultationType: 'free_30min',
        urgency: 'medium',
        scheduledDate: today.toISOString().split('T')[0],
        scheduledTime: '09:00'
      }
    ];
    
    setConsultationRequests(mockRequests);
    
    // Calculate lawyer stats
    const total = mockRequests.length;
    const accepted = mockRequests.filter(req => 
      req.status === 'active' || req.status === 'scheduled' || req.status === 'completed'
    ).length;
    const rejected = mockRequests.filter(req => req.status === 'rejected').length;
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 100;
    
    setLawyerStats({
      totalRequests: total,
      acceptedRequests: accepted,
      rejectedRequests: rejected,
      acceptanceRate
    });

    // Mock messages for accepted consultations
    setMessages([
      {
        id: 1,
        consultationId: 'REQ002',
        senderId: 'USER002',
        senderName: 'Priya Sharma',
        message: 'Thank you for accepting my consultation request. I have scheduled our meeting for tomorrow at 2 PM.',
        timestamp: '2024-08-14 10:30 AM',
        type: 'user'
      },
      {
        id: 2,
        consultationId: 'REQ002',
        senderId: user?.id,
        senderName: user?.name,
        message: 'Perfect! I look forward to our video consultation tomorrow. Please have your employment contract ready for review.',
        timestamp: '2024-08-14 11:15 AM',
        type: 'lawyer'
      }
    ]);
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#0056b3';
      case 'scheduled': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  // Check if lawyer can reject a request (80% rule)
  const canRejectRequest = () => {
    if (lawyerStats.totalRequests === 0) return true;
    
    // Calculate what acceptance rate would be if we reject one more
    const newRejected = lawyerStats.rejectedRequests + 1;
    const newAcceptanceRate = ((lawyerStats.totalRequests - newRejected) / lawyerStats.totalRequests) * 100;
    
    return newAcceptanceRate >= 80;
  };

  const handleAcceptAndOpenChat = (consultationId) => {
    // Step 1: Update the request status to 'active'
    setConsultationRequests(prev => 
      prev.map(req => 
        req.id === consultationId 
          ? { ...req, status: 'active' }
          : req
      )
    );

    // Update stats
    setLawyerStats(prev => ({
      ...prev,
      acceptedRequests: prev.acceptedRequests + 1,
      acceptanceRate: Math.round(((prev.acceptedRequests + 1) / prev.totalRequests) * 100)
    }));

    // Step 2: Open chat for this consultation
    const acceptedRequest = consultationRequests.find(req => req.id === consultationId);
    if (acceptedRequest) {
      handleOpenChat({...acceptedRequest, status: 'active'});
      
      // Show success message to lawyer
      alert(`✅ Request Accepted & Chat Opened!\n\nYou can now communicate with ${acceptedRequest.userName} and propose meeting times.`);
    }
  };

  // Function to send notification to user
  const sendNotificationToUser = (request) => {
    console.log('📧 Sending notification to user:', {
      userId: request.userId,
      userName: request.userName,
      userEmail: request.userEmail,
      message: `Great news! Lawyer ${user?.name} has accepted your consultation request for "${request.subject}". Please check your email for the scheduling link.`
    });
    
    // In real implementation, this would call your backend API to:
    // 1. Send email notification to user
    // 2. Send push notification (if app is installed)
    // 3. Create in-app notification
    
    // For demonstration, simulate user booking after a delay
    simulateUserBooking(request.id);
  };

  // Function to generate private calendar link for user
  const generateCalendarLink = (request) => {
    // Generate a unique token for this scheduling session
    const schedulingToken = `schedule_${request.id}_${Date.now()}`;
    const calendarLink = `${window.location.origin}/schedule-appointment/${schedulingToken}`;
    
    console.log('🔗 Generated private calendar link:', {
      requestId: request.id,
      userName: request.userName,
      userEmail: request.userEmail,
      calendarLink: calendarLink,
      expiresIn: '7 days'
    });
    
    // In real implementation, this would:
    // 1. Store the scheduling token in database with expiry
    // 2. Send the link via email to the user
    // 3. Create a temporary calendar access for this user
    
    return schedulingToken;
  };

  // Function to handle when user schedules a meeting (called from calendar booking)
  const handleMeetingScheduled = (requestId, selectedDate, selectedTime, userDetails) => {
    console.log('📅 Meeting scheduled by user:', {
      requestId,
      selectedDate,
      selectedTime,
      userDetails
    });

    // Update the consultation request to 'scheduled' status
    setConsultationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: 'scheduled',
              scheduledDate: selectedDate,
              scheduledTime: selectedTime
            }
          : req
      )
    );

    // Add notification for the lawyer
    const newNotification = {
      id: Date.now(),
      type: 'meeting_scheduled',
      title: 'New Meeting Scheduled!',
      message: `${userDetails.userName} has scheduled a meeting for ${selectedDate} at ${selectedTime}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      requestId: requestId
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show notification banner briefly
    setShowNotifications(true);
    setTimeout(() => setShowNotifications(false), 5000);

    // In real implementation, this would:
    // 1. Save the scheduled meeting to database
    // 2. Send confirmation emails to both lawyer and user
    // 3. Add to both calendars
    // 4. Set up reminder notifications
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  // Lawyer-initiated scheduling functions
  const handleProposeTime = () => {
    setShowSchedulingModal(true);
    setSelectedTimeSlots([]);
  };

  const handleTimeSlotSelect = (date, time) => {
    const timeSlot = { date, time };
    const timeSlotKey = `${date}_${time}`;
    
    setSelectedTimeSlots(prev => {
      const exists = prev.find(slot => `${slot.date}_${slot.time}` === timeSlotKey);
      if (exists) {
        return prev.filter(slot => `${slot.date}_${slot.time}` !== timeSlotKey);
      } else {
        return [...prev, timeSlot];
      }
    });
  };

  const handleSendTimeProposal = () => {
    if (!activeChatRequest || selectedTimeSlots.length === 0) return;

    const proposalMessage = {
      id: Date.now(),
      senderId: user?.id,
      senderName: user?.name,
      message: `I'd like to propose the following meeting times for our consultation:`,
      timestamp: new Date().toISOString(),
      type: 'lawyer',
      isTimeProposal: true,
      proposedTimes: selectedTimeSlots
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatRequest.id]: [...(prev[activeChatRequest.id] || []), proposalMessage]
    }));

    setShowSchedulingModal(false);
    setSelectedTimeSlots([]);
    
    console.log('📅 Time proposal sent:', {
      requestId: activeChatRequest.id,
      proposedTimes: selectedTimeSlots,
      recipient: activeChatRequest.userEmail
    });

    alert(`✅ Meeting times proposed!\n\n${activeChatRequest.userName} will be notified of your available time slots.`);
  };

  const handleAcceptProposedTime = (timeSlot) => {
    if (!activeChatRequest) return;

    // Update consultation to scheduled status
    setConsultationRequests(prev => 
      prev.map(req => 
        req.id === activeChatRequest.id 
          ? { 
              ...req, 
              status: 'scheduled',
              scheduledDate: timeSlot.date,
              scheduledTime: timeSlot.time
            }
          : req
      )
    );

    // Add confirmation message to chat
    const confirmationMessage = {
      id: Date.now(),
      senderId: user?.id,
      senderName: user?.name,
      message: `✅ Meeting confirmed for ${timeSlot.date} at ${timeSlot.time}. See you then!`,
      timestamp: new Date().toISOString(),
      type: 'lawyer',
      isConfirmation: true
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatRequest.id]: [...(prev[activeChatRequest.id] || []), confirmationMessage]
    }));

    // Close chat modal
    setShowChatModal(false);
    setActiveChatRequest(null);

    alert(`✅ Meeting Scheduled!\n\nDate: ${timeSlot.date}\nTime: ${timeSlot.time}\n\nBoth you and ${activeChatRequest.userName} will receive confirmation.`);
  };

  // Chat functionality
  const handleOpenChat = (request) => {
    setActiveChatRequest(request);
    setShowChatModal(true);
    
    // Initialize chat messages if they don't exist
    if (!chatMessages[request.id]) {
      setChatMessages(prev => ({
        ...prev,
        [request.id]: [
          {
            id: 1,
            senderId: request.userId,
            senderName: request.userName,
            message: `Original request: ${request.description}`,
            timestamp: request.requestDate,
            type: 'user',
            isOriginalRequest: true
          }
        ]
      }));
    }
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim() || !activeChatRequest) return;

    const message = {
      id: Date.now(),
      senderId: user?.id,
      senderName: user?.name,
      message: newChatMessage,
      timestamp: new Date().toISOString(),
      type: 'lawyer'
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatRequest.id]: [...(prev[activeChatRequest.id] || []), message]
    }));

    setNewChatMessage('');
    
    // In real app, send message to backend and notify user
    console.log('💬 Message sent to user:', {
      requestId: activeChatRequest.id,
      message: newChatMessage,
      recipient: activeChatRequest.userEmail
    });
  };

  const handleRejectFromChat = () => {
    if (!activeChatRequest) return;

    if (!canRejectRequest()) {
      alert('Cannot reject this request. Your acceptance rate would drop below 80%.');
      return;
    }

    // Update request status to rejected
    setConsultationRequests(prev => 
      prev.map(req => 
        req.id === activeChatRequest.id 
          ? { ...req, status: 'rejected' }
          : req
      )
    );

    // Update stats
    setLawyerStats(prev => ({
      ...prev,
      rejectedRequests: prev.rejectedRequests + 1,
      acceptanceRate: Math.round(((prev.totalRequests - (prev.rejectedRequests + 1)) / prev.totalRequests) * 100)
    }));

    // Close chat modal
    setShowChatModal(false);
    setActiveChatRequest(null);

    alert(`❌ Request Rejected.\n\n${activeChatRequest?.userName} has been notified.`);
    
    console.log('❌ Request rejected:', activeChatRequest);
  };

  // Simulate a user booking a meeting (for testing purposes)
  const simulateUserBooking = (requestId) => {
    // Simulate a user scheduling after accepting
    setTimeout(() => {
      const request = consultationRequests.find(req => req.id === requestId);
      if (request && request.status === 'accepted') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        handleMeetingScheduled(
          requestId,
          tomorrow.toISOString().split('T')[0],
          '15:00',
          {
            userName: request.userName,
            userEmail: request.userEmail
          }
        );
      }
    }, 3000); // Simulate 3 seconds delay
  };

  const handleRejectConsultation = (consultationId) => {
    if (!canRejectRequest()) {
      alert('Cannot reject this request. Your acceptance rate would drop below 80%.');
      return;
    }

    setConsultationRequests(prev => 
      prev.map(req => 
        req.id === consultationId 
          ? { ...req, status: 'rejected' }
          : req
      )
    );

    // Update stats
    setLawyerStats(prev => ({
      ...prev,
      rejectedRequests: prev.rejectedRequests + 1,
      acceptanceRate: Math.round(((prev.totalRequests - (prev.rejectedRequests + 1)) / prev.totalRequests) * 100)
    }));
  };

  // Check if join call button should be enabled (10 minutes before meeting)
  const canJoinCall = (consultation) => {
    if (!consultation.scheduledDate || !consultation.scheduledTime) return false;
    
    const scheduledDateTime = new Date(`${consultation.scheduledDate}T${consultation.scheduledTime}`);
    const now = new Date();
    const timeDiff = scheduledDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Can join 10 minutes before the scheduled time
    return minutesDiff <= 10 && minutesDiff >= -30; // Allow joining up to 30 minutes after start time
  };

  // Handle join video call
  const handleJoinCall = (consultation) => {
    setActiveVideoConsultation(consultation);
    setShowVideoCall(true);
  };

  // Handle end video call
  const handleEndCall = () => {
    setShowVideoCall(false);
    
    // Update consultation status to completed
    if (activeVideoConsultation) {
      setConsultationRequests(prev => 
        prev.map(req => 
          req.id === activeVideoConsultation.id 
            ? { ...req, status: 'completed' }
            : req
        )
      );
    }
    
    setActiveVideoConsultation(null);
  };

  const handleCompleteConsultation = (consultationId) => {
    setConsultationRequests(prev => 
      prev.map(req => 
        req.id === consultationId 
          ? { ...req, status: 'completed' }
          : req
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConsultation) return;

    const message = {
      id: Date.now(),
      consultationId: selectedConsultation.id,
      senderId: user?.id,
      senderName: user?.name,
      message: newMessage,
      timestamp: new Date().toLocaleString(),
      type: 'lawyer'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleProfileSave = () => {
    // Save profile logic here - API call
    alert('Profile updated successfully!');
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLawyerProfile(prev => ({
          ...prev,
          profilePhoto: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderOverview = () => (
    <div className={styles.overviewContent}>
      <div className={styles.welcomeSection}>
        <h2>Welcome back, {user?.name}!</h2>
        <p>Manage your consultation requests and help users with their legal needs.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-clock" style={{color: '#ffc107'}}></i>
          </div>
          <div className={styles.statInfo}>
            <h3>{consultationRequests.filter(req => req.status === 'pending').length}</h3>
            <p><TranslatableText text="Pending Requests" /></p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-handshake" style={{color: '#0056b3'}}></i>
          </div>
          <div className={styles.statInfo}>
            <h3>{consultationRequests.filter(req => req.status === 'active').length}</h3>
            <p><TranslatableText text="Active Consultations" /></p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-check-circle" style={{color: '#28a745'}}></i>
          </div>
          <div className={styles.statInfo}>
            <h3>{consultationRequests.filter(req => req.status === 'completed').length}</h3>
            <p><TranslatableText text="Completed Today" /></p>
          </div>
        </div>
      </div>

      <div className={styles.recentRequests}>
        <h3><TranslatableText text="Recent Consultation Requests" /></h3>
        <div className={styles.requestsList}>
          {consultationRequests.slice(0, 3).map(request => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <div className={styles.requestInfo}>
                  <h4>{request.subject}</h4>
                  <p><strong>Client:</strong> {request.userName}</p>
                </div>
                <div className={styles.requestBadges}>
                  <span 
                    className={styles.statusBadge}
                    style={{backgroundColor: getStatusColor(request.status)}}
                  >
                    {request.status.replace('_', ' ')}
                  </span>
                  <span 
                    className={styles.urgencyBadge}
                    style={{color: getUrgencyColor(request.urgency)}}
                  >
                    {request.urgency} priority
                  </span>
                </div>
              </div>
              <p className={styles.requestDescription}>{request.description}</p>
              <div className={styles.requestActions}>
                <span className={styles.requestDate}>{request.requestDate}</span>
                <button 
                  className={styles.viewButton}
                  onClick={() => {
                    setSelectedConsultation(request);
                    setActiveTab('consultations');
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConsultations = () => (
    <div className={styles.consultationsContent}>
      {/* Consultation Tabs */}
      <div className={styles.consultationTabs}>
        <button 
          className={`${styles.tabButton} ${consultationTab === 'new-requests' ? styles.activeTab : ''}`}
          onClick={() => setConsultationTab('new-requests')}
        >
          <i className="fas fa-inbox"></i>
          <TranslatableText text="New Requests" />
          <span className={styles.requestCount}>
            {consultationRequests.filter(req => req.status === 'pending').length}
          </span>
        </button>
        <button 
          className={`${styles.tabButton} ${consultationTab === 'active-consultations' ? styles.activeTab : ''}`}
          onClick={() => setConsultationTab('active-consultations')}
        >
          <i className="fas fa-comments"></i>
          <TranslatableText text="Active Consultations" />
          <span className={styles.requestCount}>
            {consultationRequests.filter(req => req.status === 'active').length}
          </span>
        </button>
        <button 
          className={`${styles.tabButton} ${consultationTab === 'scheduled-meetings' ? styles.activeTab : ''}`}
          onClick={() => setConsultationTab('scheduled-meetings')}
        >
          <i className="fas fa-calendar-check"></i>
          <TranslatableText text="Scheduled Meetings" />
          <span className={styles.requestCount}>
            {consultationRequests.filter(req => req.status === 'scheduled').length}
          </span>
        </button>
      </div>

      {/* Acceptance Rate Warning */}
      {lawyerStats.acceptanceRate < 85 && (
        <div className={styles.warningBanner}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>
            Warning: Your acceptance rate is {lawyerStats.acceptanceRate}%. 
            Please maintain at least 80% to continue receiving consultation requests.
          </span>
        </div>
      )}

      {/* Tab Content */}
      {consultationTab === 'new-requests' && renderNewRequests()}
      {consultationTab === 'active-consultations' && renderActiveConsultations()}
      {consultationTab === 'scheduled-meetings' && renderScheduledMeetings()}
    </div>
  );

  const renderNewRequests = () => {
    const pendingRequests = consultationRequests.filter(req => req.status === 'pending');
    
    if (pendingRequests.length === 0) {
      return (
        <div className={styles.emptyState}>
          <i className="fas fa-inbox"></i>
          <h3><TranslatableText text="No New Requests" /></h3>
          <p><TranslatableText text="You have no pending consultation requests at the moment." /></p>
        </div>
      );
    }

    return (
      <div className={styles.requestsList}>
        <div className={styles.requestsHeader}>
          <h3><TranslatableText text="New Consultation Requests" /></h3>
          <div className={styles.statsInfo}>
            <span>Acceptance Rate: <strong>{lawyerStats.acceptanceRate}%</strong></span>
            <span>Total Requests: <strong>{lawyerStats.totalRequests}</strong></span>
          </div>
        </div>
        
        <div className={styles.requestsGrid}>
          {pendingRequests.map(request => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <div className={styles.requestInfo}>
                  <h4>{request.subject}</h4>
                  <p><strong>Client:</strong> {request.userName}</p>
                  <p><strong>Legal Issue Type:</strong> {request.subject}</p>
                  <p><strong>Request Date:</strong> {request.requestDate}</p>
                </div>
                <div className={styles.requestBadges}>
                  <span 
                    className={styles.urgencyBadge}
                    style={{color: getUrgencyColor(request.urgency)}}
                  >
                    {request.urgency} priority
                  </span>
                </div>
              </div>
              
              <div className={styles.requestDescription}>
                <p>{request.description}</p>
              </div>
              
              <div className={styles.requestActions}>
                <button 
                  className={styles.acceptChatButton}
                  onClick={() => handleAcceptAndOpenChat(request.id)}
                >
                  <i className="fas fa-check-circle"></i>
                  <TranslatableText text="Accept & Open Chat" />
                </button>
                <button 
                  className={`${styles.rejectButton} ${!canRejectRequest() ? styles.disabled : ''}`}
                  onClick={() => handleRejectConsultation(request.id)}
                  disabled={!canRejectRequest()}
                  title={!canRejectRequest() ? 'Cannot reject - would drop acceptance rate below 80%' : ''}
                >
                  <i className="fas fa-times"></i>
                  <TranslatableText text="Reject" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActiveConsultations = () => {
    const activeRequests = consultationRequests.filter(req => req.status === 'active');
    
    if (activeRequests.length === 0) {
      return (
        <div className={styles.emptyState}>
          <i className="fas fa-comments"></i>
          <h3><TranslatableText text="No Active Consultations" /></h3>
          <p><TranslatableText text="Accepted requests will appear here for messaging and scheduling." /></p>
        </div>
      );
    }

    return (
      <div className={styles.requestsList}>
        <div className={styles.requestsHeader}>
          <h3><TranslatableText text="Active Consultations - Chat & Schedule Meetings" /></h3>
          <p className={styles.subHeader}>Communicate with clients and propose meeting times</p>
        </div>
        
        <div className={styles.requestsGrid}>
          {activeRequests.map(request => (
            <div key={request.id} className={styles.activeConsultationCard}>
              <div className={styles.requestHeader}>
                <div className={styles.requestInfo}>
                  <h4>{request.subject}</h4>
                  <p><strong>Client:</strong> {request.userName}</p>
                  <p><strong>Email:</strong> {request.userEmail}</p>
                  <p><strong>Active since:</strong> {request.requestDate}</p>
                </div>
                <div className={styles.requestBadges}>
                  <span className={styles.activeBadge}>
                    <i className="fas fa-comments"></i>
                    Active Chat
                  </span>
                </div>
              </div>
              
              <div className={styles.requestDescription}>
                <p>{request.description}</p>
              </div>
              
              <div className={styles.activeConsultationActions}>
                <button 
                  className={styles.openChatButton}
                  onClick={() => handleOpenChat(request)}
                >
                  <i className="fas fa-comments"></i>
                  <TranslatableText text="Open Chat" />
                </button>
                <div className={styles.chatIndicator}>
                  <i className="fas fa-circle" style={{color: '#28a745'}}></i>
                  <span>Ready for messaging</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScheduledMeetings = () => {
    return (
      <div className={styles.scheduledMeetingsWrapper}>
        <div className={styles.scheduledMeetingsHeader}>
          <h3><TranslatableText text="Scheduled Meetings Calendar" /></h3>
          <p><TranslatableText text="View your upcoming consultations and manage your availability" /></p>
        </div>
        
        <ScheduledMeetingsCalendar 
          consultationRequests={consultationRequests}
          onBlockTime={(date, timeSlots) => {
            console.log('🚫 Blocking time slots:', { date, timeSlots });
            
            // In real implementation, this would save blocked time to your backend
            // For now, we'll show a confirmation message
            alert(`✅ Time blocked successfully!\n\nDate: ${date}\nTime slots: ${timeSlots.join(', ')}\n\nThese slots are now unavailable for booking.`);
          }}
          onBlockDay={(date) => {
            console.log('🚫 Blocking entire day:', date);
            
            // In real implementation, this would save blocked day to your backend
            // For now, we'll show a confirmation message
            alert(`✅ Day blocked successfully!\n\nDate: ${date}\n\nThis entire day is now unavailable for booking.`);
          }}
          onMeetingClick={(meeting) => {
            // Handle when lawyer clicks on a scheduled meeting
            setSelectedConsultation(meeting);
            console.log('📋 Meeting details requested:', meeting);
          }}
        />
      </div>
    );
  };

  const renderProfile = () => (
    <div className={styles.profileContent}>
      <h3><TranslatableText text="My Profile" /></h3>
      
      <div className={styles.profileForm}>
        <div className={styles.photoSection}>
          <div className={styles.photoContainer}>
            {lawyerProfile.profilePhoto ? (
              <img 
                src={lawyerProfile.profilePhoto} 
                alt="Profile" 
                className={styles.profilePhoto}
              />
            ) : (
              <div className={styles.photoPlaceholder}>
                <i className="fas fa-user"></i>
                <span>No Photo</span>
              </div>
            )}
            <input
              type="file"
              id="photoUpload"
              accept="image/*"
              onChange={handlePhotoUpload}
              className={styles.photoInput}
            />
            <label htmlFor="photoUpload" className={styles.photoUploadButton}>
              <i className="fas fa-camera"></i> Upload Photo
            </label>
          </div>
        </div>

        <div className={styles.formSection}>
          <h4><TranslatableText text="Professional Information" /></h4>
          
          <div className={styles.fieldGroup}>
            <label>Full Name</label>
            <input type="text" defaultValue={user?.name} className={styles.inputField} />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Email Address</label>
            <input type="email" defaultValue={user?.email} className={styles.inputField} disabled />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Bar Council Registration Number</label>
            <input type="text" placeholder="Enter your Bar Council ID" className={styles.inputField} />
          </div>
        </div>

        <div className={styles.formSection}>
          <h4><TranslatableText text="Clinic Details" /></h4>
          
          <div className={styles.fieldGroup}>
            <label>Clinic Name</label>
            <input
              type="text"
              value={lawyerProfile.clinicName}
              onChange={(e) => setLawyerProfile(prev => ({...prev, clinicName: e.target.value}))}
              placeholder="Enter your clinic/office name"
              className={styles.inputField}
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Full Address</label>
            <textarea
              value={lawyerProfile.address}
              onChange={(e) => setLawyerProfile(prev => ({...prev, address: e.target.value}))}
              placeholder="Enter complete address with city, state, and pincode"
              className={styles.textareaField}
            ></textarea>
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Clinic Contact Email</label>
            <input
              type="email"
              value={lawyerProfile.contactEmail}
              onChange={(e) => setLawyerProfile(prev => ({...prev, contactEmail: e.target.value}))}
              placeholder="clinic@example.com"
              className={styles.inputField}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Working Days</label>
            <div className={styles.workingDays}>
              {Object.entries(lawyerProfile.workingDays).map(([day, isWorking]) => (
                <label key={day} className={styles.dayCheckbox}>
                  <input
                    type="checkbox"
                    checked={isWorking}
                    onChange={(e) => setLawyerProfile(prev => ({
                      ...prev,
                      workingDays: {
                        ...prev.workingDays,
                        [day]: e.target.checked
                      }
                    }))}
                  />
                  <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.timeSection}>
            <div className={styles.fieldGroup}>
              <label>Opening Time</label>
              <input
                type="time"
                value={lawyerProfile.openingTime}
                onChange={(e) => setLawyerProfile(prev => ({...prev, openingTime: e.target.value}))}
                className={styles.inputField}
              />
            </div>
            
            <div className={styles.fieldGroup}>
              <label>Closing Time</label>
              <input
                type="time"
                value={lawyerProfile.closingTime}
                onChange={(e) => setLawyerProfile(prev => ({...prev, closingTime: e.target.value}))}
                className={styles.inputField}
              />
            </div>
          </div>
        </div>

        <button className={styles.saveButton} onClick={handleProfileSave}>
          <i className="fas fa-save"></i> Save Profile
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.lawyerDashboard}>
      {/* Video Call Interface */}
      {showVideoCall && activeVideoConsultation && (
        <VideoCallInterface
          consultation={activeVideoConsultation}
          onEndCall={handleEndCall}
          userRole="lawyer"
        />
      )}

      {/* Chat Modal */}
      {showChatModal && activeChatRequest && (
        <div className={styles.chatModalOverlay}>
          <div className={styles.chatModal}>
            <div className={styles.chatModalHeader}>
              <div className={styles.chatHeaderInfo}>
                <h3>Chat with {activeChatRequest.userName}</h3>
                <p>{activeChatRequest.subject}</p>
              </div>
              <button 
                className={styles.closeChatModal}
                onClick={() => {
                  setShowChatModal(false);
                  setActiveChatRequest(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className={styles.chatModalContent}>
              <div className={styles.chatMessages}>
                {(chatMessages[activeChatRequest.id] || []).map(message => (
                  <div 
                    key={message.id} 
                    className={`${styles.chatMessage} ${styles[message.type]} ${message.isOriginalRequest ? styles.originalRequest : ''}`}
                  >
                    <div className={styles.messageHeader}>
                      <strong>{message.senderName}</strong>
                      <span className={styles.messageTime}>
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.messageText}>
                      {message.isOriginalRequest && (
                        <div className={styles.originalRequestLabel}>
                          <i className="fas fa-file-alt"></i>
                          <span>Original Request</span>
                        </div>
                      )}
                      {message.message}
                      
                      {/* Time Proposal Display */}
                      {message.isTimeProposal && message.proposedTimes && (
                        <div className={styles.timeProposal}>
                          <div className={styles.proposalHeader}>
                            <i className="fas fa-calendar-alt"></i>
                            <span>Proposed Meeting Times:</span>
                          </div>
                          <div className={styles.proposedTimes}>
                            {message.proposedTimes.map((timeSlot, index) => (
                              <button
                                key={index}
                                className={styles.proposedTimeSlot}
                                onClick={() => handleAcceptProposedTime(timeSlot)}
                                title="Click to schedule this time"
                              >
                                <i className="fas fa-calendar-check"></i>
                                <span>
                                  {new Date(timeSlot.date).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })} at {timeSlot.time}
                                </span>
                              </button>
                            ))}
                          </div>
                          <p className={styles.proposalNote}>
                            <i className="fas fa-info-circle"></i>
                            Click on any time slot to confirm the meeting
                          </p>
                        </div>
                      )}
                      
                      {/* Confirmation Display */}
                      {message.isConfirmation && (
                        <div className={styles.confirmationMessage}>
                          <i className="fas fa-check-circle"></i>
                          <span>Meeting Confirmed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.chatInput}>
                <textarea
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Type your message to the client..."
                  className={styles.chatTextarea}
                  rows={3}
                />
                <button 
                  className={styles.sendChatButton}
                  onClick={handleSendChatMessage}
                  disabled={!newChatMessage.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>Send Message</span>
                </button>
              </div>
            </div>
            
            <div className={styles.chatModalActions}>
              {activeChatRequest?.status === 'active' && (
                <>
                  <button 
                    className={styles.proposeTimeButton}
                    onClick={handleProposeTime}
                  >
                    <i className="fas fa-calendar-plus"></i>
                    <TranslatableText text="Propose Meeting Time" />
                  </button>
                  <button 
                    className={`${styles.rejectRequestButton} ${!canRejectRequest() ? styles.disabled : ''}`}
                    onClick={handleRejectFromChat}
                    disabled={!canRejectRequest()}
                  >
                    <i className="fas fa-times"></i>
                    <TranslatableText text="End Consultation" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scheduling Modal */}
      {showSchedulingModal && (
        <div className={styles.chatModalOverlay}>
          <div className={styles.schedulingModal}>
            <div className={styles.schedulingModalHeader}>
              <h3>Propose Meeting Times</h3>
              <p>Select available time slots to offer to {activeChatRequest?.userName}</p>
              <button 
                className={styles.closeChatModal}
                onClick={() => setShowSchedulingModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className={styles.schedulingModalContent}>
              <div className={styles.timeSlotGrid}>
                {/* Generate time slots for the next 7 days */}
                {Array.from({length: 7}, (_, dayIndex) => {
                  const date = new Date();
                  date.setDate(date.getDate() + dayIndex + 1);
                  const dateString = date.toISOString().split('T')[0];
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                  
                  return (
                    <div key={dateString} className={styles.daySlots}>
                      <h4>{dayName} - {date.toLocaleDateString()}</h4>
                      <div className={styles.timeSlots}>
                        {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => {
                          const isSelected = selectedTimeSlots.some(
                            slot => slot.date === dateString && slot.time === time
                          );
                          return (
                            <button
                              key={`${dateString}_${time}`}
                              className={`${styles.timeSlot} ${isSelected ? styles.selected : ''}`}
                              onClick={() => handleTimeSlotSelect(dateString, time)}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className={styles.schedulingModalActions}>
              <button 
                className={styles.sendProposalButton}
                onClick={handleSendTimeProposal}
                disabled={selectedTimeSlots.length === 0}
              >
                <i className="fas fa-paper-plane"></i>
                Send Proposal ({selectedTimeSlots.length} slots selected)
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowSchedulingModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Banner */}
      {showNotifications && notifications.length > 0 && (
        <div className={styles.notificationBanner}>
          <div className={styles.notificationContent}>
            <i className="fas fa-bell"></i>
            <span>{notifications[0].message}</span>
            <button 
              className={styles.closeNotification}
              onClick={() => setShowNotifications(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
      
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2><TranslatableText text="Lawyer Dashboard" /></h2>
          <p>Welcome, {user?.name}</p>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-tachometer-alt"></i>
            <TranslatableText text="Overview" />
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'consultations' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('consultations');
              setSelectedConsultation(null);
            }}
          >
            <i className="fas fa-users"></i>
            <TranslatableText text="Consultations" />
            {consultationRequests.filter(req => req.status === 'pending').length > 0 && (
              <span className={styles.notificationBadge}>
                {consultationRequests.filter(req => req.status === 'pending').length}
              </span>
            )}
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            <TranslatableText text="My Profile" />
          </button>

          {/* Notifications */}
          <button 
            className={`${styles.navItem} ${notifications.filter(n => !n.isRead).length > 0 ? styles.hasNotifications : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              // Mark visible notifications as read
              notifications.forEach(notif => {
                if (!notif.isRead) {
                  markNotificationAsRead(notif.id);
                }
              });
            }}
          >
            <i className="fas fa-bell"></i>
            <TranslatableText text="Notifications" />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className={styles.notificationBadge}>
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'consultations' && renderConsultations()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};
export default LawyerDashboard;
