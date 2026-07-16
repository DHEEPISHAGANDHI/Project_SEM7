import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        <Login onClose={onClose} />
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
