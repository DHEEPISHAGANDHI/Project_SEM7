import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useAuth } from '../../contexts/AuthContext';
import { useConsultationRequests } from '../../contexts/ConsultationRequestContext';
import TranslatableText from '../../components/TranslatableText';
import VideoCallInterface from '../../components/VideoCallInterface';
import styles from './UserDashboard_Professional.module.css';

const sampleDocuments = [
  {
    id: 1,
    name: 'Draft Complaint Template',
    category: 'Legal Templates',
    downloadDate: '2026-07-12',
    fileUrl: '/documents/draft-complaint-template.pdf',
    description: 'A structured complaint format for court filings and consumer cases.'
  },
  {
    id: 2,
    name: 'Consumer Complaint Form',
    category: 'Consumer Rights',
    downloadDate: '2026-07-10',
    fileUrl: '/documents/consumer-complaint-form.pdf',
    description: 'Ready-to-use format for common consumer disputes.'
  },
  {
    id: 3,
    name: 'Rent Agreement Template',
    category: 'Property Law',
    downloadDate: '2026-07-07',
    fileUrl: '/documents/rent-agreement-template.pdf',
    description: 'Simple rental agreement template with essential clauses.'
  },
  {
    id: 4,
    name: 'Power of Attorney Format',
    category: 'Legal Documentation',
    downloadDate: '2026-07-04',
    fileUrl: '/documents/power-of-attorney.pdf',
    description: 'General power of attorney draft for common legal tasks.'
  }
];

const formatDate = (dateString) => {
  if (!dateString) return 'Not scheduled';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString));
};

