import React, { useState } from 'react';
import TranslatableText from './TranslatableText';
import styles from './LegalTopicDetail.module.css';

const LegalTopicDetail = ({ isOpen, onClose, topic }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const topicContent = {
    'Property Rights': {
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
    },
    'Labor Rights': {
      title: 'Labor Rights in India',
      heroImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      overview: {
        description: 'Labor rights in India are comprehensive and protect workers across all sectors. Understanding these rights helps ensure fair treatment, proper wages, and safe working conditions for all employees.',
        keyPoints: [
          'Right to fair wages and timely payment',
          'Right to safe and healthy working conditions',
          'Right to form unions and collective bargaining',
          'Protection against discrimination and harassment'
        ]
      },
      sections: {
        wages: {
          title: 'Wages & Compensation Rights',
          content: [
            {
              subtitle: 'Minimum Wage Protection',
              text: 'Every worker in India is entitled to minimum wages as prescribed by the government for their category of work.',
              points: [
                'Minimum wages vary by state and type of work',
                'Regular revision of minimum wage rates',
                'Equal pay for equal work regardless of gender',
                'Overtime compensation for extra hours',
                'Timely payment of wages (within 7 days for weekly, 10 days for monthly)'
              ]
            },
            {
              subtitle: 'Salary and Benefits',
              text: 'Beyond basic wages, employees are entitled to various benefits and allowances.',
              points: [
                'Provident Fund (PF) contributions',
                'Employee State Insurance (ESI) benefits',
                'Gratuity after 5 years of service',
                'Bonus payments (minimum 8.33% of wages)',
                'Leave encashment and paid holidays'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        conditions: {
          title: 'Working Conditions & Safety',
          content: [
            {
              subtitle: 'Workplace Safety Rights',
              text: 'Employers must provide safe and healthy working conditions for all employees.',
              points: [
                'Safe machinery and equipment with proper guards',
                'Adequate lighting, ventilation, and cleanliness',
                'First aid facilities and medical checkups',
                'Safety training and protective equipment',
                'Compliance with Factories Act safety standards'
              ]
            },
            {
              subtitle: 'Working Hours & Rest',
              text: 'Labor laws regulate working hours to prevent exploitation and ensure adequate rest.',
              points: [
                'Maximum 8 hours per day, 48 hours per week',
                'Overtime payment for work beyond normal hours',
                'Weekly rest day (at least 24 consecutive hours)',
                'Annual leave and sick leave entitlements',
                'Restricted night work for women (varies by state)'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        termination: {
          title: 'Employment Termination & Job Security',
          content: [
            {
              subtitle: 'Wrongful Termination Protection',
              text: 'Employees are protected against arbitrary dismissal and have rights during termination.',
              points: [
                'Proper notice period before termination',
                'Valid reasons required for dismissal',
                'Right to be heard before termination',
                'Severance pay and gratuity entitlements',
                'Appeal rights for wrongful termination'
              ]
            },
            {
              subtitle: 'Retrenchment and Layoffs',
              text: 'Special protections exist for employees during organizational restructuring.',
              points: [
                'Government approval required for layoffs (100+ employees)',
                'Compensation as per Industrial Disputes Act',
                'Priority in re-employment if company expands',
                'Advance notice requirements for closure',
                'Worker participation in decision-making process'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        harassment: {
          title: 'Workplace Harassment & Discrimination',
          content: [
            {
              subtitle: 'Sexual Harassment Prevention',
              text: 'The Sexual Harassment of Women at Workplace Act, 2013 provides comprehensive protection.',
              points: [
                'Internal Complaints Committee (ICC) in every workplace',
                'External committee for smaller organizations',
                'Confidential complaint and inquiry process',
                'Protection against retaliation',
                'Immediate relief and interim measures'
              ]
            },
            {
              subtitle: 'Anti-Discrimination Rights',
              text: 'All employees have the right to work in an environment free from discrimination.',
              points: [
                'Equal treatment regardless of religion, caste, gender',
                'Protection against age and disability discrimination',
                'Equal opportunities for promotion and training',
                'Maternity and paternity leave rights',
                'Reasonable accommodations for disabilities'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2088&q=80'
        }
      },
      legalFramework: {
        title: 'Key Labor Laws',
        acts: [
          {
            name: 'Minimum Wages Act, 1948',
            description: 'Ensures minimum wage protection for all workers'
          },
          {
            name: 'Factories Act, 1948',
            description: 'Regulates working conditions in factories'
          },
          {
            name: 'Industrial Disputes Act, 1947',
            description: 'Governs employer-employee disputes and settlements'
          },
          {
            name: 'Code on Wages, 2019',
            description: 'Consolidates wage-related laws and ensures timely payment'
          }
        ]
      },
      faqs: [
        {
          question: 'What is the current minimum wage in India?',
          answer: 'Minimum wages vary by state and type of work. The central government has set a floor wage of ₹178 per day, but states can set higher rates.'
        },
        {
          question: 'Can an employer terminate without notice?',
          answer: 'No, employers must provide proper notice or pay in lieu of notice. The notice period depends on the employment contract and applicable labor laws.'
        },
        {
          question: 'What should I do if facing workplace harassment?',
          answer: 'Report to the Internal Complaints Committee (ICC) or External Committee. You can also file a police complaint for criminal offenses.'
        }
      ]
    },
    'Family Law': {
      title: 'Family Law in India',
      heroImage: 'https://images.unsplash.com/photo-1511895426328-dc8714efa8bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      overview: {
        description: 'Family law in India encompasses marriage, divorce, child custody, adoption, and inheritance matters. It varies based on personal laws of different religions while ensuring constitutional rights and gender equality.',
        keyPoints: [
          'Personal laws govern marriage and family matters',
          'Special Marriage Act provides secular option',
          'Equal rights for women in property and custody',
          'Protection against domestic violence'
        ]
      },
      sections: {
        marriage: {
          title: 'Marriage Laws & Rights',
          content: [
            {
              subtitle: 'Types of Marriage Laws',
              text: 'India recognizes different marriage laws based on religion and personal choice.',
              points: [
                'Hindu Marriage Act, 1955 (for Hindus, Buddhists, Sikhs, Jains)',
                'Muslim Personal Law (Shariat) Application Act, 1937',
                'Indian Christian Marriage Act, 1872',
                'Special Marriage Act, 1954 (secular, inter-faith marriages)',
                'Parsi Marriage and Divorce Act, 1936'
              ]
            },
            {
              subtitle: 'Marriage Rights and Obligations',
              text: 'Marriage creates legal rights and obligations for both spouses.',
              points: [
                'Right to maintenance and financial support',
                'Right to matrimonial property and residence',
                'Mutual respect and conjugal rights',
                'Right to adopt children jointly',
                'Inheritance rights in spouse\'s property'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        divorce: {
          title: 'Divorce Procedures & Rights',
          content: [
            {
              subtitle: 'Grounds for Divorce',
              text: 'Various grounds exist for seeking divorce under different personal laws.',
              points: [
                'Cruelty (physical or mental harassment)',
                'Adultery and extramarital relationships',
                'Desertion for continuous period',
                'Conversion to another religion',
                'Mental disorder or incurable disease',
                'Mutual consent of both parties'
              ]
            },
            {
              subtitle: 'Divorce Process and Rights',
              text: 'The divorce process involves several steps and protections for both parties.',
              points: [
                'Mediation and counseling attempts',
                'Maintenance during proceedings (interim)',
                'Permanent alimony after divorce',
                'Division of matrimonial property',
                'Child custody and visitation rights'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        custody: {
          title: 'Child Custody & Welfare',
          content: [
            {
              subtitle: 'Child Custody Principles',
              text: 'Child custody decisions are based on the best interests of the child.',
              points: [
                'Welfare of child is paramount consideration',
                'Preference for mother for children under 7 years',
                'Joint custody arrangements when suitable',
                'Child\'s own preference considered (mature children)',
                'Financial stability and moral character of parents'
              ]
            },
            {
              subtitle: 'Types of Custody',
              text: 'Courts can award different types of custody arrangements.',
              points: [
                'Physical custody - where child lives',
                'Legal custody - decision-making authority',
                'Joint custody - shared responsibilities',
                'Visitation rights for non-custodial parent',
                'Supervised visitation in special circumstances'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        inheritance: {
          title: 'Inheritance & Succession Rights',
          content: [
            {
              subtitle: 'Inheritance Laws',
              text: 'Inheritance rights vary based on religion and whether there is a will.',
              points: [
                'Hindu Succession Act - equal rights for daughters',
                'Muslim inheritance law based on Shariat',
                'Indian Succession Act for Christians and others',
                'Will and testament provisions',
                'Ancestral vs. self-acquired property rules'
              ]
            },
            {
              subtitle: 'Women\'s Inheritance Rights',
              text: 'Recent amendments have strengthened women\'s inheritance rights.',
              points: [
                'Equal share in ancestral property (Hindu law)',
                'Right to parental property by birth',
                'Widow\'s right to husband\'s property',
                'Daughter\'s coparcenary rights',
                'Protection against disinheritance'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        }
      },
      legalFramework: {
        title: 'Key Family Laws',
        acts: [
          {
            name: 'Hindu Marriage Act, 1955',
            description: 'Governs Hindu marriages, divorce, and related matters'
          },
          {
            name: 'Protection of Women from Domestic Violence Act, 2005',
            description: 'Protects women from domestic violence and abuse'
          },
          {
            name: 'Hindu Succession Act, 1956',
            description: 'Regulates inheritance and succession among Hindus'
          },
          {
            name: 'Guardians and Wards Act, 1890',
            description: 'Governs guardianship and custody of minor children'
          }
        ]
      },
      faqs: [
        {
          question: 'Can I get divorced without mutual consent?',
          answer: 'Yes, you can file for contested divorce on specific grounds like cruelty, adultery, or desertion. The court will examine evidence and decide.'
        },
        {
          question: 'Do daughters have equal inheritance rights?',
          answer: 'Yes, under the Hindu Succession Act, daughters have equal rights as sons in ancestral property since birth, not just from 2005 amendment.'
        },
        {
          question: 'How is child custody decided in divorce?',
          answer: 'Courts prioritize the child\'s welfare, considering factors like age, financial stability of parents, moral character, and child\'s own preference if mature.'
        }
      ]
    },
    'Consumer Rights': {
      title: 'Consumer Rights in India',
      heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2140&q=80',
      overview: {
        description: 'Consumer rights in India are protected under the Consumer Protection Act, 2019, which ensures fair trade practices, product safety, and compensation for defective goods and services.',
        keyPoints: [
          'Right to safety and product quality',
          'Right to information and informed choice',
          'Right to redressal and compensation',
          'Protection against unfair trade practices'
        ]
      },
      sections: {
        safety: {
          title: 'Product Safety & Quality Rights',
          content: [
            {
              subtitle: 'Right to Safety',
              text: 'Consumers have the fundamental right to products that are safe for life and health.',
              points: [
                'Products must meet safety standards and specifications',
                'Proper labeling with safety warnings and instructions',
                'Protection from hazardous or defective products',
                'Right to recall of dangerous products',
                'Compensation for injury caused by unsafe products'
              ]
            },
            {
              subtitle: 'Quality Assurance',
              text: 'Products and services must meet promised quality standards.',
              points: [
                'Products must match advertised specifications',
                'Services must be performed with due skill and care',
                'Right to replacement or refund for defective goods',
                'Warranty and guarantee protections',
                'Bureau of Indian Standards (BIS) certification requirements'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        information: {
          title: 'Right to Information & Choice',
          content: [
            {
              subtitle: 'Right to Information',
              text: 'Consumers have the right to complete and accurate information about products and services.',
              points: [
                'Clear labeling of ingredients and contents',
                'Pricing information and additional charges',
                'Terms and conditions of sale or service',
                'Manufacturing date, expiry date, and batch number',
                'Country of origin and manufacturer details'
              ]
            },
            {
              subtitle: 'Right to Choice',
              text: 'Consumers should have access to competitive markets and variety of products.',
              points: [
                'Freedom to choose from competing products',
                'No forced bundling or tie-in sales',
                'Right to cancel contracts within cooling-off period',
                'Protection against monopolistic practices',
                'Access to essential goods at fair prices'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        redressal: {
          title: 'Consumer Redressal Mechanisms',
          content: [
            {
              subtitle: 'Consumer Courts System',
              text: 'Three-tier consumer court system provides accessible justice to consumers.',
              points: [
                'District Consumer Disputes Redressal Commission (up to ₹1 crore)',
                'State Consumer Disputes Redressal Commission (₹1-10 crore)',
                'National Consumer Disputes Redressal Commission (above ₹10 crore)',
                'Simple procedures and consumer-friendly processes',
                'No court fees for complaints up to ₹5 lakh'
              ]
            },
            {
              subtitle: 'Alternative Dispute Resolution',
              text: 'Multiple avenues exist for resolving consumer disputes efficiently.',
              points: [
                'Mediation through consumer courts',
                'Company grievance redressal mechanisms',
                'Industry ombudsman services',
                'Online consumer complaint portals',
                'Consumer helplines and awareness programs'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        ecommerce: {
          title: 'E-commerce & Digital Consumer Rights',
          content: [
            {
              subtitle: 'Online Shopping Protection',
              text: 'Special protections exist for consumers shopping online.',
              points: [
                'Right to return/exchange within specified period',
                'Clear cancellation and refund policies',
                'Protection of personal and financial data',
                'Transparent pricing without hidden charges',
                'Liability of e-commerce platforms for seller defaults'
              ]
            },
            {
              subtitle: 'Digital Services Rights',
              text: 'Consumers have rights regarding digital services and platforms.',
              points: [
                'Right to data portability and deletion',
                'Protection against unauthorized charges',
                'Clear terms of service and privacy policies',
                'Right to grievance redressal mechanisms',
                'Protection against fake reviews and ratings'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        }
      },
      legalFramework: {
        title: 'Consumer Protection Laws',
        acts: [
          {
            name: 'Consumer Protection Act, 2019',
            description: 'Comprehensive law protecting consumer rights and providing redressal mechanisms'
          },
          {
            name: 'Legal Metrology Act, 2009',
            description: 'Ensures accuracy in weights, measures, and packaged commodities'
          },
          {
            name: 'Food Safety and Standards Act, 2006',
            description: 'Regulates food safety and quality standards'
          },
          {
            name: 'Information Technology Act, 2000',
            description: 'Protects consumers in digital transactions and e-commerce'
          }
        ]
      },
      faqs: [
        {
          question: 'How do I file a consumer complaint?',
          answer: 'You can file online at consumerhelpline.gov.in or visit the nearest consumer court. No lawyer is required, and it\'s free for complaints up to ₹5 lakh.'
        },
        {
          question: 'What compensation can I get for defective products?',
          answer: 'You can get refund, replacement, compensation for loss/injury, removal of defects, and costs. The amount depends on the nature and extent of loss.'
        },
        {
          question: 'Are online purchases covered under consumer protection?',
          answer: 'Yes, the Consumer Protection Act, 2019 specifically covers e-commerce transactions and provides additional protections for online consumers.'
        }
      ]
    },
    'Healthcare Rights': {
      title: 'Healthcare Rights in India',
      heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      overview: {
        description: 'Healthcare is a fundamental right in India, encompassing access to medical care, patient privacy, informed consent, and protection against medical negligence. Both public and private healthcare providers have obligations to patients.',
        keyPoints: [
          'Right to emergency medical care',
          'Right to informed consent and medical records',
          'Right to privacy and confidentiality',
          'Protection against medical negligence'
        ]
      },
      sections: {
        access: {
          title: 'Right to Healthcare Access',
          content: [
            {
              subtitle: 'Emergency Medical Care',
              text: 'Every person has the right to emergency medical treatment regardless of ability to pay.',
              points: [
                'No hospital can refuse emergency treatment',
                'Stabilization required before transfer to other facilities',
                'Right to ambulance services and emergency transport',
                'Free emergency care in government hospitals',
                'Protection against discrimination in emergency care'
              ]
            },
            {
              subtitle: 'Healthcare Insurance & Schemes',
              text: 'Various government schemes ensure healthcare access for different sections of society.',
              points: [
                'Ayushman Bharat scheme covering 50 crore people',
                'State government health insurance schemes',
                'Employee State Insurance (ESI) for workers',
                'Central Government Health Scheme (CGHS)',
                'Free treatment for Below Poverty Line families'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
        },
        consent: {
          title: 'Informed Consent & Patient Rights',
          content: [
            {
              subtitle: 'Informed Consent Requirements',
              text: 'Patients have the right to understand their medical condition and treatment options.',
              points: [
                'Explanation of diagnosis and prognosis',
                'Details of proposed treatment and alternatives',
                'Risks and benefits of treatment options',
                'Right to refuse or withdraw consent',
                'Special provisions for emergency situations'
              ]
            },
            {
              subtitle: 'Patient Autonomy Rights',
              text: 'Patients have the right to make decisions about their own medical care.',
              points: [
                'Right to seek second medical opinion',
                'Right to choose healthcare provider',
                'Right to participate in treatment decisions',
                'Right to advanced directives and living wills',
                'Right to discharge against medical advice'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=2089&q=80'
        },
        privacy: {
          title: 'Medical Privacy & Confidentiality',
          content: [
            {
              subtitle: 'Patient Confidentiality',
              text: 'Medical information is confidential and protected by law and medical ethics.',
              points: [
                'Doctor-patient privilege in legal proceedings',
                'Confidential treatment of medical records',
                'Limited disclosure only with patient consent',
                'Protection of sensitive health information',
                'Right to access and correct medical records'
              ]
            },
            {
              subtitle: 'Data Protection Rights',
              text: 'Patients have rights regarding their health data and medical records.',
              points: [
                'Right to obtain copies of medical records',
                'Right to data portability between healthcare providers',
                'Protection against unauthorized disclosure',
                'Right to correction of inaccurate medical records',
                'Secure storage and transmission of health data'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        negligence: {
          title: 'Medical Negligence & Compensation',
          content: [
            {
              subtitle: 'Medical Negligence Standards',
              text: 'Healthcare providers must meet professional standards of care.',
              points: [
                'Duty of care owed to patients',
                'Breach of professional standards',
                'Causation between negligence and harm',
                'Actual damage or injury to patient',
                'Bolam test for professional standards'
              ]
            },
            {
              subtitle: 'Remedies and Compensation',
              text: 'Patients can seek compensation for medical negligence through various forums.',
              points: [
                'Consumer courts for deficiency in medical services',
                'Civil courts for medical negligence claims',
                'State Medical Councils for professional misconduct',
                'Compensation for pain, suffering, and medical expenses',
                'Punitive damages in cases of gross negligence'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80'
        }
      },
      legalFramework: {
        title: 'Healthcare Legal Framework',
        acts: [
          {
            name: 'Consumer Protection Act, 2019',
            description: 'Covers medical services as consumer services for negligence claims'
          },
          {
            name: 'Indian Medical Council Act, 1956',
            description: 'Regulates medical profession and professional conduct'
          },
          {
            name: 'Mental Healthcare Act, 2017',
            description: 'Protects rights of persons with mental illness'
          },
          {
            name: 'Clinical Establishments Act, 2010',
            description: 'Regulates clinical establishments and ensures minimum standards'
          }
        ]
      },
      faqs: [
        {
          question: 'Can hospitals refuse treatment for inability to pay?',
          answer: 'No, hospitals cannot refuse emergency treatment. Government hospitals provide free emergency care, and private hospitals must stabilize patients before transfer.'
        },
        {
          question: 'How do I file a medical negligence complaint?',
          answer: 'You can file in consumer court (for service deficiency) or civil court (for negligence). State Medical Council can also take action against errant doctors.'
        },
        {
          question: 'Are my medical records confidential?',
          answer: 'Yes, medical records are confidential. Doctors can only disclose with your consent, court orders, or in specific legal circumstances like infectious diseases.'
        }
      ]
    },
    'Education Rights': {
      title: 'Education Rights in India',
      heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2122&q=80',
      overview: {
        description: 'Education is a fundamental right in India under Article 21A of the Constitution. The Right to Education Act ensures free and compulsory education for children aged 6-14 years, while various laws protect students from discrimination and ensure quality education.',
        keyPoints: [
          'Free and compulsory education for children aged 6-14',
          'Right to quality education and infrastructure',
          'Protection against discrimination and ragging',
          'Rights of students with disabilities'
        ]
      },
      sections: {
        fundamental: {
          title: 'Fundamental Right to Education',
          content: [
            {
              subtitle: 'Right to Free Education',
              text: 'Every child has the constitutional right to free and compulsory elementary education.',
              points: [
                'Free education in neighborhood schools',
                'No fees for tuition, uniforms, or textbooks',
                'Mid-day meal programs in government schools',
                'Transportation assistance for rural children',
                'Private school admission quota for disadvantaged children'
              ]
            },
            {
              subtitle: 'Quality Education Standards',
              text: 'Schools must meet minimum infrastructure and quality standards.',
              points: [
                'Adequate number of trained teachers',
                'Proper infrastructure including toilets and drinking water',
                'Age-appropriate curriculum and teaching methods',
                'Regular assessment without detention till Class 8',
                'School Management Committee with parent participation'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
        },
        discrimination: {
          title: 'Anti-Discrimination & Equal Access',
          content: [
            {
              subtitle: 'Protection Against Discrimination',
              text: 'Students have the right to education without discrimination on any grounds.',
              points: [
                'No discrimination based on caste, religion, or gender',
                'Equal treatment for all students regardless of background',
                'Special provisions for scheduled castes and tribes',
                'Protection against linguistic and cultural discrimination',
                'Inclusive education for children with disabilities'
              ]
            },
            {
              subtitle: 'Reservation and Affirmative Action',
              text: 'Various reservation policies ensure educational access for marginalized communities.',
              points: [
                'Reservation in higher education institutions',
                'Scholarship schemes for backward classes',
                'Special coaching and remedial programs',
                'Hostels and residential facilities',
                'Fee concessions and financial assistance'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
        },
        student: {
          title: 'Student Rights & Protection',
          content: [
            {
              subtitle: 'Anti-Ragging Measures',
              text: 'Students have the right to education in a safe environment free from ragging and harassment.',
              points: [
                'Zero tolerance policy for ragging in institutions',
                'Anti-ragging committees in all educational institutions',
                '24x7 helpline for reporting ragging incidents',
                'Severe punishment including expulsion for ragging',
                'Legal action under criminal law for serious cases'
              ]
            },
            {
              subtitle: 'Student Grievance Redressal',
              text: 'Mechanisms exist for addressing student complaints and grievances.',
              points: [
                'Student grievance committees in institutions',
                'Ombudsman for university-level complaints',
                'Right to appeal against unfair academic decisions',
                'Protection for student union activities and expression',
                'Due process in disciplinary proceedings'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        disabilities: {
          title: 'Rights of Students with Disabilities',
          content: [
            {
              subtitle: 'Inclusive Education Rights',
              text: 'Children with disabilities have the right to inclusive education in mainstream schools.',
              points: [
                'Right to education in neighborhood schools',
                'Reasonable accommodations and support services',
                'Accessible infrastructure and assistive technology',
                'Trained teachers and special educators',
                'Individual education plans based on needs'
              ]
            },
            {
              subtitle: 'Higher Education Access',
              text: 'Students with disabilities have enhanced rights in higher education.',
              points: [
                'Reservation in higher education institutions',
                'Relaxed eligibility criteria and extended time',
                'Accessible examination procedures',
                'Scholarship schemes and financial assistance',
                'Career counseling and placement support'
              ]
            }
          ],
          image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2132&q=80'
        }
      },
      legalFramework: {
        title: 'Education Legal Framework',
        acts: [
          {
            name: 'Right of Children to Free and Compulsory Education Act, 2009',
            description: 'Ensures free and compulsory education for children aged 6-14 years'
          },
          {
            name: 'Rights of Persons with Disabilities Act, 2016',
            description: 'Ensures inclusive education and accessibility for students with disabilities'
          },
          {
            name: 'University Grants Commission Act, 1956',
            description: 'Regulates higher education and maintains standards'
          },
          {
            name: 'Prohibition of Ragging Act (Various States)',
            description: 'Prohibits ragging in educational institutions and prescribes punishment'
          }
        ]
      },
      faqs: [
        {
          question: 'Is education really free for all children?',
          answer: 'Yes, elementary education (Classes I-VIII) is free and compulsory for all children aged 6-14 years in government and aided schools under RTE Act.'
        },
        {
          question: 'What can I do if my child faces discrimination in school?',
          answer: 'Report to school authorities, approach School Management Committee, file complaint with education department, or approach court for serious violations.'
        },
        {
          question: 'How are students with disabilities supported in education?',
          answer: 'They get reservation, reasonable accommodations, assistive technology, trained teachers, accessible infrastructure, and extended examination time.'
        }
      ]
    }
  };

  if (!isOpen || !topic || !topicContent[topic]) return null;

  const content = topicContent[topic];
  const sections = Object.keys(content.sections);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h1><TranslatableText text={content.title} /></h1>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.heroSection}>
          <img src={content.heroImage} alt={content.title} className={styles.heroImage} />
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <p><TranslatableText text={content.overview.description} /></p>
              <div className={styles.keyPoints}>
                {content.overview.keyPoints.map((point, index) => (
                  <div key={index} className={styles.keyPoint}>
                    <i className="fas fa-check-circle"></i>
                    <TranslatableText text={point} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.navigationTabs}>
          <button 
            className={`${styles.navTab} ${activeSection === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <TranslatableText text="Overview" />
          </button>
          {sections.map(section => (
            <button 
              key={section}
              className={`${styles.navTab} ${activeSection === section ? styles.active : ''}`}
              onClick={() => setActiveSection(section)}
            >
              <TranslatableText text={content.sections[section].title} />
            </button>
          ))}
          <button 
            className={`${styles.navTab} ${activeSection === 'legal' ? styles.active : ''}`}
            onClick={() => setActiveSection('legal')}
          >
            <TranslatableText text="Legal Framework" />
          </button>
          <button 
            className={`${styles.navTab} ${activeSection === 'faqs' ? styles.active : ''}`}
            onClick={() => setActiveSection('faqs')}
          >
            <TranslatableText text="FAQs" />
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeSection === 'overview' && (
            <div className={styles.overviewContent}>
              <h2><TranslatableText text="About This Topic" /></h2>
              <p><TranslatableText text={content.overview.description} /></p>
              <div className={styles.quickLinks}>
                <h3><TranslatableText text="Quick Navigation" /></h3>
                <div className={styles.quickLinksGrid}>
                  {sections.map(section => (
                    <button 
                      key={section}
                      className={styles.quickLinkCard}
                      onClick={() => setActiveSection(section)}
                    >
                      <h4><TranslatableText text={content.sections[section].title} /></h4>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {sections.includes(activeSection) && (
            <div className={styles.sectionContent}>
              <div className={styles.sectionHeader}>
                <h2><TranslatableText text={content.sections[activeSection].title} /></h2>
                <img 
                  src={content.sections[activeSection].image} 
                  alt={content.sections[activeSection].title}
                  className={styles.sectionImage}
                />
              </div>
              
              {content.sections[activeSection].content.map((item, index) => (
                <div key={index} className={styles.contentItem}>
                  <h3><TranslatableText text={item.subtitle} /></h3>
                  <p><TranslatableText text={item.text} /></p>
                  <ul className={styles.pointsList}>
                    {item.points.map((point, pointIndex) => (
                      <li key={pointIndex}>
                        <i className="fas fa-gavel"></i>
                        <TranslatableText text={point} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'legal' && (
            <div className={styles.legalContent}>
              <h2><TranslatableText text={content.legalFramework.title} /></h2>
              <div className={styles.actsGrid}>
                {content.legalFramework.acts.map((act, index) => (
                  <div key={index} className={styles.actCard}>
                    <h3><TranslatableText text={act.name} /></h3>
                    <p><TranslatableText text={act.description} /></p>
                    <div className={styles.actIcon}>
                      <i className="fas fa-balance-scale"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'faqs' && (
            <div className={styles.faqContent}>
              <h2><TranslatableText text="Frequently Asked Questions" /></h2>
              <div className={styles.faqList}>
                {content.faqs.map((faq, index) => (
                  <div key={index} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>
                      <i className="fas fa-question-circle"></i>
                      <TranslatableText text={faq.question} />
                    </h3>
                    <p className={styles.faqAnswer}>
                      <TranslatableText text={faq.answer} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalTopicDetail;
