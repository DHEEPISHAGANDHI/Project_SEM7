import React, { useState, useEffect, useRef } from 'react';
import { postQuery, transcribeAudio } from '../services/api'; 
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
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [userInput, setUserInput] = useState('');
  
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const cancelVoiceResultRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const supportsVoiceCapture = Boolean(
      navigator.mediaDevices?.getUserMedia &&
      window.MediaRecorder
    );

    setVoiceSupported(supportsVoiceCapture);
  }, []);

  useEffect(() => {
    return () => {
      cancelVoiceResultRef.current = true;

      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch (error) {
          console.warn('Failed to stop voice recorder during cleanup:', error);
        }
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen && isRecording) {
      cancelVoiceResultRef.current = true;
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch (error) {
          console.warn('Failed to stop voice recorder when chat closed:', error);
        }
      }
    }
  }, [isOpen, isRecording]);

  const quickReplies = [
    "What are my rights if I am arrested?",
    "How to file a consumer complaint?",
    "Explain the basic labor laws for employees"
  ];

  const stopVoiceStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const stopVoiceRecording = (cancelResult = false) => {
    cancelVoiceResultRef.current = cancelResult;

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
      return;
    }

    stopVoiceStream();
    setIsRecording(false);
  };

  const sendVoiceTranscript = async (audioBlob) => {
    setIsTranscribing(true);
    setVoiceError('');

    try {
      const response = await transcribeAudio(audioBlob);

      if (response.error) {
        setVoiceError(response.error);
        return;
      }

      const transcript = response.text?.trim();
      if (!transcript) {
        setVoiceError('No speech was detected. Please try again.');
        return;
      }

      setUserInput(transcript);
  await sendMessage(transcript, { allowWhileProcessing: true });
    } catch (error) {
      console.error('Voice transcription failed:', error);
      setVoiceError('Voice transcription failed. Please try again or type your question.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const startVoiceRecording = async () => {
    if (!voiceSupported) {
      setVoiceError('Voice input is not supported in this browser.');
      return;
    }

    if (isLoading || isTranscribing) {
      return;
    }

    try {
      setVoiceError('');
      cancelVoiceResultRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stopVoiceStream();
        setIsRecording(false);

        if (cancelVoiceResultRef.current) {
          cancelVoiceResultRef.current = false;
          audioChunksRef.current = [];
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        audioChunksRef.current = [];

        if (!audioBlob.size) {
          setVoiceError('No audio was captured. Please try again.');
          return;
        }

        await sendVoiceTranscript(audioBlob);
      };

      recorder.onerror = (event) => {
        console.error('Voice recorder error:', event.error);
        setVoiceError('Microphone capture failed. Please try again.');
        stopVoiceStream();
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Could not start voice recording:', error);
      setVoiceError('Could not access the microphone. Please check permissions.');
      stopVoiceStream();
      setIsRecording(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording(false);
      return;
    }

    startVoiceRecording();
  };

  const sendMessage = async (query, options = {}) => {
    const { allowWhileProcessing = false } = options;

    if (!query.trim()) return;
    if ((isRecording || isTranscribing) && !allowWhileProcessing) return;

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
      stopVoiceRecording(true);
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
              <div className={styles.inputRow}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask a legal question..."
                  className={styles.input}
                  disabled={isLoading || isTranscribing}
                />
                <button
                  type="button"
                  className={`${styles.voiceButton} ${isRecording ? styles.voiceButtonActive : ''}`}
                  onClick={toggleVoiceRecording}
                  disabled={!voiceSupported || isLoading || isTranscribing}
                  aria-pressed={isRecording}
                  aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
                  title={voiceSupported ? (isRecording ? 'Stop recording' : 'Speak your question') : 'Voice input not supported'}
                >
                  <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                </button>
                <button
                  type="submit"
                  className={styles.sendButton}
                  disabled={isLoading || isRecording || isTranscribing || !userInput.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>

              <div className={styles.voiceStatusRow}>
                {isRecording && (
                  <span className={styles.voiceStatus}>
                    <TranslatableText text="Listening... speak now." />
                  </span>
                )}
                {isTranscribing && (
                  <span className={styles.voiceStatus}>
                    <TranslatableText text="Transcribing your speech to text..." />
                  </span>
                )}
                {!voiceSupported && (
                  <span className={styles.voiceStatusMuted}>
                    <TranslatableText text="Voice input is unavailable in this browser. You can still type your question." />
                  </span>
                )}
                {voiceError && (
                  <span className={styles.voiceError}>{voiceError}</span>
                )}
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
