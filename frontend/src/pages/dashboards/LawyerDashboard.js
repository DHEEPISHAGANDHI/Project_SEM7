import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useConsultationRequests } from '../../contexts/ConsultationRequestContext';
import TranslatableText from '../../components/TranslatableText';
import VideoCallInterface from '../../components/VideoCallInterface';
import ScheduledMeetingsCalendar from '../../components/ScheduledMeetingsCalendar';
import styles from './LawyerDashboard.module.css';

const LawyerDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    requests,
    acceptRequest,
    rejectRequest,
    approveMeetingRequest,
    scheduleMeeting,
    completeMeeting,
    sendMessage
  } = useConsultationRequests();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeVideoConsultation, setActiveVideoConsultation] = useState(null);
  const [consultationTab, setConsultationTab] = useState('new-requests'); // 'new-requests', 'active-consultations' or 'scheduled-meetings'
  
  const [lawyerProfile, setLawyerProfile] = useState({
    clinicName: "Priya's Family Legal Aid Clinic",
    address: 'Flat 402, Sunset Heights, Bandra West, Mumbai, Maharashtra 400050',
    contactEmail: 'contact@priyasharma.legal',
    contactPhone: '+91-9876543210',
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
    closingTime: '18:00',
    profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [activeChatRequestId, setActiveChatRequestId] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  // Redirect if not lawyer
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

  // Filter requests assigned to this lawyer
  const consultationRequests = requests.filter(r => r.lawyerId === user?.id);

  // Active chat request derived state
  const activeChatRequest = consultationRequests.find(r => r.id === activeChatRequestId) || null;

  // Dynamically calculate statistics
  const lawyerStats = (() => {
    const total = consultationRequests.length;
    const accepted = consultationRequests.filter(req => 
      req.status === 'active' || req.status === 'scheduled' || req.status === 'completed'
    ).length;
    const rejected = consultationRequests.filter(req => req.status === 'rejected').length;
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 100;
    
    return {
      totalRequests: total,
      acceptedRequests: accepted,
      rejectedRequests: rejected,
      acceptanceRate
    };
  })();

  // Generate notifications based on pending requests
  useEffect(() => {
    const pendings = consultationRequests.filter(r => r.status === 'pending');
    const notifs = pendings.map((r, index) => ({
      id: index + 1,
      message: `New consultation request from ${r.userName}: "${r.subject}"`,
      timestamp: r.requestDate,
      isRead: false
    }));
    setNotifications(notifs);
  }, [requests, user]);

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  // Check if lawyer has enough margin to reject
  const canRejectRequest = () => {
    if (lawyerStats.totalRequests < 5) return true; // Let them reject initially
    return lawyerStats.acceptanceRate >= 80;
  };

  const handleAcceptAndOpenChat = (consultationId) => {
    acceptRequest(consultationId);
    setActiveChatRequestId(consultationId);
    setShowChatModal(true);
    setConsultationTab('active-consultations');
    alert('✅ Request Accepted!\n\nYou can now chat with the client and schedule a video consultation.');
  };

  const handleRejectConsultation = (consultationId) => {
    if (!canRejectRequest()) {
      alert('⚠️ Cannot reject request: Your acceptance rate would drop below the required 80% threshold.');
      return;
    }
    const confirmReject = window.confirm('Are you sure you want to decline this request?');
    if (confirmReject) {
      rejectRequest(consultationId);
      alert('❌ Consultation request declined.');
    }
  };

  const handleOpenChat = (request) => {
    setActiveChatRequestId(request.id);
    setShowChatModal(true);
  };

  const handleSendChatMessage = () => {
    if (!newChatMessage.trim() || !activeChatRequest) return;
    sendMessage(activeChatRequest.id, 'lawyer', user?.name || 'Advocate', newChatMessage.trim());
    setNewChatMessage('');
  };

  const handleRejectFromChat = () => {
    if (!activeChatRequest) return;
    if (!canRejectRequest()) {
      alert('⚠️ Cannot decline consultation: Your acceptance rate must remain above 80%.');
      return;
    }
    const confirmEnd = window.confirm('Are you sure you want to decline and end this consultation?');
    if (confirmEnd) {
      rejectRequest(activeChatRequest.id);
      setShowChatModal(false);
      setActiveChatRequestId(null);
      alert('❌ Consultation declined.');
    }
  };

  const handleProposeTime = () => {
    setShowSchedulingModal(true);
  };

  const handleTimeSlotSelect = (date, time) => {
    const slotExists = selectedTimeSlots.some(s => s.date === date && s.time === time);
    if (slotExists) {
      setSelectedTimeSlots(prev => prev.filter(s => !(s.date === date && s.time === time)));
    } else {
      setSelectedTimeSlots(prev => [...prev, { date, time }]);
    }
  };

  const handleSendTimeProposal = () => {
    if (!activeChatRequest || selectedTimeSlots.length === 0) return;

    // Send the meeting proposal in chat
    sendMessage(
      activeChatRequest.id, 
      'lawyer', 
      user?.name || 'Advocate', 
      "I'd like to propose the following meeting times for our consultation:", 
      {
        isTimeProposal: true,
        proposedTimes: selectedTimeSlots
      }
    );

    // Automatically approve meeting request state so user can schedule it
    approveMeetingRequest(activeChatRequest.id);

    setShowSchedulingModal(false);
    setSelectedTimeSlots([]);
    alert('📅 Proposed meeting slots sent successfully to the client!');
  };

  const handleAcceptProposedTime = (timeSlot) => {
    if (!activeChatRequest) return;
    scheduleMeeting(activeChatRequest.id, timeSlot.date, timeSlot.time);
    setShowChatModal(false);
    setActiveChatRequestId(null);
    alert(`✅ Meeting Scheduled successfully on ${timeSlot.date} at ${timeSlot.time}!`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConsultation) return;
    sendMessage(selectedConsultation.id, 'lawyer', user?.name || 'Advocate', newMessage.trim());
    setNewMessage('');
  };

  const handleJoinCall = (consultation) => {
    setActiveVideoConsultation(consultation);
    setShowVideoCall(true);
  };

  const handleEndCall = () => {
    setShowVideoCall(false);
    if (activeVideoConsultation) {
      completeMeeting(activeVideoConsultation.id);
    }
    setActiveVideoConsultation(null);
  };

  const handleCompleteConsultation = (consultationId) => {
    const confirmComplete = window.confirm('Mark this consultation as completed?');
    if (confirmComplete) {
      completeMeeting(consultationId);
      alert('✅ Consultation completed.');
    }
  };

  const handleProfileSave = () => {
    alert('Clinic & Profile details saved successfully!');
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

  // Helper colors
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'active': return '#0056b3';
      case 'scheduled': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canJoinCall = (consultation) => {
    if (!consultation?.scheduledDate || !consultation?.scheduledTime) return false;
    
    const scheduledDateTime = new Date(`${consultation.scheduledDate}T${consultation.scheduledTime}`);
    const now = new Date();
    const timeDiff = scheduledDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    return minutesDiff <= 10 && minutesDiff >= -30;
  };

  // Render Subcomponents
  const renderOverview = () => (
    <div className={styles.overviewContent}>
      <div className={styles.welcomeSection}>
        <h2>Welcome back, {user?.name}!</h2>
        <p>Manage your consultation requests and help users with their legal needs.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => { setActiveTab('consultations'); setConsultationTab('new-requests'); }} style={{ cursor: 'pointer' }}>
          <div className={styles.statIcon}>
            <i className="fas fa-clock" style={{color: '#ffc107'}}></i>
          </div>
          <div className={styles.statInfo}>
            <h3>{consultationRequests.filter(req => req.status === 'pending').length}</h3>
            <p><TranslatableText text="Pending Requests" /></p>
          </div>
        </div>
        
        <div className={styles.statCard} onClick={() => { setActiveTab('consultations'); setConsultationTab('active-consultations'); }} style={{ cursor: 'pointer' }}>
          <div className={styles.statIcon}>
            <i className="fas fa-handshake" style={{color: '#0056b3'}}></i>
          </div>
          <div className={styles.statInfo}>
            <h3>{consultationRequests.filter(req => req.status === 'active').length}</h3>
            <p><TranslatableText text="Active Consultations" /></p>
          </div>
        </div>
        
        <div className={styles.statCard} onClick={() => { setActiveTab('consultations'); setConsultationTab('scheduled-meetings'); }} style={{ cursor: 'pointer' }}>
          <div className={styles.statIcon}>
            <i className="fas fa-check-circle" style={{color: '#28a745'}}></i>
          </div>
          <div className={styles.statInfo}>
            <h3>{consultationRequests.filter(req => req.status === 'scheduled').length}</h3>
            <p><TranslatableText text="Scheduled Meetings" /></p>
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
              <p className={styles.recentDesc}>{request.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConsultations = () => (
    <div className={styles.consultationsContent}>
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

      {lawyerStats.acceptanceRate < 85 && (
        <div className={styles.warningBanner}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>
            Warning: Your acceptance rate is {lawyerStats.acceptanceRate}%. 
            Please maintain at least 80% to continue receiving requests.
          </span>
        </div>
      )}

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
          <p><TranslatableText text="You have no pending requests at the moment." /></p>
        </div>
      );
    }

    return (
      <div className={styles.requestsList}>
        <div className={styles.requestsHeader}>
          <h3><TranslatableText text="New Consultation Requests" /></h3>
        </div>
        
        <div className={styles.requestsGrid}>
          {pendingRequests.map(request => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <div className={styles.requestInfo}>
                  <h4>{request.subject}</h4>
                  <p><strong>Client:</strong> {request.userName}</p>
                  <p><strong>Request Date:</strong> {formatDate(request.requestDate)}</p>
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
          <p><TranslatableText text="Accepted requests will appear here for messaging." /></p>
        </div>
      );
    }

    return (
      <div className={styles.requestsList}>
        <div className={styles.requestsHeader}>
          <h3><TranslatableText text="Active Consultations" /></h3>
        </div>
        
        <div className={styles.requestsGrid}>
          {activeRequests.map(request => (
            <div key={request.id} className={styles.activeConsultationCard}>
              <div className={styles.requestHeader}>
                <div className={styles.requestInfo}>
                  <h4>{request.subject}</h4>
                  <p><strong>Client:</strong> {request.userName}</p>
                  <p><strong>Email:</strong> {request.userEmail}</p>
                </div>
                <div className={styles.requestBadges}>
                  <span className={styles.activeBadge}>
                    <i className="fas fa-comments"></i> Active Chat
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
          <p><TranslatableText text="View your upcoming consultations. Click a slot to view details and launch the call." /></p>
        </div>
        
        <ScheduledMeetingsCalendar 
          consultationRequests={consultationRequests}
          onBlockTime={(date, timeSlots) => {
            alert(`✅ Time slots blocked: ${timeSlots.join(', ')} on ${date}`);
          }}
          onBlockDay={(date) => {
            alert(`✅ Day blocked: ${date}`);
          }}
          onMeetingClick={(meeting) => {
            setSelectedConsultation(meeting);
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
            <input type="text" placeholder="Enter your Bar Council ID" defaultValue="MAH/4021/2018" className={styles.inputField} />
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
              className={styles.inputField}
            />
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Full Address</label>
            <textarea
              value={lawyerProfile.address}
              onChange={(e) => setLawyerProfile(prev => ({...prev, address: e.target.value}))}
              className={styles.textareaField}
            ></textarea>
          </div>
          
          <div className={styles.fieldGroup}>
            <label>Clinic Contact Email</label>
            <input
              type="email"
              value={lawyerProfile.contactEmail}
              onChange={(e) => setLawyerProfile(prev => ({...prev, contactEmail: e.target.value}))}
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
                  setActiveChatRequestId(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className={styles.chatModalContent}>
              <div className={styles.chatMessages}>
                {/* Render seeded/stored messages directly */}
                {(activeChatRequest.messages || []).map(message => {
                  const type = message.sender === 'user' ? 'client' : message.sender === 'system' ? 'system' : 'lawyer';
                  return (
                    <div 
                      key={message.id} 
                      className={`${styles.chatMessage} ${styles[type]} ${message.isOriginalRequest ? styles.originalRequest : ''}`}
                    >
                      <div className={styles.messageHeader}>
                        <strong>{message.senderName}</strong>
                        <span className={styles.messageTime}>
                          {new Date(message.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                      <div className={styles.messageText}>
                        {message.text}
                        
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
                                    {formatDate(timeSlot.date)} at {timeSlot.time}
                                  </span>
                                </button>
                              ))}
                            </div>
                            <p className={styles.proposalNote}>
                              <i className="fas fa-info-circle"></i>
                              Click on a slot to schedule it.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                    <TranslatableText text="Decline Consultation" />
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
                {Array.from({length: 4}, (_, dayIndex) => {
                  const date = new Date();
                  date.setDate(date.getDate() + dayIndex + 1);
                  const dateString = date.toISOString().split('T')[0];
                  const dayName = date.toLocaleDateString('en-IN', { weekday: 'long' });
                  
                  return (
                    <div key={dateString} className={styles.daySlots}>
                      <h4>{dayName} - {formatDate(dateString)}</h4>
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

      {/* Meeting Details Modal (Scheduled Meetings) */}
      {selectedConsultation && (
        <div className={styles.chatModalOverlay}>
          <div className={styles.chatModal}>
            <div className={styles.chatModalHeader}>
              <div className={styles.chatHeaderInfo}>
                <h3><TranslatableText text="Meeting Details" /></h3>
                <p>{selectedConsultation.subject}</p>
              </div>
              <button 
                className={styles.closeChatModal}
                onClick={() => setSelectedConsultation(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className={styles.chatModalContent} style={{ padding: '24px' }}>
              <div className={styles.meetingDetailsPanel}>
                <div style={{ marginBottom: '16px', fontSize: '15px' }}>
                  <strong>Client:</strong> {selectedConsultation.userName} ({selectedConsultation.userEmail})
                </div>
                <div style={{ marginBottom: '16px', fontSize: '15px' }}>
                  <strong>Phone:</strong> {selectedConsultation.userPhone || 'Not provided'}
                </div>
                <div style={{ marginBottom: '16px', fontSize: '15px' }}>
                  <strong>Date & Time:</strong> {formatDate(selectedConsultation.scheduledDate)} at {selectedConsultation.scheduledTime}
                </div>
                <div style={{ marginBottom: '16px', fontSize: '15px' }}>
                  <strong>Description:</strong>
                  <p style={{ marginTop: '8px', padding: '12px', background: '#f8f9fa', borderRadius: '6px', fontSize: '14px', lineHeight: '1.5' }}>
                    {selectedConsultation.description}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    className={styles.openChatButton}
                    onClick={() => {
                      setSelectedConsultation(null);
                      handleOpenChat(selectedConsultation);
                    }}
                  >
                    <i className="fas fa-comments"></i> Open Chat
                  </button>
                  
                  {canJoinCall(selectedConsultation) ? (
                    <button
                      className={styles.acceptChatButton}
                      onClick={() => {
                        setSelectedConsultation(null);
                        handleJoinCall(selectedConsultation);
                      }}
                    >
                      <i className="fas fa-video"></i> Join Video Call
                    </button>
                  ) : (
                    <button
                      className={`${styles.acceptChatButton} ${styles.disabled}`}
                      disabled
                      title="Meeting call button will activate 10 minutes before the scheduled time."
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    >
                      <i className="fas fa-video"></i> Join Call (Inactive)
                    </button>
                  )}
                  
                  <button
                    className={styles.rejectButton}
                    onClick={() => {
                      if (window.confirm('Mark this consultation as completed?')) {
                        setSelectedConsultation(null);
                        completeMeeting(selectedConsultation.id);
                        alert('✅ Consultation completed.');
                      }
                    }}
                  >
                    <i className="fas fa-check-circle"></i> Complete
                  </button>
                </div>
              </div>
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
