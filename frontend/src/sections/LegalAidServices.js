import React, { useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import ConsultationModal from '../components/ConsultationModal';
import DocumentTemplatesModal from '../components/DocumentTemplatesModal';
import LegalClinicFinder from '../components/LegalClinicFinder';
import TranslatableText from '../components/TranslatableText';
import styles from './LegalAidServices.module.css';

const LegalAidServices = ({ services = [] }) => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isClinicFinderOpen, setIsClinicFinderOpen] = useState(false);

  const defaultServices = [
    {
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Free Legal Consultation',
      description: 'Get free initial consultation with experienced lawyers to understand your legal options.',
      actionText: 'Find a Lawyer',
      action: 'consultation'
    },
    {
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Document Templates',
      description: 'Access ready-to-use legal document templates for common legal procedures.',
      actionText: 'Browse Templates',
      action: 'templates'
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Local Legal Clinics',
      description: 'Find legal aid clinics and organizations in your area for in-person assistance.',
      actionText: 'Find Clinics',
      action: 'clinics'
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  const handleServiceAction = (action) => {
    switch (action) {
      case 'consultation':
        setIsConsultationModalOpen(true);
        break;
      case 'templates':
        setIsTemplatesModalOpen(true);
        break;
      case 'clinics':
        setIsClinicFinderOpen(true);
        break;
      default:
        break;
    }
  };
  return (
    <section id="legal-aid" className={`section ${styles.legalAidServices}`}>
      <div className="container">
        <TranslatableText
          text="Legal Aid Services"
          component="h2"
          className="section-title"
        />
        <TranslatableText
          text="Get practical help and connect with legal professionals to resolve your legal issues"
          component="p"
          className="section-subtitle"
        />
        
        <div className={styles.servicesGrid}>
          {displayServices.map((service, index) => (
            <ServiceCard
              key={index}
              image={service.image}
              title={service.title}
              description={service.description}
              actionText={service.actionText}
              onAction={() => handleServiceAction(service.action)}
            />
          ))}
        </div>
      </div>

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />
      
      <DocumentTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
      />

      <LegalClinicFinder
        isOpen={isClinicFinderOpen}
        onClose={() => setIsClinicFinderOpen(false)}
      />
    </section>
  );
};

export default LegalAidServices;
