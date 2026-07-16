import React from 'react';
import TranslatableText from './TranslatableText';
import styles from './TemplateCard.module.css';

const TemplateCard = ({ template, onSelect }) => {
  return (
    <div className={styles.templateCard} onClick={onSelect}>
      <div className={styles.templateHeader}>
        <div 
          className={styles.templateIcon}
          style={{ backgroundColor: template.color }}
        >
          <i className={template.icon}></i>
        </div>
        <div className={styles.templateInfo}>
          <h4 className={styles.templateTitle}><TranslatableText text={template.title} /></h4>
          <span className={styles.templateCategory}><TranslatableText text={template.category} /></span>
        </div>
      </div>
      
      <p className={styles.templateDescription}>
        <TranslatableText text={template.description} />
      </p>
      
      <div className={styles.templateTypes}>
        <h5><TranslatableText text="Available Templates:" /></h5>
        <ul>
          {template.templates.slice(0, 3).map((type, index) => (
            <li key={index}><TranslatableText text={type} /></li>
          ))}
          {template.templates.length > 3 && (
            <li className={styles.moreTemplates}>
              <TranslatableText text={`+${template.templates.length - 3} more...`} />
            </li>
          )}
        </ul>
      </div>
      
      <div className={styles.templateAction}>
        <button className={styles.selectButton}>
          <i className="fas fa-edit"></i>
          <TranslatableText text="Draft Document" />
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
