import React, { useState } from 'react';
import './LegalHelplineDirectory.css';

const LegalHelplineDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    {
      title: 'Emergency & Safety',
      icon: '⚠️',
      bgColor: '#FF4444',
      items: [
        { name: 'Unified Emergency Number', number: '112', description: 'Police, Fire, Ambulance' },
        { name: 'Police Control Room', number: '100' },
        { name: 'Fire Service', number: '101' },
        { name: 'Ambulance', number: '102 / 108' },
      ]
    },
    {
      title: 'Women & Children',
      icon: '🛡️',
      bgColor: '#4CAF50',
      items: [
        { name: 'Women Helpline (all-India)', number: '181' },
        { name: 'Women Police Helpline', number: '1091' },
        { name: 'Childline (children in distress)', number: '1098' },
        { name: 'Missing Children & Women', number: '1094' },
      ]
    },
    {
      title: 'Cyber & Financial Fraud',
      icon: '💻',
      bgColor: '#2196F3',
      items: [
        { name: 'Cybercrime Helpline', number: '1930' },
        { name: 'National Cyber Crime Reporting Portal', number: 'cybercrime.gov.in', website: 'https://cybercrime.gov.in' },
      ]
    },
    {
      title: 'Mental Health & Counselling',
      icon: '🧠',
      bgColor: '#E91E63',
      items: [
        { name: 'Mental Health Helpline (Tele-MANAS)', number: '14416 / 1-800-891-4416' },
        { name: 'Kiran Mental Health Rehabilitation Helpline', number: '1800-599-0019' },
      ]
    },
    {
      title: 'Medical & Health',
      icon: '❤️',
      bgColor: '#FF5722',
      items: [
        { name: 'Health Ministry COVID-19 Helpline', number: '1075' },
        { name: 'AIDS Helpline', number: '1097' },
        { name: 'Blood Requirement Helpline', number: '104' },
      ]
    },
    {
      title: 'Road Safety & Transport',
      icon: '🚗',
      bgColor: '#607D8B',
      items: [
        { name: 'Road Accident Emergency Service', number: '1073' },
        { name: 'Highway Emergency', number: '1033' },
      ]
    },
    {
      title: 'Legal Assistance',
      icon: '⚖️',
      bgColor: '#795548',
      items: [
        { name: 'NALSA Legal Aid Helpline', number: '15100', description: 'Free legal aid across India' },
      ]
    },
    {
      title: 'Disaster & Crisis',
      icon: '🌪️',
      bgColor: '#FF9800',
      items: [
        { name: 'Disaster Management Helpline', number: '108 / 1070' },
        { name: 'Earthquake/Flood/Disaster Relief (NDMA)', number: '011-26701700 / 26701728' },
      ]
    },
    {
      title: 'Utility & Civic Services',
      icon: '🔧',
      bgColor: '#9C27B0',
      items: [
        { name: 'Gas Leakage Emergency', number: '1906' },
        { name: 'Electricity Complaints', number: 'varies by state' },
        { name: 'Water Supply Complaints', number: 'varies by city/state' },
      ]
    },
    {
      title: 'Environment & Animals',
      icon: '🌿',
      bgColor: '#4CAF50',
      items: [
        { name: 'Wildlife Crime Control Bureau', number: '1800-11-0999' },
      ]
    }
  ];

  const stateWiseContacts = [
    { state: 'Andhra Pradesh', number: '0863-2341401' },
    { state: 'Arunachal Pradesh', number: '0360-2310999, 2310116–17' },
    { state: 'Assam', number: '0361-2601843 / 2516367' },
    { state: 'Bihar', number: '0612-2508943, 2508390' },
    { state: 'Chhattisgarh', number: '7974327660' },
    { state: 'Goa', number: '0832-2492614, 2492664' },
    { state: 'Gujarat', number: '1800-233-7966, 079-27664964 / 27665296' },
    { state: 'Haryana', number: '0172-2583309 / 2586309 / 2561309 / 2562309' },
    { state: 'Himachal Pradesh', number: '0177-2623862, 2626962' },
    { state: 'Jammu & Kashmir', number: 'Jammu: 0191-2539962 / 2539679, Srinagar: 0194-2480408 / 2476945' },
    { state: 'Jharkhand', number: '0651-2481520 / 2482392, 2482397' },
    { state: 'Karnataka', number: '080-22111875 / 22111714, 22111716' },
    { state: 'Kerala', number: '0484-2396717 / 2562919 / 2395717' },
    { state: 'Madhya Pradesh', number: '0761-2678352 / 2627370' },
    { state: 'Maharashtra', number: '022-22691395 / 22691358' },
    { state: 'Manipur', number: '9436239666' },
    { state: 'Meghalaya', number: '0364-2501051' },
    { state: 'Mizoram', number: '0389-2336621' },
    { state: 'Nagaland', number: '0370-2290153' },
    { state: 'Odisha', number: '0671-2307678 / 2304389 / 2307071' },
    { state: 'Punjab', number: '0172-2216690 / 2216750' },
    { state: 'Rajasthan', number: '0141-2227481' },
    { state: 'Sikkim', number: '03592-207753' },
    { state: 'Tamil Nadu', number: '044-25342834, 044-25343353 / 25343144, 044-25342441' },
    { state: 'Telangana', number: '040-23446725' },
    { state: 'Tripura', number: '0381-2322481' },
    { state: 'Uttar Pradesh', number: '0522-2286395 / 2287972' },
    { state: 'Uttarakhand', number: '05942-236762, 236552' },
    { state: 'West Bengal', number: '033-22483892' },
    { state: 'Andaman & Nicobar Islands', number: '03192-232835, 09476035538' },
    { state: 'Chandigarh (UT)', number: '0172-2742999, +91-7087-112-348' },
    { state: 'Dadra & Nagar Haveli', number: '0260-2641337' },
    { state: 'Daman & Diu', number: '0260-2230887' },
    { state: 'Delhi (NCT)', number: '011-23232781' },
    { state: 'Lakshadweep', number: '04896-263422' },
    { state: 'Puducherry (UT)', number: '0413-2338831' },
  ];

  const filteredCategories = categories.filter(category => {
    if (selectedCategory !== 'all' && category.title.toLowerCase().replace(/\s+/g, '') !== selectedCategory) {
      return false;
    }
    
    if (searchTerm) {
      return category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             category.items.some(item =>
               item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.number.toLowerCase().includes(searchTerm.toLowerCase())
             );
    }
    
    return true;
  });

  return (
    <div className="helpline-container">
      <header className="helpline-header">
        <h1 className="helpline-title">Legal Helpline Directory</h1>
        <p className="helpline-subtitle">Emergency & Legal Assistance Numbers - Available 24/7</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search helplines or states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-tabs">
          <button
            className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.title}
              className={`category-tab ${selectedCategory === category.title.toLowerCase().replace(/\s+/g, '') ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.title.toLowerCase().replace(/\s+/g, ''))}
            >
              {category.icon} {category.title}
            </button>
          ))}
        </div>
      </header>

      <main className="helpline-main">
        {/* Emergency Section */}
        {(selectedCategory === 'all' || selectedCategory === 'emergency&safety') && (
          <div className="emergency-section">
            <h2 className="emergency-title">
              ⚠️ Emergency Numbers - Call Immediately
            </h2>
            <div className="emergency-grid">
              {categories[0].items.map((item, index) => (
                <div key={index} className="emergency-card">
                  <div className="emergency-card-title">{item.name}</div>
                  {item.description && (
                    <div className="emergency-card-description">{item.description}</div>
                  )}
                  <div className="emergency-number">
                    📞 {item.number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Categories */}
        <div className="categories-grid">
          {filteredCategories.slice(1).map((category, categoryIndex) => (
            <div key={categoryIndex} className="category-card">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3 className="category-title">{category.title}</h3>
              </div>
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="helpline-item">
                  <div className="helpline-info">
                    <div className="helpline-name">{item.name}</div>
                    {item.description && (
                      <div className="helpline-description">{item.description}</div>
                    )}
                  </div>
                  <div className="helpline-number">
                    📞 {item.number}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* State-wise Legal Services */}
        <div className="state-wise-section">
          <h2 className="state-wise-title">
            📍 State-wise Legal Services Authority (SLSA) Contacts
          </h2>
          <div className="state-grid">
            {stateWiseContacts
              .filter(state =>
                !searchTerm ||
                state.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                state.number.includes(searchTerm)
              )
              .map((state, index) => (
              <div key={index} className="state-card">
                <div className="state-name">
                  📍 {state.state}
                </div>
                <div className="state-number">{state.number}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="helpline-footer">
        <div className="footer-title">⚠️ Important Information</div>
        <div className="footer-text">
          Most helplines are available 24/7. In case of emergency, always call the unified emergency number <strong>112</strong> first.
          For legal aid, NALSA helpline <strong>15100</strong> connects you to free legal assistance nationwide.
          <br /><br />
          Keep these numbers saved in your phone. Share this resource with others who might need legal or emergency assistance.
        </div>
      </footer>
    </div>
  );
};

export default LegalHelplineDirectory;