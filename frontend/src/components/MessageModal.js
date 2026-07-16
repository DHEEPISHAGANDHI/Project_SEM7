import React, { useState } from 'react';
import styles from './MessageModal.module.css';

const MessageModal = ({ lawyer, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    legalIssue: '',
    urgency: 'normal',
    issueDescription: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create consultation request
    const consultationRequest = {
      id: `REQ_${Date.now()}`,
      userId: 'current_user_id', // In real app, get from auth context
      userName: formData.name,
      userEmail: formData.email,
      userPhone: formData.phone,
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      legalIssue: formData.legalIssue,
      urgency: formData.urgency,
      issueDescription: formData.issueDescription,
      status: 'pending_approval', // pending_approval, accepted, rejected, scheduled, completed
      requestDate: new Date().toISOString(),
      rejectionReason: null
    };

    console.log('Consultation request submitted:', consultationRequest);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Auto close after success message
      setTimeout(() => {
        onClose();
      }, 4000);
    }, 2000);
  };

  if (!lawyer) return null;

  if (isSubmitted) {
    return (
      <div className={styles.messageOverlay} onClick={onClose}>
        <div className={styles.messageContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Consultation Request Submitted!</h3>
            <p>
              Your request for a <strong>free 30-minute consultation</strong> has been sent to <strong>{lawyer.name}</strong>.
            </p>
            <div className={styles.requestDetails}>
              <h4>What happens next?</h4>
              <div className={styles.nextSteps}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <div className={styles.stepContent}>
                    <strong>Lawyer Review</strong>
                    <p>{lawyer.name} will review your request within 24 hours</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <div className={styles.stepContent}>
                    <strong>Approval Notification</strong>
                    <p>You'll receive an email and dashboard notification with the decision</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <div className={styles.stepContent}>
                    <strong>Schedule Meeting</strong>
                    <p>If accepted, you can schedule your 30-minute consultation</p>
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.trackingInfo}>
              Track your request status in your <strong>User Dashboard</strong> under "My Consultations".
            </p>
            <button className={styles.closeSuccessButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.messageOverlay} onClick={onClose}>
      <div className={styles.messageContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.messageHeader}>
          <div className={styles.lawyerInfo}>
            <img src={lawyer.image} alt={lawyer.name} className={styles.lawyerAvatar} />
            <div>
              <h3>Request Free 30-Min Consultation</h3>
              <p>{lawyer.specialization}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form className={styles.messageForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h4>Consultation Request Information</h4>
            <div className={styles.consultationInfo}>
              <div className={styles.infoCard}>
                <i className="fas fa-clock"></i>
                <div>
                  <strong>Free 30-minute consultation</strong>
                  <p>Initial consultation at no cost</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <i className="fas fa-user-tie"></i>
                <div>
                  <strong>Experienced lawyer</strong>
                  <p>{lawyer.name} - {lawyer.specialization}</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <i className="fas fa-shield-alt"></i>
                <div>
                  <strong>Confidential</strong>
                  <p>Protected by attorney-client privilege</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h4>Your Information</h4>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h4>Legal Issue Details</h4>
            <div className={styles.formGroup}>
              <label htmlFor="legalIssue">Type of Legal Issue *</label>
              <select
                id="legalIssue"
                name="legalIssue"
                value={formData.legalIssue}
                onChange={handleChange}
                required
              >
                <option value="">Select legal issue type</option>
                <option value="family">Family Law / Divorce</option>
                <option value="criminal">Criminal Law</option>
                <option value="property">Property / Real Estate</option>
                <option value="consumer">Consumer Rights</option>
                <option value="employment">Employment / Labour</option>
                <option value="civil">Civil Disputes</option>
                <option value="corporate">Corporate / Business</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="urgency">Urgency Level</label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
              >
                <option value="low">Low - General inquiry</option>
                <option value="normal">Normal - Need consultation soon</option>
                <option value="high">High - Urgent matter</option>
                <option value="emergency">Emergency - Immediate help needed</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="issueDescription">Briefly describe your legal issue *</label>
              <textarea
                id="issueDescription"
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Please provide a brief description of your legal issue. This helps the lawyer understand if they can assist you effectively..."
              />
              <small className={styles.fieldNote}>
                This information helps {lawyer.name} determine if your case falls within their area of expertise.
              </small>
            </div>
          </div>

          <div className={styles.formFooter}>
            <div className={styles.privacyNote}>
              <i className="fas fa-shield-alt"></i>
              <span>All information is confidential and protected by attorney-client privilege</span>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting || !formData.name || !formData.email || !formData.phone || !formData.legalIssue || !formData.issueDescription}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Submit Consultation Request
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;
