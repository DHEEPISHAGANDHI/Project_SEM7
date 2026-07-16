import React from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentTemplates = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button onClick={() => navigate('/')}> Back to Home</button>
      <h1>Document Templates</h1>
      <p>This page is under development.</p>
    </div>
  );
};

export default DocumentTemplates;
