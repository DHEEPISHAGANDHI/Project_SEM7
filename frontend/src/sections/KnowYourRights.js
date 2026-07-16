import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicCard from '../components/TopicCard';
import LegalTopicDetail from '../components/LegalTopicDetail';
import TranslatableText from '../components/TranslatableText';
import styles from './KnowYourRights.module.css';

const KnowYourRights = ({ topics = [] }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  const defaultTopics = [
    {
      icon: 'fas fa-home',
      title: 'Property Rights',
      description: 'Understand your rights related to property ownership, tenancy, and real estate transactions.'
    },
    {
      icon: 'fas fa-briefcase',
      title: 'Labor Rights',
      description: 'Learn about workplace rights, minimum wages, working conditions, and employee benefits.'
    },
    {
      icon: 'fas fa-users',
      title: 'Family Law',
      description: 'Navigate through marriage, divorce, child custody, and inheritance legal matters.'
    },
    {
      icon: 'fas fa-shopping-cart',
      title: 'Consumer Rights',
      description: 'Know your rights as a consumer, including product safety and fair trade practices.'
    },
    {
      icon: 'fas fa-heartbeat',
      title: 'Healthcare Rights',
      description: 'Understand your rights to healthcare access, medical privacy, and patient care.'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Education Rights',
      description: 'Learn about your right to education, school policies, and student protections.'
    }
  ];

  const displayTopics = topics.length > 0 ? topics : defaultTopics;

  const handleLearnMore = (topicTitle) => {
    if (topicTitle === 'Property Rights') {
      navigate('/property-rights');
    } else {
      setSelectedTopic(topicTitle);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTopic(null);
  };

  return (
    <section id="know-your-rights" className={`section ${styles.knowYourRights}`}>
      <div className="container">
        <h2 className="section-title"><TranslatableText text="Know Your Rights" /></h2>
        <p className="section-subtitle">
          <TranslatableText text="Explore different areas of law and understand your legal rights and protections" />
        </p>
        
        <div className={styles.topicsGrid}>
          {displayTopics.map((topic, index) => (
            <TopicCard
              key={index}
              icon={topic.icon}
              title={topic.title}
              description={topic.description}
              onLearnMore={handleLearnMore}
            />
          ))}
        </div>
      </div>

      <LegalTopicDetail
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        topic={selectedTopic}
      />
    </section>
  );
};

export default KnowYourRights;
