import React, { createContext, useContext, useState, useEffect } from 'react';

const ConsultationRequestContext = createContext();

export const useConsultationRequests = () => {
  const context = useContext(ConsultationRequestContext);
  if (!context) {
    throw new Error('useConsultationRequests must be used within a ConsultationRequestProvider');
  }
  return context;
};

export const ConsultationRequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);

  // Generate dynamic date strings relative to today
  const getRelativeDateStr = (daysOffset) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  };

  // Seed data combining both user consultations and lawyer requests
  const getSeedData = () => {
    return [
      // John Doe's consultations (userId: 3)
      {
        id: 'REQ_USER_1',
        userId: 3,
        userName: 'John Doe',
        userEmail: 'user@legalaid.com',
        userPhone: '+91-9876543219',
        lawyerId: 1,
        lawyerName: 'Adv. Priya Sharma',
        lawyerPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        specialization: 'Family Law',
        subject: 'Divorce proceedings - mutual consent',
        description: 'Hello, I need help with a divorce case. My husband and I have been separated for 2 years and we want to file for mutual consent divorce.',
        requestDate: getRelativeDateStr(-6),
        status: 'active', // 'pending', 'active', 'scheduled', 'completed', 'rejected', 'cancelled'
        meetingRequestStatus: 'approved', // 'none', 'sent', 'approved', 'rejected', 'scheduled', 'completed'
        meetingApproved: true,
        hasActiveConversation: true,
        scheduledDate: null,
        scheduledTime: null,
        messages: [
          {
            id: 1,
            sender: 'user',
            senderName: 'John Doe',
            text: 'Hello, I need help with a divorce case. My husband and I have been separated for 2 years and we want to file for mutual consent divorce.',
            timestamp: new Date(getRelativeDateStr(-6) + 'T10:30:00Z').toISOString()
          },
          {
            id: 2,
            sender: 'lawyer',
            senderName: 'Adv. Priya Sharma',
            text: 'Hello! I understand you need assistance with a mutual consent divorce. This is definitely something I can help you with. I have approved your consultation request.',
            timestamp: new Date(getRelativeDateStr(-6) + 'T14:45:00Z').toISOString()
          },
          {
            id: 3,
            sender: 'system',
            senderName: 'System',
            text: 'Adv. Priya Sharma has approved your request for a meeting. You can now schedule it.',
            timestamp: new Date(getRelativeDateStr(-2) + 'T09:00:00Z').toISOString()
          }
        ]
      },
      {
        id: 'REQ_USER_2',
        userId: 3,
        userName: 'John Doe',
        userEmail: 'user@legalaid.com',
        userPhone: '+91-9876543219',
        lawyerId: 2,
        lawyerName: 'Adv. Rajesh Kumar',
        lawyerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        specialization: 'Property Law',
        subject: 'Property registration issues',
        description: 'I\'m having issues with my property registration. The seller is claiming there are no pending dues, but I found some tax arrears.',
        requestDate: getRelativeDateStr(-11),
        status: 'scheduled',
        meetingRequestStatus: 'scheduled',
        meetingApproved: true,
        hasActiveConversation: true,
        scheduledDate: getRelativeDateStr(1), // Tomorrow
        scheduledTime: '14:00',
        messages: [
          {
            id: 1,
            sender: 'user',
            senderName: 'John Doe',
            text: 'I\'m having issues with my property registration. The seller is claiming there are no pending dues, but I found some tax arrears.',
            timestamp: new Date(getRelativeDateStr(-11) + 'T11:00:00Z').toISOString()
          },
          {
            id: 2,
            sender: 'lawyer',
            senderName: 'Adv. Rajesh Kumar',
            text: 'This is a common issue in property transactions. I\'ve approved your consultation request. Let\'s schedule a video call to discuss this in detail.',
            timestamp: new Date(getRelativeDateStr(-11) + 'T15:30:00Z').toISOString()
          }
        ]
      },
      {
        id: 'REQ_USER_3',
        userId: 3,
        userName: 'John Doe',
        userEmail: 'user@legalaid.com',
        userPhone: '+91-9876543219',
        lawyerId: 3,
        lawyerName: 'Adv. Meera Patel',
        lawyerPhoto: 'https://images.unsplash.com/photo-1594824388863-d2ce92670e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        specialization: 'Consumer Rights',
        subject: 'Defective mobile phone replacement',
        description: 'I bought a defective mobile phone and the company is refusing to replace it despite being under warranty.',
        requestDate: getRelativeDateStr(-18),
        status: 'completed',
        meetingRequestStatus: 'completed',
        meetingApproved: true,
        hasActiveConversation: true,
        scheduledDate: getRelativeDateStr(-15),
        scheduledTime: '11:00',
        messages: [
          {
            id: 1,
            sender: 'user',
            senderName: 'John Doe',
            text: 'I bought a defective mobile phone and the company is refusing to replace it despite being under warranty.',
            timestamp: new Date(getRelativeDateStr(-18) + 'T14:00:00Z').toISOString()
          },
          {
            id: 2,
            sender: 'lawyer',
            senderName: 'Adv. Meera Patel',
            text: 'Based on the evidence you provided, we successfully filed a complaint with the consumer forum and got your replacement. Case completed!',
            timestamp: new Date(getRelativeDateStr(-15) + 'T11:15:00Z').toISOString()
          }
        ]
      },
      {
        id: 'REQ_USER_4',
        userId: 3,
        userName: 'John Doe',
        userEmail: 'user@legalaid.com',
        userPhone: '+91-9876543219',
        lawyerId: 4,
        lawyerName: 'Adv. Amit Singh',
        lawyerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        specialization: 'Criminal Law',
        subject: 'False accusation case',
        description: 'I need legal advice regarding a false accusation case filed against me.',
        requestDate: getRelativeDateStr(-1),
        status: 'pending',
        meetingRequestStatus: 'none',
        meetingApproved: false,
        hasActiveConversation: true,
        scheduledDate: null,
        scheduledTime: null,
        messages: [
          {
            id: 1,
            sender: 'user',
            senderName: 'John Doe',
            text: 'I need legal advice regarding a false accusation case filed against me.',
            timestamp: new Date(getRelativeDateStr(-1) + 'T09:00:00Z').toISOString()
          }
        ]
      },
      {
        id: 'REQ_USER_5',
        userId: 3,
        userName: 'John Doe',
        userEmail: 'user@legalaid.com',
        userPhone: '+91-9876543219',
        lawyerId: 5,
        lawyerName: 'Adv. Kavita Reddy',
        lawyerPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        specialization: 'Labor Law',
        subject: 'Workplace harassment complaint',
        description: 'I would like to consult about workplace harassment and labor rights violations.',
        requestDate: getRelativeDateStr(0),
        status: 'pending',
        meetingRequestStatus: 'none',
        meetingApproved: false,
        hasActiveConversation: false,
        scheduledDate: null,
        scheduledTime: null,
        messages: []
      },

      // Other general requests assigned to Priya Sharma (lawyerId: 1)
      {
        id: 'REQ001',
        userId: 'USER001',
        userName: 'Rajesh Kumar',
        userEmail: 'rajesh@email.com',
        userPhone: '+91-9988776655',
        lawyerId: 1,
        lawyerName: 'Adv. Priya Sharma',
        specialization: 'Family Law',
        subject: 'Property Dispute Legal Advice',
        description: 'I am facing a boundary dispute with my neighbor. They have constructed a wall that encroaches on my property. I need legal guidance on how to proceed.',
        requestDate: getRelativeDateStr(-2),
        status: 'pending',
        urgency: 'medium',
        meetingRequestStatus: 'none',
        meetingApproved: false,
        hasActiveConversation: false,
        messages: []
      },
      {
        id: 'REQ002',
        userId: 'USER002',
        userName: 'Priya Sharma',
        userEmail: 'priya@email.com',
        userPhone: '+91-8877665544',
        lawyerId: 1,
        lawyerName: 'Adv. Priya Sharma',
        specialization: 'Family Law',
        subject: 'Employment Contract Review',
        description: 'I need help reviewing my employment contract. There are some clauses I don\'t understand and want to ensure my rights are protected.',
        requestDate: getRelativeDateStr(-3),
        status: 'active',
        urgency: 'low',
        meetingRequestStatus: 'none',
        meetingApproved: false,
        hasActiveConversation: true,
        messages: [
          {
            id: 1,
            sender: 'user',
            senderName: 'Priya Sharma',
            text: 'Original request: I need help reviewing my employment contract. There are some clauses I don\'t understand and want to ensure my rights are protected.',
            timestamp: getRelativeDateStr(-3)
          },
          {
            id: 2,
            sender: 'user',
            senderName: 'Priya Sharma',
            text: 'Thank you for accepting my consultation request. I have scheduled our meeting for tomorrow at 2 PM.',
            timestamp: getRelativeDateStr(-2) + ' 10:30 AM'
          },
          {
            id: 3,
            sender: 'lawyer',
            senderName: 'Adv. Priya Sharma',
            text: 'Perfect! I look forward to our video consultation tomorrow. Please have your employment contract ready for review.',
            timestamp: getRelativeDateStr(-2) + ' 11:15 AM'
          }
        ]
      },
      {
        id: 'REQ003',
        userId: 'USER003',
        userName: 'Amit Singh',
        userEmail: 'amit@email.com',
        userPhone: '+91-7766554433',
        lawyerId: 1,
        lawyerName: 'Adv. Priya Sharma',
        specialization: 'Family Law',
        subject: 'Consumer Rights Issue',
        description: 'I purchased a defective product and the company is refusing to provide a refund or replacement. What are my legal options?',
        requestDate: getRelativeDateStr(-4),
        status: 'scheduled',
        urgency: 'high',
        meetingRequestStatus: 'scheduled',
        meetingApproved: true,
        hasActiveConversation: true,
        scheduledDate: getRelativeDateStr(0), // Today
        scheduledTime: '11:00',
        messages: []
      },
      {
        id: 'REQ004',
        userId: 'USER004',
        userName: 'Meena Gupta',
        userEmail: 'meena@email.com',
        userPhone: '+91-6655443322',
        lawyerId: 1,
        lawyerName: 'Adv. Priya Sharma',
        specialization: 'Family Law',
        subject: 'Divorce Proceedings',
        description: 'I need assistance with filing for divorce. My husband has been abusive and I want to ensure I get proper alimony and child custody.',
        requestDate: getRelativeDateStr(-1),
        status: 'pending',
        urgency: 'high',
        meetingRequestStatus: 'none',
        meetingApproved: false,
        hasActiveConversation: false,
        messages: []
      },
      {
        id: 'REQ005',
        userId: 'USER005',
        userName: 'Suresh Patel',
        userEmail: 'suresh@email.com',
        userPhone: '+91-5544332211',
        lawyerId: 1,
        lawyerName: 'Adv. Priya Sharma',
        specialization: 'Family Law',
        subject: 'Business Partnership Dispute',
        description: 'My business partner is not fulfilling his obligations as per our partnership agreement. I need legal advice on how to proceed.',
        requestDate: getRelativeDateStr(-5),
        status: 'scheduled',
        urgency: 'medium',
        meetingRequestStatus: 'scheduled',
        meetingApproved: true,
        hasActiveConversation: true,
        scheduledDate: getRelativeDateStr(2), // Day after tomorrow
        scheduledTime: '16:00',
        messages: []
      }
    ];
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('legalaid_requests');
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved requests:', e);
        const seed = getSeedData();
        setRequests(seed);
        localStorage.setItem('legalaid_requests', JSON.stringify(seed));
      }
    } else {
      const seed = getSeedData();
      setRequests(seed);
      localStorage.setItem('legalaid_requests', JSON.stringify(seed));
    }
  }, []);

  // Save to localStorage helper
  const saveRequests = (updatedRequests) => {
    setRequests(updatedRequests);
    localStorage.setItem('legalaid_requests', JSON.stringify(updatedRequests));
  };

  // Create request (from user homepage query submission)
  const addRequest = (newReq) => {
    const request = {
      id: newReq.id || `REQ_${Date.now()}`,
      userId: newReq.userId || 3, // default to John Doe
      userName: newReq.userName,
      userEmail: newReq.userEmail,
      userPhone: newReq.userPhone,
      lawyerId: newReq.lawyerId,
      lawyerName: newReq.lawyerName,
      lawyerPhoto: newReq.lawyerPhoto || '/api/placeholder/50/50',
      specialization: newReq.specialization || 'Legal Advisor',
      subject: newReq.legalIssue || 'Legal Advice',
      description: newReq.issueDescription || '',
      requestDate: getRelativeDateStr(0),
      status: 'pending',
      urgency: newReq.urgency || 'normal',
      meetingRequestStatus: 'none',
      meetingApproved: false,
      hasActiveConversation: true,
      scheduledDate: null,
      scheduledTime: null,
      messages: [
        {
          id: Date.now(),
          sender: 'user',
          senderName: newReq.userName,
          text: newReq.issueDescription || 'Initiated consultation request.',
          timestamp: new Date().toISOString()
        }
      ]
    };

    saveRequests([...requests, request]);
    return request;
  };

  // Accept a pending request (called by lawyer)
  const acceptRequest = (requestId) => {
    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'active',
          messages: [
            ...req.messages,
            {
              id: Date.now(),
              sender: 'system',
              senderName: 'System',
              text: `${req.lawyerName} has accepted your consultation request. You can now chat and request a meeting.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return req;
    });
    saveRequests(updated);
  };

  // Reject a request (called by lawyer)
  const rejectRequest = (requestId) => {
    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'rejected',
          messages: [
            ...req.messages,
            {
              id: Date.now(),
              sender: 'system',
              senderName: 'System',
              text: `This request has been declined by ${req.lawyerName}.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return req;
    });
    saveRequests(updated);
  };

  // Cancel a request (called by user)
  const cancelRequest = (requestId) => {
    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'cancelled'
        };
      }
      return req;
    });
    saveRequests(updated);
  };

  // User requests a meeting from the lawyer
  const requestMeetingFromUser = (requestId) => {
    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          meetingRequestStatus: 'sent',
          messages: [
            ...req.messages,
            {
              id: Date.now(),
              sender: 'system',
              senderName: 'System',
              text: `You have requested a video meeting. ${req.lawyerName} will review your request shortly.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return req;
    });
    saveRequests(updated);
  };

  // Lawyer approves user's meeting request
  const approveMeetingRequest = (requestId) => {
    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          meetingRequestStatus: 'approved',
          meetingApproved: true,
          messages: [
            ...req.messages,
            {
              id: Date.now(),
              sender: 'system',
              senderName: 'System',
              text: `${req.lawyerName} has approved your meeting request. You can now schedule your time slot.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return req;
    });
    saveRequests(updated);
  };

  // Schedule appointment date and time (called by user or lawyer)
  const scheduleMeeting = (requestId, date, time) => {
    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'scheduled',
          meetingRequestStatus: 'scheduled',
          scheduledDate: date,
          scheduledTime: time,
          messages: [
            ...req.messages,
            {
              id: Date.now(),
              sender: 'system',
              senderName: 'System',
              text: `Meeting successfully scheduled for ${date} at ${time}.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return req;
    });
    saveRequests(updated);
  };

  // Complete consultation after call (called by user or lawyer)
  const completeMeeting = (requestId) => {
    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'completed',
          meetingRequestStatus: 'completed'
        };
      }
      return req;
    });
    saveRequests(updated);
  };

  // Send message in chat
  const sendMessage = (requestId, sender, senderName, text, extraProps = {}) => {
    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          hasActiveConversation: true,
          messages: [
            ...req.messages,
            {
              id: Date.now(),
              sender,
              senderName,
              text,
              timestamp: new Date().toISOString(),
              ...extraProps
            }
          ]
        };
      }
      return req;
    });
    saveRequests(updated);
  };

  return (
    <ConsultationRequestContext.Provider value={{
      requests,
      addRequest,
      acceptRequest,
      rejectRequest,
      cancelRequest,
      requestMeetingFromUser,
      approveMeetingRequest,
      scheduleMeeting,
      completeMeeting,
      sendMessage
    }}>
      {children}
    </ConsultationRequestContext.Provider>
  );
};
