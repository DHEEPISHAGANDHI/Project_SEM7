import React from 'react';
import TestimonialCard from '../components/TestimonialCard';
import TranslatableText from '../components/TranslatableText';
import styles from './SuccessStories.module.css';

const SuccessStories = ({ testimonials = [] }) => {
  const defaultTestimonials = [
    {
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      name: 'Rajesh Kumar',
      location: 'Farmer, Uttar Pradesh',
      quote: 'LegalAid India helped me understand my land rights and resolve a property dispute that had been going on for years. The information was clear and in Hindi, which made all the difference.'
    },
    {
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop',
      name: 'Priya Sharma',
      location: 'Teacher, Maharashtra',
      quote: 'When I faced workplace discrimination, the chatbot guided me through my rights and connected me with a local lawyer. I got justice and my job back within months.'
    },
    {
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      name: 'Amit Patel',
      location: 'Small Business Owner, Gujarat',
      quote: 'The document templates saved me thousands of rupees in legal fees. I was able to draft proper contracts and agreements for my business without hiring expensive lawyers.'
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className={`section ${styles.successStories}`}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span className="section-badge">
            <i className="fas fa-heart" /> Real Impact
          </span>
          <h2 className="section-title"><TranslatableText text="Success Stories" /></h2>
          <p className="section-subtitle">
            <TranslatableText text="Real stories from people who found clearer answers, faster help, and peace of mind through LegalAid India" />
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {displayTestimonials.map((testimonial, index) => (
            <div key={index} className={`reveal reveal-delay-${index + 1}`}>
              <TestimonialCard
                photo={testimonial.photo}
                name={testimonial.name}
                location={testimonial.location}
                quote={testimonial.quote}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
