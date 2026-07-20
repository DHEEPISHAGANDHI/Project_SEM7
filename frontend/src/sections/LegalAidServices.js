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
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop',
      title: 'Free Legal Consultation',
      description: 'Start with a free first conversation so you can understand your options before taking action.',
      actionText: 'Talk to a Lawyer',
      action: 'consultation',
      icon: 'fas fa-user-tie'
    },
    {
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
      title: 'Document Templates',
      description: 'Open practical legal templates for common procedures and everyday disputes.',
      actionText: 'Open Templates',
      action: 'templates',
      icon: 'fas fa-file-contract'
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      title: 'Local Legal Clinics',
      description: 'Find nearby legal aid clinics and organizations when you need in-person assistance.',
      actionText: 'Locate Clinics',
      action: 'clinics',
      icon: 'fas fa-map-location-dot'
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  const handleServiceAction = (action) => {
    switch (action) {
      case 'consultation': setIsConsultationModalOpen(true); break;
      case 'templates': setIsTemplatesModalOpen(true); break;
      case 'clinics': setIsClinicFinderOpen(true); break;
      default: break;
    }
  };

  return (
    <section id="legal-aid" className={`section ${styles.legalAidServices}`}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span className="section-badge">
            <i className="fas fa-hands-helping" /> Get Help
          </span>
          <TranslatableText
            text="Legal Aid Services"
            component="h2"
            className="section-title"
          />
          <TranslatableText
            text="Choose the next step that matches your issue, then move straight to a lawyer, a template, or a local clinic."
            component="p"
            className="section-subtitle"
          />
        </div>

        <div className={styles.servicesGrid}>
          {displayServices.map((service, index) => (
            <div key={index} className={`reveal reveal-delay-${index + 1}`}>
              <ServiceCard
                image={service.image}
                title={service.title}
                description={service.description}
                actionText={service.actionText}
                icon={service.icon}
                onAction={() => handleServiceAction(service.action)}
              />
            </div>
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
