import React from 'react';
import TranslatableText from './TranslatableText';
import styles from './LawyerCard.module.css';

const LawyerCard = ({ lawyer, onContact }) => {
  const getAvailabilityClass = (availability) => {
    return availability === 'Available' ? styles.available : styles.busy;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  return (
    <div className={styles.lawyerCard}>
      <div className={styles.lawyerHeader}>
        <div className={styles.lawyerImage}>
          <img src={lawyer.image} alt={lawyer.name} />
          <div className={`${styles.availabilityBadge} ${getAvailabilityClass(lawyer.availability)}`}>
            <TranslatableText text={lawyer.availability} />
          </div>
        </div>
        <div className={styles.lawyerBasicInfo}>
          <h4 className={styles.lawyerName}><TranslatableText text={lawyer.name} /></h4>
          <p className={styles.specialization}><TranslatableText text={lawyer.specialization} /></p>
          <div className={styles.rating}>
            <div className={styles.stars}>
              {renderStars(lawyer.rating)}
            </div>
            <span className={styles.ratingValue}>({lawyer.rating})</span>
          </div>
        </div>
      </div>

      <div className={styles.lawyerDetails}>
        <div className={styles.detailItem}>
          <i className="fas fa-briefcase"></i>
          <span><TranslatableText text={`${lawyer.experience} experience`} /></span>
        </div>
        <div className={styles.detailItem}>
          <i className="fas fa-map-marker-alt"></i>
          <span><TranslatableText text={lawyer.location} /></span>
        </div>
        <div className={styles.detailItem}>
          <i className="fas fa-money-bill-wave"></i>
          <span><TranslatableText text={lawyer.consultationFee} /></span>
        </div>
        <div className={styles.detailItem}>
          <i className="fas fa-language"></i>
          <span><TranslatableText text={lawyer.languages.join(', ')} /></span>
        </div>
      </div>

      <div className={styles.contactInfo}>
        <div className={styles.contactItem}>
          <i className="fas fa-phone"></i>
          <a href={`tel:${lawyer.phone}`} className={styles.contactLink}>
            {lawyer.phone}
          </a>
        </div>
        <div className={styles.contactItem}>
          <i className="fas fa-envelope"></i>
          <a href={`mailto:${lawyer.email}`} className={styles.contactLink}>
            {lawyer.email}
          </a>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button 
          className={styles.callButton}
          onClick={() => window.open(`tel:${lawyer.phone}`)}
        >
          <i className="fas fa-phone"></i>
          <TranslatableText text="Call Now" />
        </button>
        <button 
          className={styles.messageButton}
          onClick={() => onContact(lawyer)}
        >
          <i className="fas fa-comment"></i>
          <TranslatableText text="Send Message" />
        </button>
      </div>
    </div>
  );
};

export default LawyerCard;
