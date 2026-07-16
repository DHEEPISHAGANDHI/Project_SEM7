import React from 'react';
import TranslatableText from './TranslatableText';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ image, title, description, actionText, icon, onAction }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onAction) onAction();
  };

  return (
    <div className={styles.serviceCard}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} loading="lazy" />
        <div className={styles.imageOverlay} />
        {icon && (
          <div className={styles.iconBadge}>
            <i className={icon} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <TranslatableText text={title} component="h3" className={styles.title} />
        <TranslatableText text={description} component="p" className={styles.description} />
        <button className={styles.actionButton} onClick={handleClick}>
          <TranslatableText text={actionText} />
          <i className="fas fa-arrow-right" />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
