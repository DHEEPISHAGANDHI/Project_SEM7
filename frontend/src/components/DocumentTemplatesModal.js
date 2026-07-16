import React, { useState } from 'react';
import TemplateCard from './TemplateCard';
import ComplaintDrafter from './ComplaintDrafter';
import TranslatableText from './TranslatableText';
import styles from './DocumentTemplatesModal.module.css';

const DocumentTemplatesModal = ({ isOpen, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showComplaintDrafter, setShowComplaintDrafter] = useState(false);

  // Document template categories and types
  const documentTemplates = [
    {
      id: 1,
      category: 'Consumer Rights',
      title: 'Consumer Complaint',
      description: 'File complaints against defective products or poor services',
      icon: 'fas fa-shopping-cart',
      color: '#4caf50',
      templates: [
        'Defective Product Complaint',
        'Service Deficiency Complaint',
        'Overcharging Complaint',
        'False Advertisement Complaint'
      ]
    },
    {
      id: 2,
      category: 'Employment',
      title: 'Labor Dispute',
      description: 'Address workplace issues and employment disputes',
      icon: 'fas fa-briefcase',
      color: '#2196f3',
      templates: [
        'Wrongful Termination Complaint',
        'Salary/Wage Dispute',
        'Workplace Harassment Complaint',
        'Benefits Denial Complaint'
      ]
    },
    {
      id: 3,
      category: 'Property',
      title: 'Property Disputes',
      description: 'Handle property-related legal documents',
      icon: 'fas fa-home',
      color: '#ff9800',
      templates: [
        'Property Dispute Complaint',
        'Rent Recovery Notice',
        'Property Damage Claim',
        'Boundary Dispute Complaint'
      ]
    },
    {
      id: 4,
      category: 'Family Law',
      title: 'Family Matters',
      description: 'Documents for family-related legal issues',
      icon: 'fas fa-users',
      color: '#e91e63',
      templates: [
        'Domestic Violence Complaint',
        'Child Custody Petition',
        'Maintenance Claim',
        'Divorce Petition'
      ]
    },
    {
      id: 5,
      category: 'Civil Rights',
      title: 'Rights Violation',
      description: 'Address violations of fundamental rights',
      icon: 'fas fa-balance-scale',
      color: '#9c27b0',
      templates: [
        'Discrimination Complaint',
        'Police Complaint',
        'RTI Application',
        'Human Rights Violation'
      ]
    },
    {
      id: 6,
      category: 'Financial',
      title: 'Financial Disputes',
      description: 'Handle money and banking related issues',
      icon: 'fas fa-university',
      color: '#607d8b',
      templates: [
        'Bank Fraud Complaint',
        'Insurance Claim Dispute',
        'Loan Recovery Notice',
        'Cheque Bounce Complaint'
      ]
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowComplaintDrafter(true);
  };

  const handleBackToTemplates = () => {
    setShowComplaintDrafter(false);
    setSelectedTemplate(null);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            {showComplaintDrafter ? (
              <>
                <button className={styles.backButton} onClick={handleBackToTemplates}>
                  <i className="fas fa-arrow-left"></i>
                </button>
                <div>
                  <h2><TranslatableText text="Draft Complaint" /></h2>
                  <p><TranslatableText text={selectedTemplate?.category} /> - <TranslatableText text={selectedTemplate?.title} /></p>
                </div>
              </>
            ) : (
              <div>
                <h2><TranslatableText text="Legal Document Templates" /></h2>
                <p><TranslatableText text="Choose a template category to draft your legal complaint" /></p>
              </div>
            )}
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {showComplaintDrafter ? (
            <ComplaintDrafter 
              template={selectedTemplate}
              onBack={handleBackToTemplates}
            />
          ) : (
            <>
              <div className={styles.templateInfo}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className={styles.infoContent}>
                    <h3><TranslatableText text="AI-Powered Document Drafting" /></h3>
                    <p><TranslatableText text="Our AI system generates legal complaints based on your specific situation and requirements." /></p>
                  </div>
                </div>
                
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className={styles.infoContent}>
                    <h3><TranslatableText text="Legally Compliant" /></h3>
                    <p><TranslatableText text="All templates follow Indian legal standards and include necessary clauses and formats." /></p>
                  </div>
                </div>
                
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <i className="fas fa-download"></i>
                  </div>
                  <div className={styles.infoContent}>
                    <h3><TranslatableText text="Download & Customize" /></h3>
                    <p><TranslatableText text="Download your generated documents in PDF or Word format for further customization." /></p>
                  </div>
                </div>
              </div>

              <div className={styles.templatesSection}>
                <h3><TranslatableText text="Select Document Category" /></h3>
                <div className={styles.templatesGrid}>
                  {documentTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={() => handleTemplateSelect(template)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplatesModal;
