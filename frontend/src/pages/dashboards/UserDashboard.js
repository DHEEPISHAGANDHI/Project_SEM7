import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TranslatableText from '../../components/TranslatableText';
import VideoCallInterface from '../../components/VideoCallInterface';
import jsPDF from 'jspdf';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('consultations');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [consultations, setConsultations] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeVideoConsultation, setActiveVideoConsultation] = useState(null);
  const [approvedLawyers, setApprovedLawyers] = useState([]);
  const [selectedLawyerForScheduling, setSelectedLawyerForScheduling] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [meetingRequests, setMeetingRequests] = useState({});

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

  // Mock data for consultations
  useEffect(() => {
    const mockConsultations = [
      {
        id: 1,
        lawyerId: 1,
        lawyerName: 'Adv. Priya Sharma',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Family Law',
        initiatedDate: '2025-08-10',
        lastMessageDate: '2025-08-14',
        lastMessage: 'Your consultation has been approved. Please schedule a meeting.',
        status: 'Approved - Schedule Now', // Updated status
        scheduledDate: null,
        scheduledTime: null,
        meetingApproved: true, // New field to track if lawyer approved meeting
        meetingRequestStatus: 'approved', // 'none', 'sent', 'approved', 'rejected'
        hasActiveConversation: true, // Track if conversation has started
        messages: [
          {
            id: 1,
            sender: 'user',
            senderName: user?.name || 'You',
            text: 'Hello, I need help with a divorce case. My husband and I have been separated for 2 years and we want to file for mutual consent divorce.',
            timestamp: '2025-08-10T10:30:00Z'
          },
          {
            id: 2,
            sender: 'lawyer',
            senderName: 'Adv. Priya Sharma',
            text: 'Hello! I understand you need assistance with a mutual consent divorce. This is definitely something I can help you with. I have approved your consultation request.',
            timestamp: '2025-08-10T14:45:00Z'
          },
          {
            id: 3,
            sender: 'system',
            senderName: 'System',
            text: 'Adv. Priya Sharma has approved your request for a meeting. You can now schedule it.',
            timestamp: '2025-08-14T09:00:00Z'
          }
        ]
      },
      {
        id: 2,
        lawyerId: 2,
        lawyerName: 'Adv. Rajesh Kumar',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Property Law',
        initiatedDate: '2025-08-05',
        lastMessageDate: '2025-08-12',
        lastMessage: 'I\'ve reviewed your property documents. See you tomorrow at 2 PM.',
        status: 'Scheduled for Aug 17 at 2:00 PM', // Updated status
        scheduledDate: '2025-08-17',
        scheduledTime: '14:00',
        meetingApproved: true,
        meetingRequestStatus: 'scheduled', // Meeting already scheduled
        hasActiveConversation: true,
        messages: [
          {
            id: 1,
            sender: 'user',
            senderName: user?.name || 'You',
            text: 'I\'m having issues with my property registration. The seller is claiming there are no pending dues, but I found some tax arrears.',
            timestamp: '2025-08-05T11:00:00Z'
          },
          {
            id: 2,
            sender: 'lawyer',
            senderName: 'Adv. Rajesh Kumar',
            text: 'This is a common issue in property transactions. I\'ve approved your consultation request. Let\'s schedule a video call to discuss this in detail.',
            timestamp: '2025-08-05T15:30:00Z'
          }
        ]
      },
      {
        id: 3,
        lawyerId: 3,
        lawyerName: 'Adv. Meera Patel',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Consumer Rights',
        initiatedDate: '2025-07-28',
        lastMessageDate: '2025-08-01',
        lastMessage: 'Your case has been successfully resolved. Thank you for choosing our services.',
        status: 'Completed', // Updated status
        scheduledDate: '2025-08-01',
        scheduledTime: '11:00',
        meetingApproved: true,
        meetingRequestStatus: 'completed',
        hasActiveConversation: true,
        messages: [
          {
            id: 1,
            sender: 'user',
            senderName: user?.name || 'You',
            text: 'I bought a defective mobile phone and the company is refusing to replace it despite being under warranty.',
            timestamp: '2025-07-28T14:00:00Z'
          },
          {
            id: 2,
            sender: 'lawyer',
            senderName: 'Adv. Meera Patel',
            text: 'Based on the evidence you provided, we successfully filed a complaint with the consumer forum and got your replacement. Case completed!',
            timestamp: '2025-08-01T11:15:00Z'
          }
        ]
      },
      {
        id: 4,
        lawyerId: 4,
        lawyerName: 'Adv. Amit Singh',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Criminal Law',
        initiatedDate: '2025-08-15',
        lastMessageDate: '2025-08-15',
        lastMessage: 'Thank you for your consultation request. I will review it shortly.',
        status: 'Pending Approval', // New status
        scheduledDate: null,
        scheduledTime: null,
        meetingApproved: false,
        meetingRequestStatus: 'none', // No meeting request yet
        hasActiveConversation: true, // Has started conversation
        messages: [
          {
            id: 1,
            sender: 'user',
            senderName: user?.name || 'You',
            text: 'I need legal advice regarding a false accusation case filed against me.',
            timestamp: '2025-08-15T09:00:00Z'
          }
        ]
      },
      {
        id: 5,
        lawyerId: 5,
        lawyerName: 'Adv. Kavita Reddy',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Labor Law',
        initiatedDate: '2025-08-16',
        lastMessageDate: '2025-08-16',
        lastMessage: 'Chat started. Send your first message.',
        status: 'New Conversation',
        scheduledDate: null,
        scheduledTime: null,
        meetingApproved: false,
        meetingRequestStatus: 'none',
        hasActiveConversation: false, // No messages sent yet
        messages: []
      }
    ];
    setConsultations(mockConsultations);
    
    // Extract approved lawyers for scheduling
    const approved = mockConsultations
      .filter(consultation => consultation.meetingApproved)
      .map(consultation => ({
        id: consultation.lawyerId,
        name: consultation.lawyerName,
        photo: consultation.lawyerPhoto,
        specialization: consultation.specialization,
        consultationId: consultation.id,
        status: consultation.status,
        // Mock calendar data
        availableSlots: [
          { date: '2025-08-17', time: '10:00', available: true },
          { date: '2025-08-17', time: '14:00', available: false },
          { date: '2025-08-17', time: '16:00', available: true },
          { date: '2025-08-18', time: '09:00', available: true },
          { date: '2025-08-18', time: '11:00', available: true },
          { date: '2025-08-18', time: '15:00', available: true },
          { date: '2025-08-19', time: '10:00', available: true },
          { date: '2025-08-19', time: '13:00', available: true },
          { date: '2025-08-19', time: '17:00', available: true }
        ]
      }));
    
    setApprovedLawyers(approved);
  }, [user]);

  // Mock data for request history - ALL consultation requests ever sent
  useEffect(() => {
    const mockRequestHistory = [
      {
        id: 1,
        lawyerName: 'Adv. Priya Sharma',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Family Law',
        dateSent: '2025-08-10',
        status: 'Approved',
        legalIssue: 'Divorce proceedings - mutual consent'
      },
      {
        id: 2,
        lawyerName: 'Adv. Rajesh Kumar',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Property Law',
        dateSent: '2025-08-05',
        status: 'Approved',
        legalIssue: 'Property registration issues'
      },
      {
        id: 3,
        lawyerName: 'Adv. Meera Patel',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Consumer Rights',
        dateSent: '2025-07-28',
        status: 'Approved',
        legalIssue: 'Defective mobile phone replacement'
      },
      {
        id: 4,
        lawyerName: 'Adv. Amit Singh',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Criminal Law',
        dateSent: '2025-08-15',
        status: 'Pending',
        legalIssue: 'False accusation case'
      },
      {
        id: 5,
        lawyerName: 'Adv. Kavita Reddy',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Labor Law',
        dateSent: '2025-08-16',
        status: 'Pending',
        legalIssue: 'Workplace harassment complaint'
      },
      {
        id: 6,
        lawyerName: 'Adv. Suresh Gupta',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Corporate Law',
        dateSent: '2025-07-20',
        status: 'Rejected',
        legalIssue: 'Business partnership dispute'
      },
      {
        id: 7,
        lawyerName: 'Adv. Anita Verma',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Immigration Law',
        dateSent: '2025-07-15',
        status: 'Rejected',
        legalIssue: 'Visa application assistance'
      },
      {
        id: 8,
        lawyerName: 'Adv. Rohit Sharma',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Tax Law',
        dateSent: '2025-06-30',
        status: 'Approved',
        legalIssue: 'Income tax dispute resolution'
      },
      {
        id: 9,
        lawyerName: 'Adv. Deepika Nair',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Family Law',
        dateSent: '2025-06-25',
        status: 'Rejected',
        legalIssue: 'Child custody case'
      },
      {
        id: 10,
        lawyerName: 'Adv. Vikram Joshi',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Real Estate Law',
        dateSent: '2025-06-10',
        status: 'Approved',
        legalIssue: 'Property sale agreement review'
      },
      {
        id: 11,
        lawyerName: 'Adv. Ravi Kumar',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Criminal Law',
        dateSent: '2025-08-12',
        status: 'Cancelled',
        legalIssue: 'Traffic violation defense'
      },
      {
        id: 12,
        lawyerName: 'Adv. Sonia Patel',
        lawyerPhoto: '/api/placeholder/50/50',
        specialization: 'Employment Law',
        dateSent: '2025-08-14',
        status: 'Cancelled',
        legalIssue: 'Wrongful termination case'
      }
    ];
    setRequestHistory(mockRequestHistory);
  }, [user]);

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

    const message = {
      id: Date.now(),
      sender: 'user',
      senderName: user?.name || 'You',
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setConsultations(prev => 
      prev.map(consultation => 
        consultation.id === selectedConsultation.id
          ? {
              ...consultation,
              messages: [...consultation.messages, message],
              lastMessage: newMessage.trim(),
              lastMessageDate: new Date().toISOString().split('T')[0],
              status: consultation.status === 'New Conversation' ? 'Active' : 'Awaiting Reply',
              hasActiveConversation: true // Mark conversation as active after first message
            }
          : consultation
      )
    );

    // Update selected consultation
    setSelectedConsultation(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage.trim(),
      lastMessageDate: new Date().toISOString().split('T')[0],
      status: prev.status === 'New Conversation' ? 'Active' : 'Awaiting Reply',
      hasActiveConversation: true
    }));

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

    // Send meeting request
    setConsultations(prev => 
      prev.map(c => 
        c.id === consultation.id
          ? {
              ...c,
              meetingRequestStatus: 'sent',
              lastMessage: 'Meeting request sent to lawyer.',
              messages: [...c.messages, {
                id: Date.now(),
                sender: 'system',
                senderName: 'System',
                text: `You have requested a meeting with ${c.lawyerName}. They will review your request and respond soon.`,
                timestamp: new Date().toISOString()
              }]
            }
          : c
      )
    );

    // Update selected consultation
    if (selectedConsultation?.id === consultation.id) {
      setSelectedConsultation(prev => ({
        ...prev,
        meetingRequestStatus: 'sent',
        lastMessage: 'Meeting request sent to lawyer.',
        messages: [...prev.messages, {
          id: Date.now(),
          sender: 'system',
          senderName: 'System',
          text: `You have requested a meeting with ${prev.lawyerName}. They will review your request and respond soon.`,
          timestamp: new Date().toISOString()
        }]
      }));
    }

    // Simulate lawyer response (for demo purposes)
    setTimeout(() => {
      simulateLawyerResponse(consultation.id);
    }, 3000); // Simulate 3 second delay
  };

  // Simulate lawyer response to meeting request
  const simulateLawyerResponse = (consultationId) => {
    // For demo, randomly approve or reject (80% approval rate)
    const isApproved = Math.random() > 0.2;
    
    setConsultations(prev => 
      prev.map(c => 
        c.id === consultationId
          ? {
              ...c,
              meetingRequestStatus: isApproved ? 'approved' : 'rejected',
              meetingApproved: isApproved,
              status: isApproved ? 'Approved - Schedule Now' : 'Request Rejected',
              lastMessage: isApproved 
                ? 'Your meeting request has been approved! You can now schedule a time.'
                : 'Your meeting request has been rejected.',
              messages: [...c.messages, {
                id: Date.now() + 1,
                sender: 'system',
                senderName: 'System',
                text: isApproved 
                  ? `${c.lawyerName} has approved your meeting request. You can now schedule a time slot.`
                  : `${c.lawyerName} has rejected your meeting request. You may try again later or continue with text consultation.`,
                timestamp: new Date().toISOString()
              }]
            }
          : c
      )
    );

    // Update selected consultation if it's currently open
    setSelectedConsultation(prev => {
      if (prev?.id === consultationId) {
        const consultation = consultations.find(c => c.id === consultationId);
        if (consultation) {
          return {
            ...prev,
            meetingRequestStatus: isApproved ? 'approved' : 'rejected',
            meetingApproved: isApproved,
            status: isApproved ? 'Approved - Schedule Now' : 'Request Rejected',
            lastMessage: isApproved 
              ? 'Your meeting request has been approved! You can now schedule a time.'
              : 'Your meeting request has been rejected.',
            messages: [...prev.messages, {
              id: Date.now() + 1,
              sender: 'system',
              senderName: 'System',
              text: isApproved 
                ? `${prev.lawyerName} has approved your meeting request. You can now schedule a time slot.`
                : `${prev.lawyerName} has rejected your meeting request. You may try again later or continue with text consultation.`,
              timestamp: new Date().toISOString()
            }]
          };
        }
      }
      return prev;
    });

    // Show notification to user
    if (isApproved) {
      alert('Great news! Your meeting request has been approved. You can now schedule a time.');
    } else {
      alert('Your meeting request was not approved. You can continue with text consultation.');
    }
  };

  // Get meeting request button based on status
  const getMeetingRequestButton = (consultation) => {
    if (!consultation.hasActiveConversation) {
      return null; // No button if no conversation started
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
        return null; // No button needed for these states
      default:
        return null;
    }
  };

  // Download document function
  const handleDownloadDocument = (doc) => {
    if (doc.name === 'Draft Complaint Template') {
      // Generate PDF for Draft Complaint
      generateDraftComplaintPDF();
    } else {
      // For other documents, simulate download
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      alert(`${doc.name} downloaded successfully!`);
    }
  };

  // Generate Draft Complaint PDF
  const generateDraftComplaintPDF = () => {
    const pdf = new jsPDF();
    
    // Set title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DRAFT COMPLAINT TEMPLATE', 105, 20, { align: 'center' });
    
    // Add court details section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('IN THE COURT OF:', 20, 40);
    pdf.setFont('helvetica', 'normal');
    pdf.text('_________________________________________________', 20, 48);
    pdf.text('(Name and Address of the Court)', 20, 55);
    
    // Add case details
    pdf.setFont('helvetica', 'bold');
    pdf.text('CASE TYPE:', 20, 75);
    pdf.setFont('helvetica', 'normal');
    pdf.text('_________________________________________________', 20, 83);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('CASE NUMBER:', 20, 100);
    pdf.setFont('helvetica', 'normal');
    pdf.text('_________________________________________________', 20, 108);
    
    // Add parties section
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
    
    // Add new page for complaint details
    pdf.addPage();
    
    // Complaint details
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
    
    // Add signature page
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
    
    // Add footer with instructions
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Instructions: Fill in all the blanks with relevant information.', 20, 270);
    pdf.text('Attach all supporting documents. Consult a lawyer for legal advice.', 20, 280);
    
    // Download the PDF
    pdf.save('Draft_Complaint_Template.pdf');
    
    // Show success message
    alert('Draft Complaint Template downloaded successfully!');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for messages
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Approval': return '#ffc107';
      case 'Approved - Schedule Now': return '#0056b3';
      case 'Completed': return '#28a745';
      default: 
        if (status.includes('Scheduled for')) return '#17a2b8';
        return '#6c757d';
    }
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

  // Handle schedule meeting with specific lawyer
  const handleScheduleMeetingWithLawyer = (lawyer, date, time) => {
    // Update the consultation status
    setConsultations(prev => 
      prev.map(c => 
        c.id === lawyer.consultationId
          ? {
              ...c,
              status: `Scheduled for ${formatDate(date)} at ${time}`,
              scheduledDate: date,
              scheduledTime: time,
              lastMessage: `Meeting scheduled successfully for ${formatDate(date)} at ${time}. You will receive a reminder 10 minutes before the call.`
            }
          : c
      )
    );

    // Update approved lawyers list
    setApprovedLawyers(prev => 
      prev.map(l => 
        l.id === lawyer.id
          ? {
              ...l,
              status: `Scheduled for ${formatDate(date)} at ${time}`,
              availableSlots: l.availableSlots.map(slot => 
                slot.date === date && slot.time === time
                  ? { ...slot, available: false }
                  : slot
              )
            }
          : l
      )
    );

    // Reset scheduling state
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
              onClick={() => setSelectedConsultation(null)}
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
                onClick={() => setSelectedConsultation(consultation)}
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
              setSelectedConsultation(null);
              setShowCalendar(false);
              setSelectedLawyerForScheduling(null);
            }}
          >
            <i className="fas fa-comments"></i>
            <TranslatableText text="My Consultations" />
            {consultations.filter(c => c.status === 'Active' || c.status === 'Awaiting Reply').length > 0 && (
              <span className={styles.notificationBadge}>
                {consultations.filter(c => c.status === 'Active' || c.status === 'Awaiting Reply').length}
              </span>
            )}
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'schedule-meeting' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('schedule-meeting');
              setSelectedConsultation(null);
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
              setSelectedConsultation(null);
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
