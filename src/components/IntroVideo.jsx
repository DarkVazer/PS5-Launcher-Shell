import React, { useState, useRef, useEffect } from 'react';
import './IntroVideo.css';

// Import video as asset
import IntroVideoFile from '/assets/intro.mp4';

const IntroVideo = ({ onComplete }) => {
  const [showPulsingIndicator, setShowPulsingIndicator] = useState(false);
  const [indicatorOpacity, setIndicatorOpacity] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;
      
      // Start slowing down and showing indicator 1 second before the end
      if (timeLeft <= 1 && timeLeft > 0) {
        // More gradual slowdown from 1 to 0.5 (less noticeable)
        const slowdownFactor = timeLeft; // 1 to 0
        video.playbackRate = 0.5 + (slowdownFactor * 0.5); // 0.5 to 1
        
        // Show indicator with smooth fade-in animation
        if (!showPulsingIndicator) {
          setShowPulsingIndicator(true);
        }
        
        // Smooth opacity transition from 0 to 1
        const opacity = 1 - timeLeft; // 0 to 1
        setIndicatorOpacity(opacity);
      }
    };

    const handleVideoEnd = () => {
      // Ensure indicator is fully visible at the end
      setShowPulsingIndicator(true);
      setIndicatorOpacity(1);
    };

    const handleVideoError = () => {
      // If video fails to load, show pulsing indicator immediately
      setShowPulsingIndicator(true);
      setIndicatorOpacity(1);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('error', handleVideoError);

    // Start video immediately when component mounts
    video.play().catch(() => {
      // If autoplay fails, show pulsing indicator
      setShowPulsingIndicator(true);
      setIndicatorOpacity(1);
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('error', handleVideoError);
    };
  }, [showPulsingIndicator]);

  useEffect(() => {
    if (!showPulsingIndicator) return;

    const handleInput = (e) => {
      // Handle keyboard input
      if (e.type === 'keydown') {
        onComplete();
        return;
      }
      
      // Handle gamepad input
      if (e.type === 'gamepadconnected' || e.type === 'gamepaddisconnected') {
        return;
      }
    };

    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
          // Check if any button is pressed
          for (let j = 0; j < gamepad.buttons.length; j++) {
            if (gamepad.buttons[j].pressed) {
              onComplete();
              return;
            }
          }
        }
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleInput);
    document.addEventListener('click', onComplete);
    
    // Check gamepad input periodically
    const gamepadInterval = setInterval(checkGamepad, 100);

    return () => {
      document.removeEventListener('keydown', handleInput);
      document.removeEventListener('click', onComplete);
      clearInterval(gamepadInterval);
    };
  }, [showPulsingIndicator, onComplete]);

  return (
    <div className="intro-video-container">
      <video
        ref={videoRef}
        className="intro-video"
        muted
        playsInline
      >
        <source src={IntroVideoFile} type="video/mp4" />
      </video>
      
      {showPulsingIndicator && (
        <div 
          className="intro-overlay"
          style={{ opacity: indicatorOpacity }}
        >
          <div className="ps5-indicator">
            <div className="ps5-logo"></div>
          </div>
          <div className="continue-text">Нажмите для входа</div>
        </div>
      )}
    </div>
  );
};

export default IntroVideo; 