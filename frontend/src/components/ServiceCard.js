import React from 'react';
import TranslatableText from './TranslatableText';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ image, title, description, actionText, onAction }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onAction) {
      onAction();
    }
  };

  return (
    <div className={styles.serviceCard}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <TranslatableText
          text={title}
          component="h3"
          className={styles.title}
        />
        <TranslatableText
          text={description}
          component="p"
          className={styles.description}
        />
        <a href="#" className={styles.actionLink} onClick={handleClick}>
          <TranslatableText text={actionText} /> <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
