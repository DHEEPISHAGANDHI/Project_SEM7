import React, { useState } from 'react';
import LawyerCard from './LawyerCard';
import MessageModal from './MessageModal';
import TranslatableText from './TranslatableText';
import styles from './ConsultationModal.module.css';

const ConsultationModal = ({ isOpen, onClose }) => {
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Sample lawyer data - in real app, this would come from an API
  const lawyers = [
    {
      id: 1,
      name: 'Adv. Priya Sharma',
      specialization: 'Family Law, Divorce Cases',
      experience: '8 years',
      location: 'Mumbai, Maharashtra',
      rating: 4.8,
      phone: '+91-9876543210',
      email: 'priya.sharma@legalaid.in',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: 'Available',
      consultationFee: 'Free (First 30 mins)',
      languages: ['Hindi', 'English', 'Marathi']
    },
    {
      id: 2,
      name: 'Adv. Rajesh Kumar',
      specialization: 'Criminal Law, Consumer Rights',
      experience: '12 years',
      location: 'Delhi',
      rating: 4.9,
      phone: '+91-9876543211',
      email: 'rajesh.kumar@legalaid.in',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: 'Available',
      consultationFee: 'Free (First 30 mins)',
      languages: ['Hindi', 'English', 'Punjabi']
    },
    {
      id: 3,
      name: 'Adv. Meera Nair',
      specialization: 'Property Law, Civil Disputes',
      experience: '6 years',
      location: 'Bangalore, Karnataka',
      rating: 4.7,
      phone: '+91-9876543212',
      email: 'meera.nair@legalaid.in',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b999?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: 'Busy',
      consultationFee: 'Free (First 30 mins)',
      languages: ['English', 'Malayalam', 'Kannada']
    },
    {
      id: 4,
      name: 'Adv. Amit Gupta',
      specialization: 'Labour Law, Employment Issues',
      experience: '10 years',
      location: 'Pune, Maharashtra',
      rating: 4.6,
      phone: '+91-9876543213',
      email: 'amit.gupta@legalaid.in',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: 'Available',
      consultationFee: 'Free (First 30 mins)',
      languages: ['Hindi', 'English', 'Marathi']
    },
    {
      id: 5,
      name: 'Adv. Sunita Reddy',
      specialization: 'Women Rights, Domestic Violence',
      experience: '9 years',
      location: 'Hyderabad, Telangana',
      rating: 4.9,
      phone: '+91-9876543214',
      email: 'sunita.reddy@legalaid.in',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: 'Available',
      consultationFee: 'Free (First 30 mins)',
      languages: ['Telugu', 'English', 'Hindi']
    },
    {
      id: 6,
      name: 'Adv. Vikram Singh',
      specialization: 'Corporate Law, Business Disputes',
      experience: '15 years',
      location: 'Chennai, Tamil Nadu',
      rating: 4.8,
      phone: '+91-9876543215',
      email: 'vikram.singh@legalaid.in',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      availability: 'Available',
      consultationFee: 'Free (First 30 mins)',
      languages: ['Tamil', 'English', 'Hindi']
    }
  ];

  const handleContactLawyer = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowMessageModal(true);
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setSelectedLawyer(null);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2><TranslatableText text="Free Legal Consultation" /></h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.consultationInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <i className="fas fa-clock"></i>
              </div>
              <div className={styles.infoContent}>
                <h3><TranslatableText text="Free 30-minute Consultation" /></h3>
                <p><TranslatableText text="Get expert legal advice from qualified lawyers at no cost for your first consultation." /></p>
              </div>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className={styles.infoContent}>
                <h3><TranslatableText text="Confidential & Secure" /></h3>
                <p><TranslatableText text="All consultations are strictly confidential and protected by attorney-client privilege." /></p>
              </div>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <i className="fas fa-users"></i>
              </div>
              <div className={styles.infoContent}>
                <h3><TranslatableText text="Experienced Lawyers" /></h3>
                <p><TranslatableText text="Connect with verified lawyers specializing in various areas of law across India." /></p>
              </div>
            </div>
          </div>

          <div className={styles.lawyersSection}>
            <h3><TranslatableText text="Available Lawyers" /></h3>
            <div className={styles.lawyersGrid}>
              {lawyers.map((lawyer) => (
                <LawyerCard
                  key={lawyer.id}
                  lawyer={lawyer}
                  onContact={() => handleContactLawyer(lawyer)}
                />
              ))}
            </div>
          </div>
        </div>

        {showMessageModal && (
          <MessageModal
            lawyer={selectedLawyer}
            onClose={handleCloseMessageModal}
          />
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