const formatDateTime = (dateString, timeString) => {
  if (!dateString || !timeString) return 'Not scheduled';
  const timeLabel = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${formatDate(dateString)} at ${timeLabel}`;
};

const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const statusMeta = (request) => {
  if (!request) {
    return { label: 'Unknown', tone: 'neutral', icon: 'fas fa-circle-question' };
  }

  if (request.status === 'scheduled') {
    return { label: 'Meeting Scheduled', tone: 'success', icon: 'fas fa-calendar-check' };
  }

  if (request.status === 'completed') {
    return { label: 'Completed', tone: 'muted', icon: 'fas fa-circle-check' };
  }

  if (request.status === 'rejected' || request.status === 'cancelled') {
    return { label: request.status[0].toUpperCase() + request.status.slice(1), tone: 'danger', icon: 'fas fa-ban' };
  }

  if (request.status === 'active' && request.meetingRequestStatus === 'approved') {
    return { label: 'Approved - Schedule Now', tone: 'primary', icon: 'fas fa-calendar-plus' };
  }

  if (request.status === 'active') {
    return { label: 'Chat Open', tone: 'primary', icon: 'fas fa-comments' };
  }

  if (request.meetingRequestStatus === 'sent') {
    return { label: 'Meeting Request Sent', tone: 'warning', icon: 'fas fa-clock' };
  }

  return { label: 'Pending Review', tone: 'warning', icon: 'fas fa-hourglass-half' };
};

const canJoinCall = (request) => {
  if (!request?.scheduledDate || !request?.scheduledTime) return false;

  const scheduledDateTime = new Date(`${request.scheduledDate}T${request.scheduledTime}`);
  const now = new Date();
  const minutesAway = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60);

  return minutesAway <= 10 && minutesAway >= -30;
};

const buildDraftComplaintPdf = () => {
  const pdf = new jsPDF();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('DRAFT COMPLAINT TEMPLATE', 105, 20, { align: 'center' });
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Use this outline as a starting point and fill in the blanks with your details.', 105, 30, { align: 'center' });

  const sections = [
    ['Court and case details', ['Court name', 'Case type', 'Case number']],
    ['Parties', ['Complainant / petitioner', 'Respondent / defendant']],
    ['Facts', ['What happened', 'Dates and evidence', 'Impact on you']],
    ['Relief sought', ['What you want the court to do']],
    ['Verification', ['Signature', 'Date', 'Place']]
  ];

  let y = 46;
  sections.forEach(([title, points], index) => {
    if (index > 0) {
      pdf.addPage();
      y = 24;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text(title, 18, y);
    y += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    points.forEach((point) => {
      pdf.text(`- ${point}`, 18, y);
      y += 10;
    });
  });

  pdf.save('Draft_Complaint_Template.pdf');
};

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

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [draftMessage, setDraftMessage] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeVideoConsultation, setActiveVideoConsultation] = useState(null);
  const [meetingDrafts, setMeetingDrafts] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'user') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const userRequests = requests.filter((request) => request.userId === user?.id);
  const visibleConsultations = userRequests.filter((request) => request.status !== 'rejected' && request.status !== 'cancelled');
  const selectedConsultation = visibleConsultations.find((request) => request.id === selectedConsultationId) || null;

  useEffect(() => {
    if (!selectedConsultation && visibleConsultations.length > 0) {
      setSelectedConsultationId(visibleConsultations[0].id);
    }
  }, [selectedConsultation, visibleConsultations]);

  const stats = [
    {
      label: 'Active consultations',
      value: visibleConsultations.length,
      hint: 'Open conversations and approved cases',
      icon: 'fas fa-comments',
      color: 'var(--primary-blue)'
    },
    {
      label: 'Upcoming meetings',
      value: userRequests.filter((request) => request.status === 'scheduled').length,
      hint: 'Scheduled video consultations',
      icon: 'fas fa-calendar-check',
      color: '#10b981'
    },
    {
      label: 'Pending approvals',
      value: userRequests.filter((request) => request.status === 'pending').length,
      hint: 'Requests waiting for a lawyer reply',
      icon: 'fas fa-hourglass-half',
      color: '#f59e0b'
    },
    {
      label: 'Saved documents',
      value: sampleDocuments.length,
      hint: 'Templates and legal drafts',
      icon: 'fas fa-file-alt',
      color: '#8b5cf6'
    }
  ];

  const upcomingMeeting = visibleConsultations.find((request) => request.status === 'scheduled');
  const latestActiveConsultation = visibleConsultations[0] || null;
  const completedConsultations = userRequests.filter((request) => request.status === 'completed');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSelectConsultation = (requestId) => {
    setSelectedConsultationId(requestId);
    setActiveTab('consultations');
  };

  const handleSendMessage = () => {
    if (!selectedConsultation || !draftMessage.trim()) return;
    sendMessage(selectedConsultation.id, 'user', user?.name || 'You', draftMessage.trim());
    setDraftMessage('');
  };

  const handleRequestMeeting = (consultation) => {
    if (!consultation.hasActiveConversation) {
      window.alert('Start a conversation before requesting a meeting.');
      return;
    }

    if (consultation.meetingRequestStatus === 'sent') {
      window.alert('Your meeting request is already waiting for approval.');
      return;
    }

    requestMeetingFromUser(consultation.id);
  };

  const handleScheduleMeeting = (consultation) => {
    const draft = meetingDrafts[consultation.id];
    if (!draft?.date || !draft?.time) {
      window.alert('Choose both a date and a time before scheduling.');
      return;
    }

    scheduleMeeting(consultation.id, draft.date, draft.time);
    setMeetingDrafts((current) => ({
      ...current,
      [consultation.id]: { date: '', time: '' }
    }));
    setActiveTab('consultations');
  };

  const handleJoinCall = (consultation) => {
    if (!consultation.meetingDetails?.meetingLink && !consultation.scheduledDate) {
      window.alert('The call is not ready yet. Please wait for the meeting schedule.');
      return;
    }

    setActiveVideoConsultation(consultation);
    setShowVideoCall(true);
  };

  const handleEndCall = () => {
    if (activeVideoConsultation) {
      completeMeeting(activeVideoConsultation.id);
    }
    setShowVideoCall(false);
    setActiveVideoConsultation(null);
  };

  const handleDownloadDocument = (documentItem) => {
    if (documentItem.name === 'Draft Complaint Template') {
      buildDraftComplaintPdf();
      return;
    }

    const link = document.createElement('a');
    link.href = documentItem.fileUrl;
    link.download = `${documentItem.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.alert(`${documentItem.name} downloaded successfully.`);
  };

  const renderOverview = () => (
    <div className={styles.overviewGrid}>
      <article className={styles.welcomeCard}>
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeText}>
            <span className={styles.welcomeBadge}>Welcome back</span>
            <h2>{user?.name?.split(' ')[0] || 'there'}</h2>
            <p>Your legal workspace is ready. You have {visibleConsultations.length} active consultation{visibleConsultations.length !== 1 ? 's' : ''} and {userRequests.filter((r) => r.status === 'scheduled').length} upcoming meeting{userRequests.filter((r) => r.status === 'scheduled').length !== 1 ? 's' : ''}.</p>
          </div>
          <div className={styles.welcomeActions}>
            <button className={styles.primaryButton} onClick={() => setActiveTab('consultations')}>
              <i className="fas fa-comments"></i>
              <TranslatableText text="View Consultations" />
            </button>
            <button className={styles.secondaryButton} onClick={() => setActiveTab('documents')}>
              <i className="fas fa-file-alt"></i>
              <TranslatableText text="Documents" />
            </button>
          </div>
        </div>
        <div className={styles.welcomeIllustration}>
          <div className={styles.illustrationIcon}>
            <i className="fas fa-scale-balanced"></i>
          </div>
        </div>
      </article>

      <div className={styles.statsRow}>
        {stats.map((stat, index) => (
          <article key={index} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statHint}>{stat.hint}</span>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.quickActionsGrid}>
        <article className={styles.quickActionCard}>
          <div className={styles.quickActionIcon}>
            <i className="fas fa-calendar-plus"></i>
          </div>
          <h3>Schedule a Meeting</h3>
          <p>Book a video consultation with your lawyer</p>
          <button className={styles.quickActionButton} onClick={() => setActiveTab('schedule')}>
            <TranslatableText text="Schedule Now" />
          </button>
        </article>

        <article className={styles.quickActionCard}>
          <div className={styles.quickActionIcon}>
            <i className="fas fa-comments"></i>
          </div>
          <h3>Send a Message</h3>
          <p>Continue your conversation with legal support</p>
          <button className={styles.quickActionButton} onClick={() => setActiveTab('consultations')}>
            <TranslatableText text="Open Chat" />
          </button>
        </article>

        <article className={styles.quickActionCard}>
          <div className={styles.quickActionIcon}>
            <i className="fas fa-file-download"></i>
          </div>
          <h3>Download Templates</h3>
          <p>Access legal document templates</p>
          <button className={styles.quickActionButton} onClick={() => setActiveTab('documents')}>
            <TranslatableText text="View Documents" />
          </button>
        </article>
      </div>

      {upcomingMeeting && (
        <article className={styles.upcomingMeetingCard}>
          <div className={styles.meetingHeader}>
            <div className={styles.meetingIcon}>
              <i className="fas fa-video"></i>
            </div>
            <div>
              <h3>Upcoming Meeting</h3>
              <p>Your next consultation is scheduled</p>
            </div>
          </div>
          <div className={styles.meetingDetails}>
            <div className={styles.meetingInfo}>
              <div className={styles.meetingLawyer}>
                <img src={upcomingMeeting.lawyerPhoto} alt={upcomingMeeting.lawyerName} className={styles.lawyerAvatar} />
                <div>
                  <strong>{upcomingMeeting.lawyerName}</strong>
                  <span>{upcomingMeeting.specialization}</span>
                </div>
              </div>
              <div className={styles.meetingTime}>
                <i className="fas fa-calendar"></i>
                <span>{formatDateTime(upcomingMeeting.scheduledDate, upcomingMeeting.scheduledTime)}</span>
              </div>
            </div>
            {canJoinCall(upcomingMeeting) && (
              <button className={styles.joinMeetingButton} onClick={() => handleJoinCall(upcomingMeeting)}>
                <i className="fas fa-video"></i>
                <TranslatableText text="Join Meeting" />
              </button>
            )}
          </div>
        </article>
      )}
    </div>
  );

  const renderConsultations = () => (
    <div className={styles.consultationsLayout}>
      <div className={styles.consultationListPanel}>
        <div className={styles.panelHeader}>
          <div>
            <h2><TranslatableText text="My Consultations" /></h2>
            <p>Track conversations, request meetings, and continue legal guidance in one view.</p>
          </div>
          <button className={styles.primaryButton} onClick={() => setActiveTab('schedule')}>
            <i className="fas fa-calendar-plus"></i>
            <TranslatableText text="Schedule Meeting" />
          </button>
        </div>

        {visibleConsultations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fas fa-comments"></i>
            </div>
            <h3>No consultations yet</h3>
            <p>Your dashboard will populate once a lawyer accepts or replies to your request.</p>
          </div>
        ) : (
          <div className={styles.consultationCards}>
            {visibleConsultations.map((request) => {
              const meta = statusMeta(request);
              const isActive = request.id === selectedConsultationId;

              return (
                <button
                  key={request.id}
                  className={`${styles.consultationCard} ${isActive ? styles.consultationCardActive : ''}`}
                  onClick={() => handleSelectConsultation(request.id)}
                >
                  <div className={styles.consultationCardTop}>
                    <img src={request.lawyerPhoto} alt={request.lawyerName} className={styles.avatar} />
                    <div className={styles.consultationInfo}>
                      <h3>{request.lawyerName}</h3>
                      <p>{request.specialization}</p>
                    </div>
                    <span className={`${styles.statusChip} ${styles[meta.tone]}`}>
                      <i className={meta.icon} />
                      {meta.label}
                    </span>
                  </div>

                  <p className={styles.consultationSubject}>{request.subject}</p>
                  <p className={styles.consultationExcerpt}>{request.description}</p>

                  <div className={styles.consultationMetaRow}>
                    <span><i className="fas fa-calendar" /> {formatDate(request.requestDate)}</span>
                    <span><i className="fas fa-message" /> {request.messages?.length || 0} messages</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <aside className={styles.detailPanel}>
        {selectedConsultation ? (
          <>
            <div className={styles.detailHeader}>
              <div>
                <span className={styles.detailLabel}>Conversation with</span>
                <h3>{selectedConsultation.lawyerName}</h3>
                <p>{selectedConsultation.subject}</p>
              </div>
              <span className={`${styles.statusChip} ${styles[statusMeta(selectedConsultation).tone]}`}>
                <i className={statusMeta(selectedConsultation).icon} />
                {statusMeta(selectedConsultation).label}
              </span>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <i className="fas fa-calendar"></i>
                <div>
                  <span>Requested on</span>
                  <strong>{formatDate(selectedConsultation.requestDate)}</strong>
                </div>
              </div>
              <div className={styles.summaryItem}>
                <i className="fas fa-clock"></i>
                <div>
                  <span>Meeting time</span>
                  <strong>{formatDateTime(selectedConsultation.scheduledDate, selectedConsultation.scheduledTime)}</strong>
                </div>
              </div>
              <div className={styles.summaryItem}>
                <i className="fas fa-tag"></i>
                <div>
                  <span>Topic</span>
                  <strong>{selectedConsultation.specialization}</strong>
                </div>
              </div>
            </div>

            <div className={styles.messageStream}>
              {selectedConsultation.messages?.length ? selectedConsultation.messages.map((message) => (
                <div key={message.id} className={`${styles.messageBubble} ${styles[message.sender] || ''}`}>
                  <div className={styles.messageMeta}>
                    <strong>{message.senderName}</strong>
                    <span>{formatMessageTime(message.timestamp)}</span>
                  </div>
                  <p>{message.text}</p>
                </div>
              )) : (
                <div className={styles.emptyThread}>
                  <div className={styles.emptyThreadIcon}>
                    <i className="fas fa-message"></i>
                  </div>
                  <h4>Start the conversation</h4>
                  <p>Send a short note to keep the consultation moving.</p>
                </div>
              )}
            </div>

            {selectedConsultation.status === 'active' && selectedConsultation.meetingRequestStatus === 'none' && (
              <button className={styles.primaryButton} onClick={() => handleRequestMeeting(selectedConsultation)}>
                <i className="fas fa-calendar-plus"></i>
                <TranslatableText text="Request a Meeting" />
              </button>
            )}

            {selectedConsultation.meetingRequestStatus === 'sent' && (
              <div className={styles.inlineNotice}>
                <i className="fas fa-info-circle"></i>
                Your meeting request is awaiting approval.
              </div>
            )}

            {selectedConsultation.meetingRequestStatus === 'approved' && selectedConsultation.status !== 'scheduled' && (
              <div className={styles.schedulerCard}>
                <div className={styles.schedulerHeader}>
                  <i className="fas fa-calendar-alt"></i>
                  <div>
                    <h4>Schedule your meeting</h4>
                    <p>Choose a date and time that works for you</p>
                  </div>
                </div>
                <div className={styles.schedulerFields}>
                  <div className={styles.fieldGroup}>
                    <label>Date</label>
                    <input
                      type="date"
                      value={meetingDrafts[selectedConsultation.id]?.date || ''}
                      onChange={(event) => setMeetingDrafts((current) => ({
                        ...current,
                        [selectedConsultation.id]: { ...(current[selectedConsultation.id] || {}), date: event.target.value }
                      }))}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Time</label>
                    <input
                      type="time"
                      value={meetingDrafts[selectedConsultation.id]?.time || ''}
                      onChange={(event) => setMeetingDrafts((current) => ({
                        ...current,
                        [selectedConsultation.id]: { ...(current[selectedConsultation.id] || {}), time: event.target.value }
                      }))}
                    />
                  </div>
                </div>
                <button className={styles.primaryButton} onClick={() => handleScheduleMeeting(selectedConsultation)}>
                  <i className="fas fa-check"></i>
                  <TranslatableText text="Confirm Schedule" />
                </button>
              </div>
            )}

            {selectedConsultation.status === 'scheduled' && (
              <button
                className={styles.primaryButton}
                onClick={() => handleJoinCall(selectedConsultation)}
                disabled={!canJoinCall(selectedConsultation)}
              >
                <i className="fas fa-video"></i>
                <TranslatableText text="Join Video Call" />
              </button>
            )}

            <div className={styles.messageComposer}>
              <textarea
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                placeholder="Write a clear follow-up message..."
                rows={3}
              />
              <div className={styles.composerActions}>
                <button className={styles.dangerButton} onClick={() => cancelRequest(selectedConsultation.id)}>
                  <i className="fas fa-times"></i>
                  <TranslatableText text="Cancel Request" />
                </button>
                <button className={styles.primaryButton} onClick={handleSendMessage} disabled={!draftMessage.trim()}>
                  <i className="fas fa-paper-plane"></i>
                  <TranslatableText text="Send Message" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fas fa-comments"></i>
            </div>
            <h3>Select a consultation</h3>
            <p>Pick a lawyer thread from the left to review messages and next steps.</p>
          </div>
        )}
      </aside>
    </div>
  );

  const renderSchedule = () => {
    const schedulable = visibleConsultations.filter((request) => request.meetingRequestStatus === 'approved' || request.status === 'active');

    return (
      <div className={styles.scheduleSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Schedule a Meeting</h2>
            <p>Choose an approved consultation and lock in a slot without leaving your dashboard.</p>
          </div>
        </div>

        {schedulable.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fas fa-calendar"></i>
            </div>
            <h3>No consultations ready for scheduling</h3>
            <p>Once a lawyer approves your request, you can pick a time here.</p>
          </div>
        ) : (
          <div className={styles.scheduleGrid}>
            {schedulable.map((request) => (
              <article key={request.id} className={styles.scheduleCard}>
                <div className={styles.scheduleCardHeader}>
                  <img src={request.lawyerPhoto} alt={request.lawyerName} className={styles.lawyerAvatar} />
                  <div>
                    <h3>{request.lawyerName}</h3>
                    <p>{request.specialization}</p>
                  </div>
                </div>

                <div className={styles.schedulerFields}>
                  <div className={styles.fieldGroup}>
                    <label>Select Date</label>
                    <input
                      type="date"
                      value={meetingDrafts[request.id]?.date || ''}
                      onChange={(event) => setMeetingDrafts((current) => ({
                        ...current,
                        [request.id]: { ...(current[request.id] || {}), date: event.target.value }
                      }))}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Select Time</label>
                    <input
                      type="time"
                      value={meetingDrafts[request.id]?.time || ''}
                      onChange={(event) => setMeetingDrafts((current) => ({
                        ...current,
                        [request.id]: { ...(current[request.id] || {}), time: event.target.value }
                      }))}
                    />
                  </div>
                </div>

                <button className={styles.primaryButton} onClick={() => handleScheduleMeeting(request)}>
                  <i className="fas fa-calendar-check"></i>
                  <TranslatableText text="Book Slot" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderDocuments = () => (
    <div className={styles.documentsSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Document Library</h2>
          <p>Access the templates and complaint drafts you need without hunting through folders.</p>
        </div>
      </div>

      <div className={styles.documentGrid}>
        {sampleDocuments.map((documentItem) => (
          <article key={documentItem.id} className={styles.documentCard}>
            <div className={styles.documentIcon}>
              <i className="fas fa-file-pdf"></i>
            </div>
            <span className={styles.documentBadge}>{documentItem.category}</span>
            <h3>{documentItem.name}</h3>
            <p>{documentItem.description}</p>
            <div className={styles.documentMeta}>
              <span><i className="fas fa-calendar"></i> Saved on {formatDate(documentItem.downloadDate)}</span>
            </div>
            <button className={styles.secondaryButton} onClick={() => handleDownloadDocument(documentItem)}>
              <i className="fas fa-download"></i>
              <TranslatableText text="Download" />
            </button>
          </article>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className={styles.historySection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Request History</h2>
          <p>Review the consultations you already resolved or closed.</p>
        </div>
      </div>

      {userRequests.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fas fa-clock-rotate-left"></i>
          </div>
          <h3>No history yet</h3>
          <p>Your completed and archived requests will show up here.</p>
        </div>
      ) : (
        <div className={styles.historyList}>
          {userRequests.map((request) => {
            const meta = statusMeta(request);

            return (
              <article key={request.id} className={styles.historyItem}>
                <div className={styles.historyInfo}>
                  <h3>{request.subject}</h3>
                  <p>{request.lawyerName} · {request.specialization}</p>
                  <span className={styles.historyDate}>{formatDate(request.requestDate)}</span>
                </div>
                <span className={`${styles.statusChip} ${styles[meta.tone]}`}>
                  <i className={meta.icon} />
                  {meta.label}
                </span>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );

  if (showVideoCall && activeVideoConsultation) {
    return (
      <div className={styles.videoCallShell}>
        <div className={styles.videoCallTopbar}>
          <button className={styles.backButton} onClick={() => setShowVideoCall(false)}>
            <i className="fas fa-arrow-left"></i>
            <span>Back to dashboard</span>
          </button>
          <span className={styles.videoCallTitle}>Live consultation with {activeVideoConsultation.lawyerName}</span>
        </div>
        <VideoCallInterface
          consultation={activeVideoConsultation}
          userRole="user"
          onEndCall={handleEndCall}
        />
      </div>
    );
  }

  return (
    <div className={styles.dashboardShell}>
      {/* Mobile Sidebar Toggle */}
      <button className={styles.mobileMenuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className={`fas ${sidebarOpen ? 'fas fa-times' : 'fas fa-bars'}`}></i>
      </button>

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brandBlock}>
          <div className={styles.brandIcon}>
            <i className="fas fa-scale-balanced"></i>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandKicker}>Legal Workspace</span>
            <h1>Dashboard</h1>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {[
            { id: 'overview', label: 'Overview', icon: 'fas fa-grid-2' },
            { id: 'consultations', label: 'Consultations', icon: 'fas fa-comments' },
            { id: 'schedule', label: 'Schedule', icon: 'fas fa-calendar-days' },
            { id: 'documents', label: 'Documents', icon: 'fas fa-folder-open' },
            { id: 'history', label: 'History', icon: 'fas fa-clock-rotate-left' }
          ].map((item) => (
            <button
              key={item.id}
              className={`${styles.navButton} ${activeTab === item.id ? styles.navButtonActive : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <i className={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <img src={user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=163a72&color=fff`} alt={user?.name} className={styles.userAvatar} />
            <div>
              <strong>{user?.name || 'User'}</strong>
              <span>Client Account</span>
            </div>
          </div>
          <div className={styles.footerButtons}>
            <button className={styles.secondaryButton} onClick={() => navigate('/')}>
              <i className="fas fa-home"></i>
              <TranslatableText text="Home" />
            </button>
            <button className={styles.dangerButton} onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <TranslatableText text="Logout" />
            </button>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <div>
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p>Manage your legal consultations and documents</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconButton} title="Notifications">
              <i className="fas fa-bell"></i>
              <span className={styles.notificationBadge}>3</span>
            </button>
            <button className={styles.iconButton} title="Settings">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </header>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'consultations' && renderConsultations()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'history' && renderHistory()}
      </main>
    </div>
  );
};

export default UserDashboard;