import React from 'react';
import TranslatableText from './TranslatableText';
import styles from './TestimonialCard.module.css';

const TestimonialCard = ({ photo, name, location, quote }) => {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.avatar}>
        <img src={photo} alt={name} className={styles.avatarImage} />
      </div>
      <div className={styles.content}>
        <p className={styles.quote}>"<TranslatableText text={quote} />"</p>
        <div className={styles.userInfo}>
          <h4 className={styles.name}><TranslatableText text={name} /></h4>
          <p className={styles.location}><TranslatableText text={location} /></p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
