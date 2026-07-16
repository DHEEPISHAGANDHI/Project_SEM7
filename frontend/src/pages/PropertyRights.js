import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalLanguage } from '../contexts/GlobalLanguageContext';
import { TranslationProvider } from '../hooks/useTranslation';
import TranslatableText from '../components/TranslatableText';
import styles from './PropertyRights.module.css';

const PropertyRights = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { currentLanguage } = useGlobalLanguage();

  const propertyRightsData = {
    title: 'Property Rights in India',
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
    overview: {
      description: 'Property rights form the foundation of economic freedom and security in India. Understanding your rights as a property owner, tenant, or buyer is crucial for protecting your investments and avoiding legal disputes.',
      keyPoints: [
        'Constitutional protection under Article 300A',
        'Right to acquire, hold, and dispose of property',
        'Protection against arbitrary acquisition',
        'Equal rights for all citizens regardless of gender or religion'
      ]
    },
    sections: {
      ownership: {
        title: 'Property Ownership Rights',
        content: [
          {
            subtitle: 'Types of Ownership',
            text: 'Property can be owned individually, jointly, or through various legal entities. Understanding the type of ownership determines your rights and responsibilities.',
            points: [
              'Sole ownership - Complete control and responsibility',
              'Joint ownership - Shared rights with others',
              'Co-operative ownership - Through housing societies',
              'Company ownership - Through corporate entities'
            ]
          },
          {
            subtitle: 'Rights of Property Owners',
            text: 'As a property owner in India, you have several fundamental rights protected by law.',
            points: [
              'Right to use the property for lawful purposes',
              'Right to transfer or sell the property',
              'Right to lease or rent the property',
              'Right to mortgage the property',
              'Right to inherit and bequeath the property'
            ]
          }
        ],
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80'
      },
      tenancy: {
        title: 'Tenant Rights & Landlord Obligations',
        content: [
          {
            subtitle: 'Tenant Rights',
            text: 'Tenants in India enjoy several rights that protect them from unfair practices and ensure peaceful enjoyment of rented property.',
            points: [
              'Right to peaceful enjoyment without interference',
              'Right to basic amenities and maintenance',
              'Protection against arbitrary rent increases',
              'Right to reasonable notice before eviction',
              'Right to privacy and security deposit return'
            ]
          },
          {
            subtitle: 'Landlord Responsibilities',
            text: 'Landlords have legal obligations to maintain the property and respect tenant rights.',
            points: [
              'Provide habitable living conditions',
              'Maintain structural integrity and safety',
              'Ensure water and electricity connections',
              'Respect tenant privacy and entry rights',
              'Follow legal procedures for rent increases'
            ]
          }
        ],
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=2096&q=80'
      },
      transactions: {
        title: 'Real Estate Transactions',
        content: [
          {
            subtitle: 'Buying Property',
            text: 'Real estate transactions in India involve complex legal procedures that must be followed to ensure valid transfer of ownership.',
            points: [
              'Verify clear title and ownership documents',
              'Check for encumbrances and liens',
              'Ensure proper registration and stamp duty payment',
              'Obtain necessary approvals and clearances',
              'Conduct due diligence on property history'
            ]
          },
          {
            subtitle: 'Essential Documents',
            text: 'Several documents are crucial for any property transaction in India.',
            points: [
              'Sale deed or conveyance deed',
              'Title deeds and chain of ownership',
              'Encumbrance certificate',
              'Property tax receipts',
              'Building plan approvals',
              'Completion certificate from authorities'
            ]
          }
        ],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
      },
      disputes: {
        title: 'Property Disputes & Remedies',
        content: [
          {
            subtitle: 'Common Property Disputes',
            text: 'Property disputes are common in India and can arise from various circumstances.',
            points: [
              'Boundary and encroachment disputes',
              'Title and ownership conflicts',
              'Landlord-tenant disagreements',
              'Family property inheritance issues',
              'Builder-buyer conflicts in new projects'
            ]
          },
          {
            subtitle: 'Legal Remedies',
            text: 'Several legal remedies are available for resolving property disputes.',
            points: [
              'Civil suits for declaration of title',
              'Injunction orders to prevent illegal occupation',
              'Partition suits for joint property division',
              'Specific performance for breach of contract',
              'Alternative dispute resolution methods'
            ]
          }
        ],
        image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
      }
    },
    legalFramework: {
      title: 'Legal Framework',
      acts: [
        {
          name: 'Transfer of Property Act, 1882',
          description: 'Governs the transfer of property between living persons'
        },
        {
          name: 'Registration Act, 1908',
          description: 'Mandates registration of property transactions'
        },
        {
          name: 'Indian Stamp Act, 1899',
          description: 'Regulates stamp duty on property documents'
        },
        {
          name: 'Real Estate (Regulation and Development) Act, 2016',
          description: 'Protects home buyers and regulates real estate sector'
        }
      ]
    },
    faqs: [
      {
        question: 'Can property be acquired without registration?',
        answer: 'No, property transactions above ₹100 must be registered under the Registration Act, 1908. Unregistered property transfers are not legally valid.'
      },
      {
        question: 'What is the stamp duty on property purchase?',
        answer: 'Stamp duty varies by state, typically ranging from 3-10% of the property value. Some states offer reduced rates for women buyers.'
      },
      {
        question: 'How long does property registration take?',
        answer: 'Property registration typically takes 1-7 days depending on the state and completeness of documents.'
      }
    ]
  };

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'ownership', title: 'Property Ownership Rights' },
    { id: 'tenancy', title: 'Tenant Rights & Landlord Obligations' },
    { id: 'transactions', title: 'Real Estate Transactions' },
    { id: 'disputes', title: 'Property Disputes & Remedies' },
    { id: 'framework', title: 'Legal Framework' }
  ];

  return (
    <TranslationProvider initialLanguage={currentLanguage}>
      <div className={styles.propertyRights}>
        {/* Header */}
        <div className={styles.header}>
          <div className="container">
            <Link to="/" className={styles.backButton}>
              <i className="fas fa-arrow-left"></i>
              <TranslatableText text="Back to Home" />
            </Link>
          </div>
        </div>

      {/* Hero Section */}
      <div className={styles.hero} style={{ backgroundImage: `url(${propertyRightsData.heroImage})` }}>
        <div className={styles.heroOverlay}>
          <div className="container">
            <h1 className={styles.heroTitle}>
              <TranslatableText text={propertyRightsData.title} />
            </h1>
            <p className={styles.heroDescription}>
              <TranslatableText text={propertyRightsData.overview.description} />
            </p>
            <div className={styles.keyPoints}>
              {propertyRightsData.overview.keyPoints.map((point, index) => (
                <div key={index} className={styles.keyPoint}>
                  <i className="fas fa-check-circle"></i>
                  <TranslatableText text={point} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.navigation}>
        <div className="container">
          <div className={styles.navTabs}>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`${styles.navTab} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <TranslatableText text={section.title} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <div className="container">
          {activeSection === 'overview' && (
            <div className={styles.section}>
              <h2><TranslatableText text="Overview" /></h2>
              <p><TranslatableText text={propertyRightsData.overview.description} /></p>
              <div className={styles.keyPointsGrid}>
                {propertyRightsData.overview.keyPoints.map((point, index) => (
                  <div key={index} className={styles.keyPointCard}>
                    <i className="fas fa-shield-alt"></i>
                    <TranslatableText text={point} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'framework' && (
            <div className={styles.section}>
              <h2><TranslatableText text={propertyRightsData.legalFramework.title} /></h2>
              <div className={styles.actsGrid}>
                {propertyRightsData.legalFramework.acts.map((act, index) => (
                  <div key={index} className={styles.actCard}>
                    <div className={styles.actIcon}>
                      <i className="fas fa-gavel"></i>
                    </div>
                    <h3><TranslatableText text={act.name} /></h3>
                    <p><TranslatableText text={act.description} /></p>
                  </div>
                ))}
              </div>
              
              <div className={styles.faqSection}>
                <h3><TranslatableText text="Frequently Asked Questions" /></h3>
                <div className={styles.faqList}>
                  {propertyRightsData.faqs.map((faq, index) => (
                    <div key={index} className={styles.faqItem}>
                      <h4><TranslatableText text={faq.question} /></h4>
                      <p><TranslatableText text={faq.answer} /></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {propertyRightsData.sections[activeSection] && (
            <div className={styles.section}>
              <h2><TranslatableText text={propertyRightsData.sections[activeSection].title} /></h2>
              
              {propertyRightsData.sections[activeSection].image && (
                <div className={styles.sectionImage}>
                  <img 
                    src={propertyRightsData.sections[activeSection].image} 
                    alt={propertyRightsData.sections[activeSection].title}
                  />
                </div>
              )}

              <div className={styles.contentGrid}>
                {propertyRightsData.sections[activeSection].content.map((item, index) => (
                  <div key={index} className={styles.contentCard}>
                    <h3><TranslatableText text={item.subtitle} /></h3>
                    <p><TranslatableText text={item.text} /></p>
                    <ul className={styles.pointsList}>
                      {item.points.map((point, pointIndex) => (
                        <li key={pointIndex}>
                          <i className="fas fa-check"></i>
                          <TranslatableText text={point} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className={styles.footerNav}>
        <div className="container">
          <div className={styles.prevNext}>
            <button 
              className={styles.navButton}
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                if (currentIndex > 0) {
                  setActiveSection(sections[currentIndex - 1].id);
                }
              }}
              disabled={sections.findIndex(s => s.id === activeSection) === 0}
            >
              <i className="fas fa-chevron-left"></i>
              <TranslatableText text="Previous" />
            </button>
            
            <button 
              className={styles.navButton}
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                if (currentIndex < sections.length - 1) {
                  setActiveSection(sections[currentIndex + 1].id);
                }
              }}
              disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
            >
              <TranslatableText text="Next" />
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      </div>
    </TranslationProvider>
  );
};

export default PropertyRights;
