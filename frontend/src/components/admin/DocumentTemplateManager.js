import React, { useState } from 'react';
import TranslatableText from '../TranslatableText';
import styles from './DocumentTemplateManager.module.css';

const DocumentTemplateManager = () => {
  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: 'Rental Agreement', 
      category: 'Property', 
      downloads: 245,
      fileSize: '2.3 MB',
      uploadDate: '2024-11-15',
      status: 'Active'
    },
    { 
      id: 2, 
      name: 'Employment Contract', 
      category: 'Labor', 
      downloads: 189,
      fileSize: '1.8 MB',
      uploadDate: '2024-11-20',
      status: 'Active'
    },
    { 
      id: 3, 
      name: 'Consumer Complaint Form', 
      category: 'Consumer Rights', 
      downloads: 312,
      fileSize: '1.2 MB',
      uploadDate: '2024-12-01',
      status: 'Active'
    },
    { 
      id: 4, 
      name: 'Divorce Petition', 
      category: 'Family Law', 
      downloads: 98,
      fileSize: '3.1 MB',
      uploadDate: '2024-10-28',
      status: 'Inactive'
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: '',
    description: '',
    file: null
  });

  const categories = [
    'Property',
    'Labor',
    'Consumer Rights',
    'Family Law',
    'Criminal Law',
    'Business Law',
    'Tax Law',
    'Immigration'
  ];

  const handleUpload = (e) => {
    e.preventDefault();
    // Mock upload logic
    const template = {
      id: Date.now(),
      name: newTemplate.name,
      category: newTemplate.category,
      downloads: 0,
      fileSize: '2.1 MB', // Mock file size
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    
    setTemplates([template, ...templates]);
    setShowUploadModal(false);
    setNewTemplate({ name: '', category: '', description: '', file: null });
  };

  const handleStatusToggle = (id) => {
    setTemplates(templates.map(template => 
      template.id === id 
        ? { ...template, status: template.status === 'Active' ? 'Inactive' : 'Active' }
        : template
    ));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(template => template.id !== id));
    }
  };

  return (
    <div className={styles.templateManager}>
      <div className={styles.header}>
        <h3><TranslatableText text="Document Templates" /></h3>
        <button 
          className={styles.uploadButton}
          onClick={() => setShowUploadModal(true)}
        >
          <i className="fas fa-plus"></i>
          <TranslatableText text="Upload Template" />
        </button>
      </div>

      <div className={styles.templateGrid}>
        {templates.map(template => (
          <div key={template.id} className={styles.templateCard}>
            <div className={styles.templateHeader}>
              <div className={styles.templateIcon}>
                <i className="fas fa-file-pdf"></i>
              </div>
              <div className={styles.templateInfo}>
                <h4>{template.name}</h4>
                <p><TranslatableText text="Category:" /> {template.category}</p>
              </div>
              <div className={`${styles.status} ${styles[template.status.toLowerCase()]}`}>
                {template.status}
              </div>
            </div>
            
            <div className={styles.templateStats}>
              <div className={styles.stat}>
                <i className="fas fa-download"></i>
                <span>{template.downloads} <TranslatableText text="downloads" /></span>
              </div>
              <div className={styles.stat}>
                <i className="fas fa-file"></i>
                <span>{template.fileSize}</span>
              </div>
              <div className={styles.stat}>
                <i className="fas fa-calendar"></i>
                <span>{template.uploadDate}</span>
              </div>
            </div>

            <div className={styles.templateActions}>
              <button className={styles.actionButton}>
                <i className="fas fa-eye"></i>
                <TranslatableText text="Preview" />
              </button>
              <button className={styles.actionButton}>
                <i className="fas fa-edit"></i>
                <TranslatableText text="Edit" />
              </button>
              <button 
                className={`${styles.actionButton} ${template.status === 'Active' ? styles.warning : styles.success}`}
                onClick={() => handleStatusToggle(template.id)}
              >
                <i className={`fas fa-${template.status === 'Active' ? 'pause' : 'play'}`}></i>
                <TranslatableText text={template.status === 'Active' ? 'Deactivate' : 'Activate'} />
              </button>
              <button 
                className={`${styles.actionButton} ${styles.danger}`}
                onClick={() => handleDelete(template.id)}
              >
                <i className="fas fa-trash"></i>
                <TranslatableText text="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3><TranslatableText text="Upload New Template" /></h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowUploadModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleUpload} className={styles.uploadForm}>
              <div className={styles.formGroup}>
                <label><TranslatableText text="Template Name" /></label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  placeholder="Enter template name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label><TranslatableText text="Category" /></label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label><TranslatableText text="Description" /></label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  placeholder="Enter template description"
                  rows="3"
                />
              </div>

              <div className={styles.formGroup}>
                <label><TranslatableText text="File Upload" /></label>
                <div className={styles.fileUpload}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setNewTemplate({...newTemplate, file: e.target.files[0]})}
                    required
                  />
                  <p><TranslatableText text="Supported formats: PDF, DOC, DOCX" /></p>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>
                  <i className="fas fa-upload"></i>
                  <TranslatableText text="Upload Template" />
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowUploadModal(false)}
                >
                  <TranslatableText text="Cancel" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTemplateManager;
