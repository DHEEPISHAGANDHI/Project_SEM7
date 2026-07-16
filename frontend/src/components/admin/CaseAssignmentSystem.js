import React, { useState } from 'react';
import TranslatableText from '../TranslatableText';
import styles from './CaseAssignmentSystem.module.css';

const CaseAssignmentSystem = () => {
  const [unassignedCases, setUnassignedCases] = useState([
    {
      id: 1,
      userId: 101,
      userName: 'Priya Sharma',
      userEmail: 'priya@email.com',
      subject: 'Property Dispute Resolution',
      category: 'Property Law',
      priority: 'High',
      description: 'Need help with a land ownership dispute with neighbors. The issue involves boundary demarcation and has been ongoing for 6 months.',
      submittedDate: '2024-12-10',
      estimatedComplexity: 'Medium',
      locationState: 'Delhi'
    },
    {
      id: 2,
      userId: 102,
      userName: 'Rajesh Kumar',
      userEmail: 'rajesh@email.com',
      subject: 'Employment Contract Issues',
      category: 'Labor Law',
      priority: 'Medium',
      description: 'Facing issues with employment termination notice period and salary dues. Employer is not following proper procedures.',
      submittedDate: '2024-12-09',
      estimatedComplexity: 'Low',
      locationState: 'Maharashtra'
    },
    {
      id: 3,
      userId: 103,
      userName: 'Anita Verma',
      userEmail: 'anita@email.com',
      subject: 'Consumer Protection Case',
      category: 'Consumer Rights',
      priority: 'Low',
      description: 'Defective product purchased online, seller refusing refund or replacement despite warranty period being valid.',
      submittedDate: '2024-12-08',
      estimatedComplexity: 'Low',
      locationState: 'Karnataka'
    },
    {
      id: 4,
      userId: 104,
      userName: 'Deepak Singh',
      userEmail: 'deepak@email.com',
      subject: 'Divorce and Child Custody',
      category: 'Family Law',
      priority: 'High',
      description: 'Seeking divorce and child custody. Spouse is not cooperating and there are concerns about child welfare.',
      submittedDate: '2024-12-07',
      estimatedComplexity: 'High',
      locationState: 'Uttar Pradesh'
    }
  ]);

  const [availableLawyers, setAvailableLawyers] = useState([
    {
      id: 1,
      name: 'Advocate Sarah Patel',
      specializations: ['Property Law', 'Real Estate'],
      currentCases: 12,
      maxCases: 20,
      rating: 4.8,
      location: 'Delhi, Mumbai',
      experience: '8 years',
      languages: ['Hindi', 'English', 'Gujarati']
    },
    {
      id: 2,
      name: 'Senior Advocate Rakesh Kumar',
      specializations: ['Labor Law', 'Employment Rights'],
      currentCases: 8,
      maxCases: 15,
      rating: 4.9,
      location: 'Delhi, NCR',
      experience: '15 years',
      languages: ['Hindi', 'English', 'Punjabi']
    },
    {
      id: 3,
      name: 'Advocate Meena Gupta',
      specializations: ['Consumer Rights', 'Commercial Law'],
      currentCases: 5,
      maxCases: 18,
      rating: 4.7,
      location: 'Bangalore, Chennai',
      experience: '6 years',
      languages: ['English', 'Kannada', 'Tamil']
    },
    {
      id: 4,
      name: 'Advocate Rohit Sharma',
      specializations: ['Family Law', 'Matrimonial Disputes'],
      currentCases: 10,
      maxCases: 16,
      rating: 4.6,
      location: 'Lucknow, Kanpur',
      experience: '10 years',
      languages: ['Hindi', 'English']
    },
    {
      id: 5,
      name: 'Advocate Priya Reddy',
      specializations: ['Criminal Law', 'Civil Rights'],
      currentCases: 14,
      maxCases: 20,
      rating: 4.9,
      location: 'Hyderabad, Pune',
      experience: '12 years',
      languages: ['English', 'Telugu', 'Marathi']
    }
  ]);

  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const categories = ['Property Law', 'Labor Law', 'Consumer Rights', 'Family Law', 'Criminal Law'];
  const priorities = ['High', 'Medium', 'Low'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc2626';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'High': return '#7c3aed';
      case 'Medium': return '#2563eb';
      case 'Low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getLawyerAvailability = (currentCases, maxCases) => {
    const percentage = (currentCases / maxCases) * 100;
    if (percentage >= 90) return { status: 'Busy', color: '#dc2626' };
    if (percentage >= 70) return { status: 'Moderate', color: '#f59e0b' };
    return { status: 'Available', color: '#10b981' };
  };

  const getRecommendedLawyers = (caseData) => {
    if (!caseData) return [];
    
    return availableLawyers
      .filter(lawyer => 
        lawyer.specializations.some(spec => 
          spec.toLowerCase().includes(caseData.category.toLowerCase()) ||
          caseData.category.toLowerCase().includes(spec.toLowerCase())
        )
      )
      .sort((a, b) => {
        // Sort by availability and rating
        const aAvailability = (a.maxCases - a.currentCases) / a.maxCases;
        const bAvailability = (b.maxCases - b.currentCases) / b.maxCases;
        
        if (aAvailability !== bAvailability) {
          return bAvailability - aAvailability; // Higher availability first
        }
        
        return b.rating - a.rating; // Higher rating first
      });
  };

  const filteredCases = unassignedCases.filter(caseItem => {
    const categoryMatch = !filterCategory || caseItem.category === filterCategory;
    const priorityMatch = !filterPriority || caseItem.priority === filterPriority;
    return categoryMatch && priorityMatch;
  });

  const handleCaseSelect = (caseItem) => {
    setSelectedCase(caseItem);
    setSelectedLawyer(null);
  };

  const handleAssignCase = () => {
    if (!selectedCase || !selectedLawyer) {
      alert('Please select both a case and a lawyer');
      return;
    }

    // Update lawyer's case count
    setAvailableLawyers(lawyers => 
      lawyers.map(lawyer => 
        lawyer.id === selectedLawyer.id 
          ? { ...lawyer, currentCases: lawyer.currentCases + 1 }
          : lawyer
      )
    );

    // Remove case from unassigned list
    setUnassignedCases(cases => 
      cases.filter(caseItem => caseItem.id !== selectedCase.id)
    );

    setShowAssignmentModal(false);
    setSelectedCase(null);
    setSelectedLawyer(null);

    alert(`Case "${selectedCase.subject}" has been assigned to ${selectedLawyer.name}`);
  };

  return (
    <div className={styles.caseAssignment}>
      <div className={styles.header}>
        <h3><TranslatableText text="Case Assignment System" /></h3>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{unassignedCases.length}</span>
            <span className={styles.statLabel}><TranslatableText text="Unassigned Cases" /></span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{availableLawyers.filter(l => l.currentCases < l.maxCases).length}</span>
            <span className={styles.statLabel}><TranslatableText text="Available Lawyers" /></span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value=""><TranslatableText text="All Categories" /></option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <select 
          value={filterPriority} 
          onChange={(e) => setFilterPriority(e.target.value)}
          className={styles.filterSelect}
        >
          <option value=""><TranslatableText text="All Priorities" /></option>
          {priorities.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
      </div>

      <div className={styles.content}>
        {/* Cases List */}
        <div className={styles.casesSection}>
          <h4><TranslatableText text="Unassigned Cases" /></h4>
          <div className={styles.casesList}>
            {filteredCases.map(caseItem => (
              <div 
                key={caseItem.id} 
                className={`${styles.caseCard} ${selectedCase?.id === caseItem.id ? styles.selected : ''}`}
                onClick={() => handleCaseSelect(caseItem)}
              >
                <div className={styles.caseHeader}>
                  <h5>{caseItem.subject}</h5>
                  <div className={styles.caseTags}>
                    <span 
                      className={styles.priorityTag}
                      style={{ backgroundColor: getPriorityColor(caseItem.priority) }}
                    >
                      {caseItem.priority}
                    </span>
                    <span 
                      className={styles.complexityTag}
                      style={{ backgroundColor: getComplexityColor(caseItem.estimatedComplexity) }}
                    >
                      {caseItem.estimatedComplexity}
                    </span>
                  </div>
                </div>
                
                <div className={styles.caseInfo}>
                  <p><strong><TranslatableText text="Client:" /></strong> {caseItem.userName}</p>
                  <p><strong><TranslatableText text="Category:" /></strong> {caseItem.category}</p>
                  <p><strong><TranslatableText text="Location:" /></strong> {caseItem.locationState}</p>
                  <p><strong><TranslatableText text="Submitted:" /></strong> {caseItem.submittedDate}</p>
                </div>
                
                <div className={styles.caseDescription}>
                  <p>{caseItem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Details and Lawyer Assignment */}
        {selectedCase && (
          <div className={styles.assignmentSection}>
            <div className={styles.caseDetails}>
              <h4><TranslatableText text="Case Details" /></h4>
              <div className={styles.detailsContent}>
                <h5>{selectedCase.subject}</h5>
                <div className={styles.clientInfo}>
                  <p><strong><TranslatableText text="Client:" /></strong> {selectedCase.userName}</p>
                  <p><strong><TranslatableText text="Email:" /></strong> {selectedCase.userEmail}</p>
                  <p><strong><TranslatableText text="Location:" /></strong> {selectedCase.locationState}</p>
                </div>
                <p><strong><TranslatableText text="Description:" /></strong></p>
                <p>{selectedCase.description}</p>
              </div>
            </div>

            <div className={styles.lawyerSelection}>
              <h4><TranslatableText text="Recommended Lawyers" /></h4>
              <div className={styles.lawyersList}>
                {getRecommendedLawyers(selectedCase).map(lawyer => {
                  const availability = getLawyerAvailability(lawyer.currentCases, lawyer.maxCases);
                  return (
                    <div 
                      key={lawyer.id}
                      className={`${styles.lawyerCard} ${selectedLawyer?.id === lawyer.id ? styles.selected : ''}`}
                      onClick={() => setSelectedLawyer(lawyer)}
                    >
                      <div className={styles.lawyerHeader}>
                        <h5>{lawyer.name}</h5>
                        <span 
                          className={styles.availabilityStatus}
                          style={{ color: availability.color }}
                        >
                          {availability.status}
                        </span>
                      </div>
                      
                      <div className={styles.lawyerInfo}>
                        <p><strong><TranslatableText text="Experience:" /></strong> {lawyer.experience}</p>
                        <p><strong><TranslatableText text="Rating:" /></strong> {lawyer.rating}⭐</p>
                        <p><strong><TranslatableText text="Cases:" /></strong> {lawyer.currentCases}/{lawyer.maxCases}</p>
                        <p><strong><TranslatableText text="Location:" /></strong> {lawyer.location}</p>
                      </div>
                      
                      <div className={styles.specializations}>
                        <strong><TranslatableText text="Specializations:" /></strong>
                        <div className={styles.specTags}>
                          {lawyer.specializations.map(spec => (
                            <span key={spec} className={styles.specTag}>{spec}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.languages}>
                        <strong><TranslatableText text="Languages:" /></strong> {lawyer.languages.join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedLawyer && (
                <button 
                  className={styles.assignButton}
                  onClick={() => setShowAssignmentModal(true)}
                >
                  <i className="fas fa-user-check"></i>
                  <TranslatableText text="Assign Case" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Assignment Confirmation Modal */}
      {showAssignmentModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3><TranslatableText text="Confirm Case Assignment" /></h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAssignmentModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p><TranslatableText text="Are you sure you want to assign this case?" /></p>
              <div className={styles.assignmentSummary}>
                <div className={styles.summaryItem}>
                  <strong><TranslatableText text="Case:" /></strong> {selectedCase.subject}
                </div>
                <div className={styles.summaryItem}>
                  <strong><TranslatableText text="Client:" /></strong> {selectedCase.userName}
                </div>
                <div className={styles.summaryItem}>
                  <strong><TranslatableText text="Lawyer:" /></strong> {selectedLawyer.name}
                </div>
                <div className={styles.summaryItem}>
                  <strong><TranslatableText text="Specialization Match:" /></strong> ✓
                </div>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={handleAssignCase}>
                <i className="fas fa-check"></i>
                <TranslatableText text="Confirm Assignment" />
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowAssignmentModal(false)}
              >
                <TranslatableText text="Cancel" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseAssignmentSystem;
