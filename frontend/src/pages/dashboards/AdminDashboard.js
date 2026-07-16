import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TranslatableText from '../../components/TranslatableText';
import DocumentTemplateManager from '../../components/admin/DocumentTemplateManager';
import CaseAssignmentSystem from '../../components/admin/CaseAssignmentSystem';
import styles from './AdminDashboard.module.css';

// Mock data for demonstration
const mockData = {
  metrics: {
    totalUsers: 1247,
    verifiedLawyers: 89,
    activeConsultations: 156,
    pendingApprovals: 12
  },
  recentActivity: [
    { id: 1, action: 'New lawyer application', user: 'Advocate Sharma', time: '2 hours ago' },
    { id: 2, action: 'User consultation completed', user: 'Priya Singh', time: '3 hours ago' },
    { id: 3, action: 'Document template updated', user: 'Admin', time: '5 hours ago' },
    { id: 4, action: 'Legal clinic added', user: 'Dr. Verma', time: '1 day ago' }
  ],
  users: [
    { id: 1, name: 'Rahul Kumar', email: 'rahul@email.com', status: 'Active', joinDate: '2024-12-01' },
    { id: 2, name: 'Priya Singh', email: 'priya@email.com', status: 'Active', joinDate: '2024-11-15' },
    { id: 3, name: 'Amit Sharma', email: 'amit@email.com', status: 'Inactive', joinDate: '2024-10-20' }
  ],
  pendingLawyers: [
    { id: 1, name: 'Advocate Sharma', specialization: 'Criminal Law', experience: '8 years', applicationDate: '2024-12-10' },
    { id: 2, name: 'Dr. Meena Gupta', specialization: 'Family Law', experience: '12 years', applicationDate: '2024-12-08' }
  ],
  verifiedLawyers: [
    { id: 1, name: 'Advocate Patel', specialization: 'Corporate Law', cases: 15, rating: 4.8 },
    { id: 2, name: 'Senior Advocate Kumar', specialization: 'Constitutional Law', cases: 22, rating: 4.9 }
  ],
  kyrArticles: [
    { id: 1, title: 'Property Rights Guide', author: 'Admin', status: 'Published', date: '2024-12-01' },
    { id: 2, title: 'Consumer Protection Laws', author: 'Legal Team', status: 'Draft', date: '2024-12-05' }
  ],
  documentTemplates: [
    { id: 1, name: 'Rental Agreement', category: 'Property', downloads: 245 },
    { id: 2, name: 'Employment Contract', category: 'Labor', downloads: 189 }
  ],
  consultationLog: [
    { 
      id: 'CASE001', 
      userName: 'Rajesh Kumar', 
      lawyerName: 'Adv. Priya Sharma', 
      requestDate: '2024-08-15', 
      meetingDate: '2024-08-17', 
      status: 'Scheduled' 
    },
    { 
      id: 'CASE002', 
      userName: 'Priya Singh', 
      lawyerName: 'Adv. Rajesh Kumar', 
      requestDate: '2024-08-14', 
      meetingDate: '2024-08-16', 
      status: 'Completed' 
    },
    { 
      id: 'CASE003', 
      userName: 'Amit Sharma', 
      lawyerName: 'Adv. Meera Patel', 
      requestDate: '2024-08-13', 
      meetingDate: '2024-08-15', 
      status: 'Completed' 
    },
    { 
      id: 'CASE004', 
      userName: 'Meena Gupta', 
      lawyerName: 'Adv. Amit Singh', 
      requestDate: '2024-08-16', 
      meetingDate: null, 
      status: 'Pending' 
    },
    { 
      id: 'CASE005', 
      userName: 'Suresh Patel', 
      lawyerName: 'Adv. Priya Sharma', 
      requestDate: '2024-08-12', 
      meetingDate: null, 
      status: 'Rejected' 
    }
  ],
  lawyerPerformance: [
    {
      id: 1,
      name: 'Adv. Priya Sharma',
      totalRequests: 25,
      requestsAccepted: 22,
      requestsRejected: 3,
      acceptanceRate: 88
    },
    {
      id: 2,
      name: 'Adv. Rajesh Kumar',
      totalRequests: 30,
      requestsAccepted: 28,
      requestsRejected: 2,
      acceptanceRate: 93
    },
    {
      id: 3,
      name: 'Adv. Meera Patel',
      totalRequests: 20,
      requestsAccepted: 18,
      requestsRejected: 2,
      acceptanceRate: 90
    },
    {
      id: 4,
      name: 'Adv. Amit Singh',
      totalRequests: 15,
      requestsAccepted: 11,
      requestsRejected: 4,
      acceptanceRate: 73
    },
    {
      id: 5,
      name: 'Adv. Kavita Reddy',
      totalRequests: 18,
      requestsAccepted: 16,
      requestsRejected: 2,
      acceptanceRate: 89
    }
  ]
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [data, setData] = useState(mockData);
  const [consultationManagementTab, setConsultationManagementTab] = useState('consultation-log'); // 'consultation-log' or 'lawyer-performance'

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderOverview = () => (
    <div className={styles.overview}>
      <h2><TranslatableText text="Dashboard Overview" /></h2>
      
      {/* Metrics Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>{data.metrics.totalUsers}</h3>
          <p><TranslatableText text="Total Registered Users" /></p>
        </div>
        <div className={styles.metricCard}>
          <h3>{data.metrics.verifiedLawyers}</h3>
          <p><TranslatableText text="Verified Lawyers" /></p>
        </div>
        <div className={styles.metricCard}>
          <h3>{data.metrics.activeConsultations}</h3>
          <p><TranslatableText text="Active Consultations" /></p>
        </div>
        <div className={styles.metricCard}>
          <h3>{data.metrics.pendingApprovals}</h3>
          <p><TranslatableText text="Pending Approvals" /></p>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className={styles.moderationQueue}>
        <h3><TranslatableText text="Moderation Queue" /></h3>
        <div className={styles.queueItems}>
          <button 
            className={styles.queueItem}
            onClick={() => setActiveSection('lawyer-management')}
          >
            <span><TranslatableText text="Pending Lawyer Applications" /></span>
            <span className={styles.badge}>{data.pendingLawyers.length}</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.recentActivity}>
        <h3><TranslatableText text="Recent Activity" /></h3>
        <div className={styles.activityList}>
          {data.recentActivity.map(activity => (
            <div key={activity.id} className={styles.activityItem}>
              <div>
                <strong>{activity.action}</strong>
                <p>{activity.user} - {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className={styles.userManagement}>
      <h2><TranslatableText text="User Management" /></h2>
      
      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Search users..." 
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>
          <TranslatableText text="Search" />
        </button>
      </div>

      <div className={styles.userTable}>
        <table>
          <thead>
            <tr>
              <th><TranslatableText text="Name" /></th>
              <th><TranslatableText text="Email" /></th>
              <th><TranslatableText text="Status" /></th>
              <th><TranslatableText text="Join Date" /></th>
              <th><TranslatableText text="Actions" /></th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.status} ${styles[user.status.toLowerCase()]}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.joinDate}</td>
                <td>
                  <button className={styles.actionButton}>
                    <TranslatableText text="View Profile" />
                  </button>
                  <button className={`${styles.actionButton} ${styles.danger}`}>
                    <TranslatableText text="Deactivate" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLawyerManagement = () => (
    <div className={styles.lawyerManagement}>
      <h2><TranslatableText text="Lawyer Management" /></h2>
      
      {/* Verification Queue */}
      <div className={styles.verificationQueue}>
        <h3><TranslatableText text="Verification Queue" /></h3>
        <div className={styles.pendingApplications}>
          {data.pendingLawyers.map(lawyer => (
            <div key={lawyer.id} className={styles.applicationCard}>
              <div className={styles.lawyerInfo}>
                <h4>{lawyer.name}</h4>
                <p><strong><TranslatableText text="Specialization:" /></strong> {lawyer.specialization}</p>
                <p><strong><TranslatableText text="Experience:" /></strong> {lawyer.experience}</p>
                <p><strong><TranslatableText text="Applied:" /></strong> {lawyer.applicationDate}</p>
              </div>
              <div className={styles.applicationActions}>
                <button className={styles.approveButton}>
                  <TranslatableText text="Approve" />
                </button>
                <button className={styles.rejectButton}>
                  <TranslatableText text="Reject" />
                </button>
                <button className={styles.viewButton}>
                  <TranslatableText text="View Credentials" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Lawyer List */}
      <div className={styles.masterLawyerList}>
        <h3><TranslatableText text="Verified Lawyers" /></h3>
        <div className={styles.lawyerTable}>
          <table>
            <thead>
              <tr>
                <th><TranslatableText text="Name" /></th>
                <th><TranslatableText text="Specialization" /></th>
                <th><TranslatableText text="Active Cases" /></th>
                <th><TranslatableText text="Rating" /></th>
                <th><TranslatableText text="Actions" /></th>
              </tr>
            </thead>
            <tbody>
              {data.verifiedLawyers.map(lawyer => (
                <tr key={lawyer.id}>
                  <td>{lawyer.name}</td>
                  <td>{lawyer.specialization}</td>
                  <td>{lawyer.cases}</td>
                  <td>{lawyer.rating}⭐</td>
                  <td>
                    <button className={styles.actionButton}>
                      <TranslatableText text="View Profile" />
                    </button>
                    <button className={styles.actionButton}>
                      <TranslatableText text="Edit Info" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Assignment System */}
      <div className={styles.caseAssignmentSection}>
        <CaseAssignmentSystem />
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className={styles.contentManagement}>
      <h2><TranslatableText text="Content Management" /></h2>
      
      {/* KYR Articles */}
      <div className={styles.contentSection}>
        <h3><TranslatableText text="Know Your Rights Articles" /></h3>
        <button className={styles.addButton}>
          <TranslatableText text="+ Add New Article" />
        </button>
        <div className={styles.contentTable}>
          <table>
            <thead>
              <tr>
                <th><TranslatableText text="Title" /></th>
                <th><TranslatableText text="Author" /></th>
                <th><TranslatableText text="Status" /></th>
                <th><TranslatableText text="Date" /></th>
                <th><TranslatableText text="Actions" /></th>
              </tr>
            </thead>
            <tbody>
              {data.kyrArticles.map(article => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.author}</td>
                  <td>
                    <span className={`${styles.status} ${styles[article.status.toLowerCase()]}`}>
                      {article.status}
                    </span>
                  </td>
                  <td>{article.date}</td>
                  <td>
                    <button className={styles.actionButton}>
                      <TranslatableText text="Edit" />
                    </button>
                    <button className={`${styles.actionButton} ${styles.danger}`}>
                      <TranslatableText text="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Templates */}
      <div className={styles.contentSection}>
        <DocumentTemplateManager />
      </div>

      {/* Success Stories */}
      <div className={styles.contentSection}>
        <h3><TranslatableText text="Success Stories Management" /></h3>
        <button className={styles.addButton}>
          <TranslatableText text="+ Add Success Story" />
        </button>
        <div className={styles.successStoriesGrid}>
          {[
            { id: 1, title: 'Property Dispute Resolved', author: 'Rajesh Kumar', status: 'Published', date: '2024-11-20' },
            { id: 2, title: 'Employment Rights Victory', author: 'Priya Singh', status: 'Pending Review', date: '2024-12-05' },
            { id: 3, title: 'Consumer Protection Win', author: 'Amit Sharma', status: 'Draft', date: '2024-12-08' }
          ].map(story => (
            <div key={story.id} className={styles.storyCard}>
              <h4>{story.title}</h4>
              <p><TranslatableText text="Author:" /> {story.author}</p>
              <p><TranslatableText text="Date:" /> {story.date}</p>
              <div className={`${styles.status} ${styles[story.status.toLowerCase().replace(' ', '')]}`}>
                {story.status}
              </div>
              <div className={styles.storyActions}>
                <button className={styles.actionButton}>
                  <TranslatableText text="Edit" />
                </button>
                <button className={styles.actionButton}>
                  <TranslatableText text="Preview" />
                </button>
                <button className={`${styles.actionButton} ${styles.danger}`}>
                  <TranslatableText text="Delete" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Clinics Management */}
      <div className={styles.contentSection}>
        <h3><TranslatableText text="Legal Clinics Directory" /></h3>
        <button className={styles.addButton}>
          <TranslatableText text="+ Add Legal Clinic" />
        </button>
        <div className={styles.clinicsTable}>
          <table>
            <thead>
              <tr>
                <th><TranslatableText text="Clinic Name" /></th>
                <th><TranslatableText text="Location" /></th>
                <th><TranslatableText text="Contact" /></th>
                <th><TranslatableText text="Specialization" /></th>
                <th><TranslatableText text="Status" /></th>
                <th><TranslatableText text="Actions" /></th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: 'Delhi Legal Aid Center', location: 'New Delhi', contact: '+91-11-2345-6789', specialization: 'General Law', status: 'Active' },
                { id: 2, name: 'Mumbai Family Court Clinic', location: 'Mumbai', contact: '+91-22-3456-7890', specialization: 'Family Law', status: 'Active' },
                { id: 3, name: 'Bangalore Consumer Forum', location: 'Bangalore', contact: '+91-80-4567-8901', specialization: 'Consumer Rights', status: 'Inactive' }
              ].map(clinic => (
                <tr key={clinic.id}>
                  <td>{clinic.name}</td>
                  <td>{clinic.location}</td>
                  <td>{clinic.contact}</td>
                  <td>{clinic.specialization}</td>
                  <td>
                    <span className={`${styles.status} ${styles[clinic.status.toLowerCase()]}`}>
                      {clinic.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionButton}>
                      <TranslatableText text="Edit" />
                    </button>
                    <button className={`${styles.actionButton} ${styles.danger}`}>
                      <TranslatableText text="Remove" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderConsultationManagement = () => (
    <div className={styles.consultationManagement}>
      <h2><TranslatableText text="Consultation Management" /></h2>
      
      {/* Consultation Management Tabs */}
      <div className={styles.consultationTabs}>
        <button 
          className={`${styles.tabButton} ${consultationManagementTab === 'consultation-log' ? styles.activeTab : ''}`}
          onClick={() => setConsultationManagementTab('consultation-log')}
        >
          <i className="fas fa-list"></i>
          <TranslatableText text="Consultation Log" />
        </button>
        <button 
          className={`${styles.tabButton} ${consultationManagementTab === 'lawyer-performance' ? styles.activeTab : ''}`}
          onClick={() => setConsultationManagementTab('lawyer-performance')}
        >
          <i className="fas fa-chart-bar"></i>
          <TranslatableText text="Lawyer Performance" />
        </button>
      </div>

      {/* Tab Content */}
      {consultationManagementTab === 'consultation-log' && renderConsultationLog()}
      {consultationManagementTab === 'lawyer-performance' && renderLawyerPerformance()}
    </div>
  );

  const renderConsultationLog = () => (
    <div className={styles.consultationLogContent}>
      <div className={styles.logHeader}>
        <h3><TranslatableText text="Master Consultation Log" /></h3>
        <div className={styles.logFilters}>
          <select className={styles.filterSelect}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="text"
            placeholder="Search by case ID, user, or lawyer..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.consultationTable}>
        <table>
          <thead>
            <tr>
              <th><TranslatableText text="Case ID" /></th>
              <th><TranslatableText text="User Name" /></th>
              <th><TranslatableText text="Lawyer Name" /></th>
              <th><TranslatableText text="Request Date" /></th>
              <th><TranslatableText text="Meeting Date" /></th>
              <th><TranslatableText text="Status" /></th>
              <th><TranslatableText text="Actions" /></th>
            </tr>
          </thead>
          <tbody>
            {data.consultationLog.map(consultation => (
              <tr key={consultation.id}>
                <td><strong>{consultation.id}</strong></td>
                <td>{consultation.userName}</td>
                <td>{consultation.lawyerName}</td>
                <td>{consultation.requestDate}</td>
                <td>{consultation.meetingDate || 'Not scheduled'}</td>
                <td>
                  <span 
                    className={`${styles.statusBadge} ${styles[consultation.status.toLowerCase()]}`}
                  >
                    {consultation.status}
                  </span>
                </td>
                <td>
                  <button className={styles.actionButton}>
                    <TranslatableText text="View Details" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Consultation Statistics */}
      <div className={styles.consultationStats}>
        <div className={styles.statCard}>
          <h4><TranslatableText text="Total Consultations" /></h4>
          <span className={styles.statNumber}>{data.consultationLog.length}</span>
        </div>
        <div className={styles.statCard}>
          <h4><TranslatableText text="Completed" /></h4>
          <span className={styles.statNumber}>
            {data.consultationLog.filter(c => c.status === 'Completed').length}
          </span>
        </div>
        <div className={styles.statCard}>
          <h4><TranslatableText text="Scheduled" /></h4>
          <span className={styles.statNumber}>
            {data.consultationLog.filter(c => c.status === 'Scheduled').length}
          </span>
        </div>
        <div className={styles.statCard}>
          <h4><TranslatableText text="Pending" /></h4>
          <span className={styles.statNumber}>
            {data.consultationLog.filter(c => c.status === 'Pending').length}
          </span>
        </div>
      </div>
    </div>
  );

  const renderLawyerPerformance = () => (
    <div className={styles.lawyerPerformanceContent}>
      <div className={styles.performanceHeader}>
        <h3><TranslatableText text="Lawyer Performance Analytics" /></h3>
        <div className={styles.performanceFilters}>
          <select className={styles.filterSelect}>
            <option value="all">All Lawyers</option>
            <option value="below-80">Below 80% Acceptance</option>
            <option value="above-90">Above 90% Acceptance</option>
          </select>
          <input
            type="text"
            placeholder="Search lawyers..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.performanceTable}>
        <table>
          <thead>
            <tr>
              <th><TranslatableText text="Lawyer Name" /></th>
              <th><TranslatableText text="Total Requests" /></th>
              <th><TranslatableText text="Accepted" /></th>
              <th><TranslatableText text="Rejected" /></th>
              <th><TranslatableText text="Acceptance Rate" /></th>
              <th><TranslatableText text="Status" /></th>
              <th><TranslatableText text="Actions" /></th>
            </tr>
          </thead>
          <tbody>
            {data.lawyerPerformance.map(lawyer => (
              <tr key={lawyer.id}>
                <td><strong>{lawyer.name}</strong></td>
                <td>{lawyer.totalRequests}</td>
                <td>{lawyer.requestsAccepted}</td>
                <td>{lawyer.requestsRejected}</td>
                <td>
                  <span 
                    className={`${styles.acceptanceRate} ${lawyer.acceptanceRate < 80 ? styles.lowRate : ''}`}
                  >
                    {lawyer.acceptanceRate}%
                  </span>
                </td>
                <td>
                  {lawyer.acceptanceRate < 80 ? (
                    <span className={styles.warningStatus}>
                      <i className="fas fa-exclamation-triangle"></i>
                      Below Standard
                    </span>
                  ) : (
                    <span className={styles.goodStatus}>
                      <i className="fas fa-check-circle"></i>
                      Good Standing
                    </span>
                  )}
                </td>
                <td>
                  <button className={styles.actionButton}>
                    <TranslatableText text="View Profile" />
                  </button>
                  {lawyer.acceptanceRate < 80 && (
                    <button className={`${styles.actionButton} ${styles.warning}`}>
                      <TranslatableText text="Send Warning" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Summary */}
      <div className={styles.performanceSummary}>
        <div className={styles.summaryCard}>
          <h4><TranslatableText text="Average Acceptance Rate" /></h4>
          <span className={styles.summaryNumber}>
            {Math.round(
              data.lawyerPerformance.reduce((sum, lawyer) => sum + lawyer.acceptanceRate, 0) / 
              data.lawyerPerformance.length
            )}%
          </span>
        </div>
        <div className={styles.summaryCard}>
          <h4><TranslatableText text="Lawyers Below 80%" /></h4>
          <span className={`${styles.summaryNumber} ${styles.warning}`}>
            {data.lawyerPerformance.filter(l => l.acceptanceRate < 80).length}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <h4><TranslatableText text="Total Active Lawyers" /></h4>
          <span className={styles.summaryNumber}>
            {data.lawyerPerformance.length}
          </span>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'user-management':
        return renderUserManagement();
      case 'lawyer-management':
        return renderLawyerManagement();
      case 'content-management':
        return renderContentManagement();
      case 'consultation-management':
        return renderConsultationManagement();
      default:
        return renderOverview();
    }
  };

  if (!user || user.role !== 'admin') {
    return <div><TranslatableText text="Access Denied" /></div>;
  }

  return (
    <div className={styles.adminDashboard}>
      {/* Sidebar Navigation */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2><TranslatableText text="Admin Panel" /></h2>
          <p><TranslatableText text="Welcome" />, {user.name}</p>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navItem} ${activeSection === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <TranslatableText text="Dashboard Overview" />
          </button>
          <button 
            className={`${styles.navItem} ${activeSection === 'user-management' ? styles.active : ''}`}
            onClick={() => setActiveSection('user-management')}
          >
            <TranslatableText text="User Management" />
          </button>
          <button 
            className={`${styles.navItem} ${activeSection === 'lawyer-management' ? styles.active : ''}`}
            onClick={() => setActiveSection('lawyer-management')}
          >
            <TranslatableText text="Lawyer Management" />
          </button>
          <button 
            className={`${styles.navItem} ${activeSection === 'content-management' ? styles.active : ''}`}
            onClick={() => setActiveSection('content-management')}
          >
            <TranslatableText text="Content Management" />
          </button>
          <button 
            className={`${styles.navItem} ${activeSection === 'consultation-management' ? styles.active : ''}`}
            onClick={() => setActiveSection('consultation-management')}
          >
            <TranslatableText text="Consultation Management" />
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <TranslatableText text="Logout" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;