import React from 'react';
import TranslatableText from './TranslatableText';
import styles from './TopicCard.module.css';

const TopicCard = ({ icon, title, description, onLearnMore }) => {
  return (
    <div className={styles.topicCard}>
      <div className={styles.iconContainer}>
        <i className={icon}></i>
      </div>
      <h3 className={styles.title}><TranslatableText text={title} /></h3>
      <p className={styles.description}><TranslatableText text={description} /></p>
      <button 
        className={styles.learnMore} 
        onClick={() => onLearnMore && onLearnMore(title)}
      >
        <TranslatableText text="Learn More" /> <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default TopicCard;
