import React, { useState } from 'react';
import styles from './ComplaintDrafter.module.css';

const ComplaintDrafter = ({ template, onBack }) => {
  const [formData, setFormData] = useState({
    templateType: '',
    complainantName: '',
    complainantAddress: '',
    complainantPhone: '',
    complainantEmail: '',
    respondentName: '',
    respondentAddress: '',
    incidentDate: '',
    incidentLocation: '',
    situation: '',
    damages: '',
    reliefSought: '',
    evidenceDetails: '',
    urgency: 'normal'
  });
  
  const [generatedComplaint, setGeneratedComplaint] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateComplaint = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with a more realistic delay
    setTimeout(() => {
      const complaint = generateComplaintText(formData, template);
      setGeneratedComplaint(complaint);
      setIsGenerating(false);
      setShowPreview(true);
    }, 3000);
  };

  const generateComplaintText = (data, template) => {
    const currentDate = new Date().toLocaleDateString('en-IN');
    
    return `
**COMPLAINT UNDER ${template.category.toUpperCase()} LAW**

**TO:**
The Honorable ${getAppropriateCourt(template.category)}

**SUBJECT:** ${data.templateType || template.title}

**Date:** ${currentDate}

**COMPLAINANT DETAILS:**
Name: ${data.complainantName}
Address: ${data.complainantAddress}
Phone: ${data.complainantPhone}
Email: ${data.complainantEmail}

**RESPONDENT DETAILS:**
Name/Entity: ${data.respondentName}
Address: ${data.respondentAddress}

**FACTS OF THE CASE:**

1. The complainant respectfully submits the following facts for your kind consideration and appropriate legal action.

2. On ${data.incidentDate}, at ${data.incidentLocation}, the following incident occurred:

${data.situation}

3. **Nature of Grievance:**
   The above incident/action by the respondent has caused significant distress and ${template.category.toLowerCase()} rights violation to the complainant.

4. **Damages/Loss Suffered:**
${data.damages}

5. **Evidence Available:**
${data.evidenceDetails}

**LEGAL GROUNDS:**

Based on the facts mentioned above, the respondent has violated:
${getLegalGrounds(template.category)}

**PRAYER/RELIEF SOUGHT:**

The complainant humbly prays that this Honorable ${getAppropriateCourt(template.category)} may be pleased to:

1. ${data.reliefSought}
2. Award appropriate compensation for the damages suffered
3. Direct the respondent to rectify the grievance immediately
4. Pass any other order(s) as deemed fit and proper in the interest of justice
5. Cost of the proceeding

**VERIFICATION:**

I, ${data.complainantName}, son/daughter/wife of _______, aged _____ years, residing at ${data.complainantAddress}, do hereby solemnly affirm and state that the contents of the above complaint are true to the best of my knowledge and belief and that I have not concealed any material fact.

**Place:** ${data.incidentLocation}
**Date:** ${currentDate}

**Signature of Complainant**
${data.complainantName}

---

**ANNEXURES:**
- Copy of relevant documents/evidence
- Copy of correspondence (if any)
- Any other supporting documents

**Note:** This is an AI-generated draft. Please review and customize according to your specific requirements and consult with a legal expert before filing.
    `.trim();
  };

  const getAppropriateCourt = (category) => {
    const courts = {
      'Consumer Rights': 'Consumer Disputes Redressal Commission',
      'Employment': 'Labor Court/Industrial Tribunal',
      'Property': 'Civil Court',
      'Family Law': 'Family Court',
      'Civil Rights': 'Civil Court/High Court',
      'Financial': 'Banking Ombudsman/Civil Court'
    };
    return courts[category] || 'Appropriate Court';
  };

  const getLegalGrounds = (category) => {
    const grounds = {
      'Consumer Rights': '- Consumer Protection Act, 2019\n- Sale of Goods Act, 1930\n- Indian Contract Act, 1872',
      'Employment': '- Industrial Disputes Act, 1947\n- Payment of Wages Act, 1936\n- Employees Provident Fund Act, 1952',
      'Property': '- Transfer of Property Act, 1882\n- Indian Easements Act, 1882\n- Registration Act, 1908',
      'Family Law': '- Hindu Marriage Act, 1955 (if applicable)\n- Indian Penal Code, 1860\n- Protection of Women from Domestic Violence Act, 2005',
      'Civil Rights': '- Indian Constitution Articles 14, 19, 21\n- Civil Rights Protection Act, 1955\n- Right to Information Act, 2005',
      'Financial': '- Banking Regulation Act, 1949\n- Negotiable Instruments Act, 1881\n- Consumer Protection Act, 2019'
    };
    return grounds[category] || 'Relevant applicable laws';
  };

  const downloadComplaint = (format) => {
    const element = document.createElement('a');
    const file = new Blob([generatedComplaint], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${template.category}_Complaint_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (showPreview) {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.previewHeader}>
          <h3>Generated Complaint Preview</h3>
          <div className={styles.previewActions}>
            <button 
              className={styles.editButton}
              onClick={() => setShowPreview(false)}
            >
              <i className="fas fa-edit"></i>
              Edit Details
            </button>
            <button 
              className={styles.downloadButton}
              onClick={() => downloadComplaint('txt')}
            >
              <i className="fas fa-download"></i>
              Download
            </button>
          </div>
        </div>
        
        <div className={styles.complaintPreview}>
          <pre>{generatedComplaint}</pre>
        </div>
        
        <div className={styles.previewFooter}>
          <div className={styles.disclaimer}>
            <i className="fas fa-exclamation-triangle"></i>
            <span>
              This is an AI-generated draft. Please review carefully and consult with a legal expert before filing in court.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.drafterContainer}>
      <div className={styles.drafterForm}>
        <div className={styles.formSection}>
          <h4>Select Template Type</h4>
          <div className={styles.formGroup}>
            <label htmlFor="templateType">Choose specific template *</label>
            <select
              id="templateType"
              name="templateType"
              value={formData.templateType}
              onChange={handleChange}
              required
            >
              <option value="">Select template type</option>
              {template.templates.map((temp, index) => (
                <option key={index} value={temp}>{temp}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formSection}>
          <h4>Complainant Information</h4>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="complainantName">Full Name *</label>
              <input
                type="text"
                id="complainantName"
                name="complainantName"
                value={formData.complainantName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="complainantPhone">Phone Number *</label>
              <input
                type="tel"
                id="complainantPhone"
                name="complainantPhone"
                value={formData.complainantPhone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="complainantAddress">Complete Address *</label>
            <textarea
              id="complainantAddress"
              name="complainantAddress"
              value={formData.complainantAddress}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter your complete address with pin code"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="complainantEmail">Email Address</label>
            <input
              type="email"
              id="complainantEmail"
              name="complainantEmail"
              value={formData.complainantEmail}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h4>Respondent Information</h4>
          <div className={styles.formGroup}>
            <label htmlFor="respondentName">Respondent Name/Company *</label>
            <input
              type="text"
              id="respondentName"
              name="respondentName"
              value={formData.respondentName}
              onChange={handleChange}
              required
              placeholder="Name of person/company against whom complaint is filed"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="respondentAddress">Respondent Address</label>
            <textarea
              id="respondentAddress"
              name="respondentAddress"
              value={formData.respondentAddress}
              onChange={handleChange}
              rows="3"
              placeholder="Address of the respondent (if known)"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h4>Incident Details</h4>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="incidentDate">Date of Incident *</label>
              <input
                type="date"
                id="incidentDate"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="incidentLocation">Location of Incident *</label>
              <input
                type="text"
                id="incidentLocation"
                name="incidentLocation"
                value={formData.incidentLocation}
                onChange={handleChange}
                required
                placeholder="Where did the incident occur?"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h4>Detailed Situation</h4>
          <div className={styles.formGroup}>
            <label htmlFor="situation">Describe Your Situation in Detail *</label>
            <textarea
              id="situation"
              name="situation"
              value={formData.situation}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Provide a detailed description of what happened, including all relevant facts, circumstances, and sequence of events..."
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="damages">Damages/Loss Suffered *</label>
            <textarea
              id="damages"
              name="damages"
              value={formData.damages}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the financial, physical, or emotional damages you have suffered..."
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="reliefSought">Relief/Remedy Sought *</label>
            <textarea
              id="reliefSought"
              name="reliefSought"
              value={formData.reliefSought}
              onChange={handleChange}
              required
              rows="4"
              placeholder="What specific action or compensation do you want from the respondent?"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="evidenceDetails">Evidence Available</label>
            <textarea
              id="evidenceDetails"
              name="evidenceDetails"
              value={formData.evidenceDetails}
              onChange={handleChange}
              rows="3"
              placeholder="List any documents, photos, witness details, or other evidence you have..."
            />
          </div>
        </div>

        <div className={styles.formFooter}>
          <div className={styles.warningNote}>
            <i className="fas fa-info-circle"></i>
            <span>
              Please ensure all information provided is accurate and truthful. False information in legal documents can have serious consequences.
            </span>
          </div>
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onBack}>
              <i className="fas fa-arrow-left"></i>
              Back to Templates
            </button>
            <button 
              type="button" 
              className={styles.generateButton}
              onClick={generateComplaint}
              disabled={isGenerating || !formData.complainantName || !formData.situation}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Generating Complaint...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i>
                  Generate Complaint
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDrafter;
