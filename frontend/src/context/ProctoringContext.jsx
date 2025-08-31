import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useTabFocusDetection } from '../hooks/useTabFocusDetection';
import { useFullscreenEnforcer } from '../hooks/useFullscreenEnforcer';
import { useUser,useAuth } from '@clerk/clerk-react';

// 1. CONTEXT CREATION
const ProctoringContext = createContext();

// 2. CUSTOM HOOK FOR EASY ACCESS
export const useProctoring = () => useContext(ProctoringContext);

// 3. CONFIGURATION
const MAX_INFRACTIONS = 3;
const WEBCAM_SNAPSHOT_INTERVAL = 30000; // 30 seconds

// 4. THE PROVIDER COMPONENT
export const ProctoringProvider = ({ children, problemId, contestId }) => {
  
  const { getToken } = useAuth();
  const webcamRef = useRef(null); // Ref for webcam component
  // 5. STATE MANAGEMENT
  const [isProctoringActive, setIsProctoringActive] = useState(false);
  const [infractionCount, setInfractionCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const [isDisqualified, setIsDisqualified] = useState(false);
  const { user } = useUser();

  // 6. GLOBAL EVENT BLOCKER (THE CORE OF PREVENTION)
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v' || event.key === 'x')) {
        event.preventDefault();
      }
    };
    const handleGlobalContextMenu = (event) => {
      event.preventDefault();
    };
    if (isProctoringActive) {
      document.addEventListener('keydown', handleGlobalKeyDown);
      document.addEventListener('contextmenu', handleGlobalContextMenu);
    }
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
    };
  }, [isProctoringActive]);

  // --- START: WEBCAM MONITORING ---
  useEffect(() => {
    if (!isProctoringActive || !contestId) return;

    const captureAndSendSnapshot = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return;
            try {
                // In a real app, you'd upload this to a secure cloud storage (e.g., S3)
                // and send the resulting URL to your backend.
                // For simplicity, we'll send the base64 string if it's not too large,
                // but this is not recommended for production.
                const token = await getToken();
                await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/infractions/log/snapshot`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        problemId,
                        contestId,
                        imageUrl: imageSrc, // This should be a URL in production
                    }),
                });
            } catch (error) {
                console.error("Failed to send webcam snapshot:", error);
            }
        }
    };

    const intervalId = setInterval(captureAndSendSnapshot, WEBCAM_SNAPSHOT_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isProctoringActive, contestId, problemId, getToken]);
  // --- END: WEBCAM MONITORING ---


  // 7. SERVER-SIDE LOGGING
  const logInfractionToServer = useCallback(async (type, details = {}) => {
    if (contestId) { // If in a contest, disqualify immediately
        try {
            const token = await getToken();
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contests/${contestId}/disqualify`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }  });
            setIsDisqualified(true); // Immediately update UI
        } catch (error) {
            console.error("Failed to disqualify on server:", error);
        }
    } else {
        // ... (keep existing non-contest infraction logging if desired)
    }
  }, [user?.id, problemId, contestId, getToken]);

  // 8. INFRACTION HANDLING LOGIC
  const handleInfraction = useCallback((type) => {
    if (!isProctoringActive || isDisqualified) return;

    const newCount = infractionCount + 1;
    setInfractionCount(newCount);
    logInfractionToServer(type);

    const infractionText = type === 'tab_switch' ? 'switching tabs' : 'exiting fullscreen';

    if (newCount >= MAX_INFRACTIONS) {
      setWarningMessage(`Disqualified for ${infractionText}.`);
      setIsDisqualified(true);
    } else {
      const remaining = MAX_INFRACTIONS - newCount;
      setWarningMessage(`Warning: Infraction detected for ${infractionText}. You have ${remaining} warning(s) left.`);
    }
  }, [isProctoringActive, isDisqualified, infractionCount, logInfractionToServer]);

  // 9. INITIALIZING DETECTION HOOKS
  useTabFocusDetection(handleInfraction);
  const { enterFullscreen } = useFullscreenEnforcer(handleInfraction);

  // 10. STARTING THE SESSION
  const startProctoring = () => {
    enterFullscreen(); 
    setIsProctoringActive(true);
  };

  const handlePasteEvent = useCallback((pastedText) => {
    if (!isProctoringActive || isDisqualified) return;
    const pastedLength = pastedText.length;
    if (pastedLength > 50) { 
        handleInfraction('paste_attempt', { pastedContentLength: pastedLength });
    }
}, [isProctoringActive, isDisqualified, handleInfraction]);

  const value = {
    isProctoringActive,
    startProctoring,
    infractionCount,
    warningMessage,
    isDisqualified,
    MAX_INFRACTIONS,
    handlePasteEvent,
    webcamRef, // Pass webcam ref to be used by the view
  };
   
  return <ProctoringContext.Provider value={value}>{children}</ProctoringContext.Provider>;
};