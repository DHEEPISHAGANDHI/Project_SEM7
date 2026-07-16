import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicCard from '../components/TopicCard';
import LegalTopicDetail from '../components/LegalTopicDetail';
import TranslatableText from '../components/TranslatableText';
import styles from './KnowYourRights.module.css';

const KnowYourRights = ({ topics = [] }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const defaultTopics = [
    { icon: 'fas fa-home', title: 'Property Rights', description: 'Understand your rights related to property ownership, tenancy, and real estate transactions.', category: 'civil' },
    { icon: 'fas fa-briefcase', title: 'Labor Rights', description: 'Learn about workplace rights, minimum wages, working conditions, and employee benefits.', category: 'work' },
    { icon: 'fas fa-users', title: 'Family Law', description: 'Navigate through marriage, divorce, child custody, and inheritance legal matters.', category: 'family' },
    { icon: 'fas fa-shopping-cart', title: 'Consumer Rights', description: 'Know your rights as a consumer, including product safety and fair trade practices.', category: 'civil' },
    { icon: 'fas fa-heartbeat', title: 'Healthcare Rights', description: 'Understand your rights to healthcare access, medical privacy, and patient care.', category: 'health' },
    { icon: 'fas fa-graduation-cap', title: 'Education Rights', description: 'Learn about your right to education, school policies, and student protections.', category: 'education' }
  ];

  const filters = [
    { id: 'all', label: 'All Topics' },
    { id: 'civil', label: 'Civil' },
    { id: 'work', label: 'Workplace' },
    { id: 'family', label: 'Family' },
    { id: 'health', label: 'Healthcare' },
    { id: 'education', label: 'Education' }
  ];

  const displayTopics = topics.length > 0 ? topics : defaultTopics;
  const filteredTopics = activeFilter === 'all'
    ? displayTopics
    : displayTopics.filter(t => t.category === activeFilter);

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
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span className="section-badge">
            <i className="fas fa-book-open" /> Legal Education
          </span>
          <h2 className="section-title"><TranslatableText text="Know Your Rights" /></h2>
          <p className="section-subtitle">
            <TranslatableText text="Explore different areas of law and understand your legal rights and protections" />
          </p>
        </div>

        <div className={`${styles.filterBar} reveal reveal-delay-1`}>
          {filters.map(f => (
            <button
              key={f.id}
              className={`${styles.filterBtn} ${activeFilter === f.id ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              <TranslatableText text={f.label} />
            </button>
          ))}
        </div>

        <div className={styles.topicsGrid}>
          {filteredTopics.map((topic, index) => (
            <div key={index} className={`reveal reveal-delay-${(index % 3) + 1}`}>
              <TopicCard
                icon={topic.icon}
                title={topic.title}
                description={topic.description}
                onLearnMore={handleLearnMore}
              />
            </div>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <p className={styles.emptyState}>
            <TranslatableText text="No topics found in this category." />
          </p>
        )}
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
