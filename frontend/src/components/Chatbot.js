import React, { useState, useEffect, useRef } from 'react';
import { postQuery } from '../services/api'; 
import TranslatableText from './TranslatableText';
import styles from './Chatbot.module.css';

const Chatbot = ({ isOpen: controlledOpen, onOpen, onClose }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const open = () => (onOpen ? onOpen() : setUncontrolledOpen(true));
  const close = () => (onClose ? onClose() : setUncontrolledOpen(false));

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your legal assistant. How can I help you today?", type: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const quickReplies = [
    "What are my rights if I am arrested?",
    "How to file a consumer complaint?",
    "Explain the basic labor laws for employees"
  ];

  const sendMessage = async (query) => {
    if (!query.trim()) return;

    const userMessage = { id: Date.now(), text: query, type: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setUserInput(''); // Clear input field immediately

    // Call the real API
    const apiResponse = await postQuery(query);
    
    let botMessageText;
    if (apiResponse.error) {
      // If there was an error, display it
      botMessageText = apiResponse.error;
    } else {
      // Format the response with sources
      const sourcesText = apiResponse.sources.length 
        ? `\n\n*Sources: ${apiResponse.sources.join(', ')}*` 
        : '';
      botMessageText = apiResponse.response + sourcesText;
    }

    const botMessage = {
      id: Date.now() + 1,
      text: botMessageText,
      type: 'bot'
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(userInput);
  };
  
  const handleQuickReply = (query) => {
    sendMessage(query);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div>
      <div className={styles.chatbotContainer}>
        <button className={styles.chatbotToggle} onClick={open}>
          <i className="fas fa-robot"></i>
          <span><TranslatableText text="Legal Assistant" /></span>
        </button>
      </div>

      {isOpen && (
        <div className={styles.panelOverlay} onClick={handleOverlayClick}>
          <aside className={styles.sidePanel}>
            <div className={styles.chatbotHeader}>
              <h3><TranslatableText text="Legal Assistant" /></h3>
              <button className={styles.closeButton} onClick={close}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className={styles.messagesContainer}>
              {messages.map((message) => (
                <div key={message.id} className={`${styles.message} ${styles[message.type]}`}>
                   {/* Using pre-wrap to respect newlines from the bot's response */}
                  <span style={{ whiteSpace: 'pre-wrap' }}>
                    <TranslatableText text={message.text} />
                  </span>
                </div>
              ))}
              
              {isLoading && (
                <div className={`${styles.message} ${styles.bot} ${styles.loading}`}>
                  <div className={styles.typingIndicator}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className={styles.quickReplies}>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className={styles.quickReplyButton}
                    onClick={() => handleQuickReply(reply)}
                  >
                    <TranslatableText text={reply} />
                  </button>
                ))}
              </div>
            )}

            <form className={styles.inputForm} onSubmit={handleSubmit}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask a legal question..."
                className={styles.input}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={isLoading || !userInput.trim()}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Chatbot;