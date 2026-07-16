import React, { useState, useEffect, useRef } from 'react';
import styles from './VideoCallInterface.module.css';
import TranslatableText from './TranslatableText';

const VideoCallInterface = ({ 
  consultation, 
  onEndCall, 
  userRole = 'user' 
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callStartTimeRef = useRef(null);

  useEffect(() => {
    // Simulate connection process
    const connectionTimeout = setTimeout(() => {
      setIsConnecting(false);
      setIsCallActive(true);
      callStartTimeRef.current = Date.now();
    }, 3000);

    // Initialize media stream
    initializeMedia();

    return () => {
      clearTimeout(connectionTimeout);
      // Cleanup media streams
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simulate remote video stream
      setTimeout(() => {
        if (remoteVideoRef.current) {
          // In a real implementation, this would be the remote stream
          // For demo purposes, we'll use a placeholder
          remoteVideoRef.current.style.background = 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)';
        }
      }, 2000);

    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
  };

  const handleEndCall = () => {
    // Stop all media tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    setIsCallActive(false);
    onEndCall();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isConnecting) {
    return (
      <div className={styles.videoCallContainer}>
        <div className={styles.connectingOverlay}>
          <div className={styles.connectingSpinner}></div>
          <h3><TranslatableText text="Connecting to call..." /></h3>
          <p><TranslatableText text="Please wait while we establish the connection" /></p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.videoCallContainer}>
      <div className={styles.videoCallHeader}>
        <div className={styles.callInfo}>
          <h3>
            {userRole === 'user' 
              ? consultation?.lawyerName 
              : consultation?.userName
            }
          </h3>
          <span className={styles.callDuration}>
            {formatTime(callDuration)}
          </span>
        </div>
        <div className={styles.callStatus}>
          <span className={styles.liveIndicator}>
            <div className={styles.liveDot}></div>
            <TranslatableText text="LIVE" />
          </span>
        </div>
      </div>

      <div className={styles.videoGrid}>
        {/* Remote Video (Lawyer/User) */}
        <div className={styles.remoteVideoContainer}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={styles.remoteVideo}
          />
          <div className={styles.remoteVideoOverlay}>
            <span className={styles.participantName}>
              {userRole === 'user' 
                ? consultation?.lawyerName 
                : consultation?.userName
              }
            </span>
          </div>
        </div>

        {/* Local Video (Self) */}
        <div className={styles.localVideoContainer}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`${styles.localVideo} ${!isVideoOn ? styles.videoOff : ''}`}
          />
          {!isVideoOn && (
            <div className={styles.videoOffOverlay}>
              <i className="fas fa-video-slash"></i>
            </div>
          )}
          <div className={styles.localVideoLabel}>
            <TranslatableText text="You" />
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className={styles.callControls}>
        <button
          className={`${styles.controlButton} ${isMuted ? styles.muted : ''}`}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
        </button>

        <button
          className={`${styles.controlButton} ${!isVideoOn ? styles.videoOff : ''}`}
          onClick={toggleVideo}
          title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
        >
          <i className={`fas ${isVideoOn ? 'fa-video' : 'fa-video-slash'}`}></i>
        </button>

        <button
          className={`${styles.controlButton} ${styles.endCall}`}
          onClick={handleEndCall}
          title="End Call"
        >
          <i className="fas fa-phone-slash"></i>
        </button>
      </div>

      {/* Chat Panel (optional) */}
      <div className={styles.chatPanel}>
        <div className={styles.chatToggle}>
          <button className={styles.chatButton}>
            <i className="fas fa-comment"></i>
            <TranslatableText text="Chat" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallInterface;