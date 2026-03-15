import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, Copy, Check, MoreVertical, ArrowDown } from 'lucide-react';
import OriBotAvatar from './OriBotAvatar';
import ReactMarkdown from 'react-markdown';
import LyraLogo from './LyraLogo'; // This assumes LyraLogo is now in a separate file.

const TypingIndicator = ({ theme }) => (
  <div className="flex items-center space-x-2 p-4">
    <OriAvatar />
    <div className="flex space-x-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--text-tertiary)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  </div>
);

const OriAvatar = () => (
  <div className="w-8 h-8 rounded-full elevation-1 flex items-center justify-center flex-shrink-0">
    <OriBotAvatar size={22} />
  </div>
);

const ChatMessage = memo(({ message, isUser, onCopy, timestamp, sources }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}
    >
      {!isUser && (
        <div className="mr-3 mt-1">
          <OriAvatar />
        </div>
      )}
      <div className="flex flex-col max-w-[75%]">
        <div
          className={`
            px-4 py-3 rounded-2xl relative group-hover:shadow-lg transition-shadow duration-200
            ${isUser
              ? 'elevation-1 ml-auto'
              : 'elevation-1'
            }
          `}
          style={{
            background: isUser
              ? 'rgba(28, 31, 42, 0.88)'
              : 'var(--card)',
            backdropFilter: isUser ? 'blur(40px) saturate(180%)' : undefined,
            WebkitBackdropFilter: isUser ? 'blur(40px) saturate(180%)' : undefined,
            border: isUser
              ? '1px solid rgba(255,255,255,0.07)'
              : undefined,
            boxShadow: isUser
              ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.35)'
              : undefined,
            color: isUser ? 'rgba(255,255,255,0.92)' : 'var(--text-primary)',
            maxWidth: '62ch',
            borderRadius: '18px'
          }}
        >
          {isUser && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '12%',
              right: '12%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)',
              pointerEvents: 'none',
              borderRadius: '0 0 0 0'
            }} />
          )}
          {isUser ? (
            <p style={{ fontSize: '14px', lineHeight: '1.6', letterSpacing: '-0.008em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif', WebkitFontSmoothing: 'antialiased', fontWeight: 400, whiteSpace: 'pre-wrap' }}>
              {message}
            </p>
          ) : (
            <ReactMarkdown
              components={{
                h3: ({ children }) => <h3 style={{ fontWeight: 700, fontSize: '15px', marginTop: '12px', marginBottom: '4px', color: 'var(--text-primary)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif' }}>{children}</h3>,
                strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
                ul: ({ children }) => <ul style={{ paddingLeft: '18px', margin: '4px 0', listStyleType: 'disc' }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ paddingLeft: '18px', margin: '4px 0', listStyleType: 'decimal' }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: '3px', fontSize: '14px', lineHeight: '1.6' }}>{children}</li>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#4DA3FF', textDecoration: 'underline' }}>{children}</a>,
                p: ({ children }) => <p style={{ fontSize: '14px', lineHeight: '1.6', letterSpacing: '-0.008em', margin: '4px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif', WebkitFontSmoothing: 'antialiased' }}>{children}</p>,
              }}
            >
              {message}
            </ReactMarkdown>
          )}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute -right-2 -top-2 w-6 h-6 rounded-full elevation-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--text-secondary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3" strokeWidth={2.5} />
              ) : (
                <Copy className="w-3 h-3" strokeWidth={2} />
              )}
            </button>
          )}
        </div>
        {!isUser && sources && sources.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
            {sources.map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', color: 'var(--text-secondary)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                {src.domain}
              </a>
            ))}
          </div>
        )}
        {!isUser && (
          <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: '5px' }}>
            Data may be delayed. Not financial advice.
          </p>
        )}
        {timestamp && (
          <div
            className={`mt-1 ${isUser ? 'text-right' : 'text-left ml-11'}`}
            style={{ 
              color: 'var(--text-tertiary)',
              fontSize: '11px',
              letterSpacing: '0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
              fontWeight: 400
            }}
          >
            {timestamp}
          </div>
        )}
      </div>
    </motion.div>
  );
});

const SuggestedChip = ({ text, onClick }) => (
  <motion.button
    onClick={() => onClick(text)}
    className="px-3 py-2 rounded-xl text-sm font-medium elevation-1 hover:elevation-2 transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    style={{
      backgroundColor: 'var(--card)',
      color: 'var(--text-secondary)',
      '--tw-ring-color': 'var(--accent)'
    }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {text}
  </motion.button>
);

export default function LyraChatbot({ pageContext }) {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const [isOpen, setIsOpen] = useState(false);

  const initialMessages = useMemo(() => {
    const welcomeMessage = pageContext === 'landing'
      ? "Hi, I'm Ori, your guide to Vireon. Ask me anything about what we do, who we're for, or our key features!"
      : "Hi, I'm Ori — ask me anything about markets, finance, or Vireon.";
    return [{ id: 1, text: welcomeMessage, isUser: false, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
  }, [pageContext]);

  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [usePageContextToggle, setUsePageContextToggle] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const messageContainerRef = useRef(null);
  const constraintsRef = useRef(null); // Ref for drag constraints

  // Performance states
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const activeStream = useRef(null);

  // Draggable FAB position
  const fabX = useMotionValue(0);
  const fabY = useMotionValue(0);

  useEffect(() => {
    const savedPosition = localStorage.getItem('lyra-fab-position');
    if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        fabX.set(x);
        fabY.set(y);
    }
  }, [fabX, fabY]);


  // Aura/Ghost Effect State & Refs - Simplified for hover effect
  const fabWrapperRef = useRef(null);
  const auraRef = useRef(null);
  const scrollTimeout = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Pinch-to-close gesture state
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [isPinching, setIsPinching] = useState(false);
  
  const suggestedChips = useMemo(() => {
    return pageContext === 'landing'
      ? ["What is Vireon?", "Who is this for?", "What are the key features?", "How is it different?"]
      : ["What moved markets today?", "Summarize my watchlist", "Explain VIX", "Set an alert for AAPL", "Compare NVDA vs AMD"];
  }, [pageContext]);

  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
        messageContainerRef.current.scrollTo({
            top: messageContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
        setUserScrolledUp(false);
        setShowJumpToBottom(false);
    }
  }, []);
  
  useEffect(() => {
    if (!userScrolledUp && !isTyping) {
      scrollToBottom();
    }
     if (userScrolledUp && isTyping) {
      setShowJumpToBottom(true);
    }
  }, [messages, isTyping, userScrolledUp, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      // Add Ctrl+W / Cmd+W to close when chat is open
      if ((e.metaKey || e.ctrlKey) && e.key === 'w' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusableElements = panelRef.current.querySelectorAll(
        'button, input, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      panelRef.current.addEventListener('keydown', handleTab);
      return () => panelRef.current?.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (container) {
      const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50; // 50px tolerance
      if (isScrolledToBottom) {
        setUserScrolledUp(false);
        setShowJumpToBottom(false);
      } else {
        setUserScrolledUp(true);
      }
    }
  };
  
  // --- Interaction Effects ---
  useEffect(() => {
    const fabWrapper = fabWrapperRef.current;
    if (!fabWrapper) return;

    const handleScrollFab = () => { // Renamed to avoid conflict with handleScroll for chat
      if (isOpen) return;
      setIsScrolling(true);
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 120);
    };

    window.addEventListener('scroll', handleScrollFab, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollFab);
      clearTimeout(scrollTimeout.current);
    };
  }, [isOpen]);

  // Pinch-to-close gesture handler
  useEffect(() => {
    if (!isOpen) return;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        setInitialPinchDistance(distance);
        setIsPinching(true);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && isPinching && initialPinchDistance) {
        e.preventDefault(); // Prevent default zoom behavior
        
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        const pinchRatio = currentDistance / initialPinchDistance;
        
        // If user pinches in (zoom out) by more than 20%, close the chat
        if (pinchRatio < 0.8) {
          // Haptic feedback for successful gesture
          if (navigator.vibrate) {
            navigator.vibrate([25, 50, 25]); // Short-long-short pattern
          }
          
          setIsOpen(false);
          setIsPinching(false);
          setInitialPinchDistance(null);
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) { // If less than 2 touches, the pinch has ended
        setIsPinching(false);
        setInitialPinchDistance(null);
      }
    };

    // Add touch event listeners to the chat panel
    const panelElement = panelRef.current;
    if (panelElement) {
      // Add { passive: false } to handleTouchMove to allow e.preventDefault()
      panelElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      panelElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      panelElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (panelElement) {
        panelElement.removeEventListener('touchstart', handleTouchStart);
        panelElement.removeEventListener('touchmove', handleTouchMove);
        panelElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isOpen, isPinching, initialPinchDistance]);


  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageId = Date.now();
    const aiMessageId = userMessageId + 1;

    setInputValue('');
    setMessages(prev => [...prev, { id: userMessageId, text: userMessage, isUser: true, timestamp }]);
    
    // Artificial delay to show user message before AI typing indicator
    setTimeout(() => {
      setIsTyping(true);
      setMessages(prev => [...prev, { id: aiMessageId, text: '', isUser: false }]);
    }, 200);

    const streamTimeout = setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: "The request timed out. Please try again.", error: true } : m));
        setIsTyping(false);
        if(activeStream.current) clearInterval(activeStream.current);
    }, 20000); // 20-second timeout

    try {
      const res = await fetch("https://tdvmquuvtcxfkalumjlw.supabase.co/functions/v1/ori-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          user_id: "vireon-user",
          timestamp: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      clearTimeout(streamTimeout);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let currentText = "";
      let responseSources = [];

      let tokenBuffer = "";
      let rafId = null;
      const flushBuffer = () => {
        if (tokenBuffer) {
          currentText += tokenBuffer;
          tokenBuffer = "";
          setMessages(prev =>
            prev.map(msg => msg.id === aiMessageId
              ? { ...msg, text: currentText }
              : msg)
          );
        }
        rafId = null;
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        let eventType = null;
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ") && eventType) {
            try {
              const payload = JSON.parse(line.slice(6));
              if (eventType === "token" && payload.text) {
                tokenBuffer += payload.text;
                if (!rafId) {
                  rafId = requestAnimationFrame(flushBuffer);
                }
              } else if (eventType === "sources" && payload.sources) {
                responseSources = payload.sources;
              } else if (eventType === "error") {
                currentText = "I encountered an issue. Please try again.";
                setMessages(prev =>
                  prev.map(msg => msg.id === aiMessageId
                    ? { ...msg, text: currentText, error: true }
                    : msg)
                );
              }
            } catch (e) {}
            eventType = null;
          }
        }
      }

      if (rafId) cancelAnimationFrame(rafId);
      flushBuffer();

      setMessages(prev =>
        prev.map(msg => msg.id === aiMessageId
          ? { ...msg, text: currentText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sources: responseSources }
          : msg)
      );
      setIsTyping(false);

    } catch (error) {
      clearTimeout(streamTimeout);
      const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Replace placeholder with error message
      setMessages(prev => {
        const newMessages = prev.filter(m => m.id !== aiMessageId); // Remove the empty AI message placeholder
        return [...newMessages, { 
          id: aiMessageId, 
          text: "I'm having trouble connecting right now. Please try again.",
          isUser: false, 
          error: true,
          timestamp: errorTimestamp
        }];
      });
      
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChipClick = (text) => {
    setInputValue(text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCopyMessage = async (message) => {
    try {
      await navigator.clipboard.writeText(message);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };
  
  const fabContainerVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    drag: { scale: 1.1 }
  };

  const auraVariants = {
    rest: { opacity: 0, scale: 1 },
    hover: { 
      opacity: 0.7, 
      scale: 1.6,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      } 
    }
  };
  
  // Desktop hover animation
  const ringVariants = {
    rest: { strokeDashoffset: 302, opacity: 0 },
    hover: { 
      strokeDashoffset: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        restDelta: 0.001
      } 
    }
  };

  // Mobile constant loop animation
  const mobileRingVariants = {
    animate: {
      strokeDashoffset: [302, 0, 302],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  const panelTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    duration: 0.2
  };

  const handleDragStart = () => {
    // Provide haptic feedback on mobile when dragging starts
    if (navigator.vibrate) {
      navigator.vibrate(50); // A short 50ms vibration
    }
  };

  // Detect if we're on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .lyra-ghost, .lyra-aura {
            display: none !important;
          }
          .lyra-fab button {
            transition: transform 1ms !important;
          }
        }
        .lyra-panel {
          will-change: transform, opacity;
          touch-action: none; /* Prevent default touch behaviors during pinch */
        }
      `}</style>
      
      {/* Constraints boundary for dragging */}
      <div ref={constraintsRef} className="fixed inset-0 w-screen h-screen pointer-events-none z-0" />

      {/* Floating Action Button */}
      <motion.div
        ref={fabWrapperRef}
        className="fixed bottom-8 right-8 z-50 lyra-fab cursor-grab active:cursor-grabbing"
        style={{ width: '56px', height: '56px', x: fabX, y: fabY }}
        drag
        onDragStart={handleDragStart}
        onDragEnd={() => {
          const newPosition = { x: fabX.get(), y: fabY.get() };
          localStorage.setItem('lyra-fab-position', JSON.stringify(newPosition));
        }}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
        variants={fabContainerVariants}
        initial="rest"
        whileHover={isOpen ? "rest" : "hover"}
        whileTap="tap"
        whileDrag="drag"
      >
        {!isOpen && (
          <>
            {/* Proximity Aura - Desktop only */}
            {!isMobile && (
              <motion.div
                ref={auraRef}
                className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none lyra-aura"
                style={{
                  background: `radial-gradient(circle, #00E5FF 0%, transparent 60%)`,
                  filter: 'blur(20px)',
                  willChange: 'opacity, transform'
                }}
                variants={auraVariants}
              />
            )}
          </>
        )}

        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, rgba(153,50,204,0.1) 100%)',
            border: '1px solid rgba(0,229,255,0.2)',
            color: '#FFFFFF',
            '--tw-ring-color': 'var(--accent)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            cursor: 'pointer'
          }}
          animate={{
            y: isScrolling && !isOpen ? -2 : 0,
            scale: (isScrolling && !isOpen) ? 1.05 : 1.0,
          }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? 'Close Ori chat' : 'Open Ori chat'}
          aria-expanded={isOpen}
        >
          {/* Animated Neon Ring */}
          {!isOpen && (
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90" 
              viewBox="0 0 100 100" 
              fill="none"
              style={{ filter: 'drop-shadow(0 0 6px rgba(123, 104, 238, 0.8))' }}
            >
              <defs>
                  <linearGradient id="lyra-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00E5FF" />
                      <stop offset="50%" stopColor="#7B68EE" />
                      <stop offset="100%" stopColor="#DA70D6" />
                  </linearGradient>
              </defs>
              <motion.circle
                cx="50" cy="50" r="48"
                stroke="url(#lyra-ring-gradient)"
                strokeWidth="4"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray="302"
                variants={isMobile ? mobileRingVariants : ringVariants}
                animate={isMobile ? "animate" : undefined}
              />
            </svg>
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, rotate: 90, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: [1, 1.1, 1], // Pulsing effect
                  transition: {
                    opacity: { duration: 0.15 },
                    rotate: { duration: 0.15 },
                    scale: {
                      duration: 1.8,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut"
                    }
                  }
                }}
                exit={{ opacity: 0, rotate: -90, scale: 0.9 }}
              >
                <LyraLogo className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>


            <motion.div
              ref={panelRef}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={panelTransition}
              className={`
                lyra-panel fixed z-50 flex flex-col overflow-hidden
                bottom-24 right-8 w-[480px] rounded-[28px]
                elevation-3
                ${isPinching ? 'select-none' : ''}
              `}
              style={{
                backgroundColor: 'var(--card)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                height: 'max(680px, 75vh)',
                maxHeight: '85vh',
                transform: isPinching && !initialPinchDistance ? 'scale(0.98)' : 'scale(1)',
                transition: 'transform 0.1s ease-out'
              }}
              role="dialog"
              aria-labelledby="lyra-title"
              aria-modal="true"
            >


              {/* Header */}
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center space-x-3">
                  <OriAvatar />
                  <div>
                    <h3
                      id="lyra-title"
                      className="font-semibold"
                      style={{ 
                        color: 'var(--text-primary)',
                        fontSize: '15px',
                        letterSpacing: '-0.02em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
                        WebkitFontSmoothing: 'antialiased'
                      }}
                    >
                      Ori Intelligence
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    {pageContext !== 'landing' && (
                       <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                          color: 'var(--text-tertiary)',
                          '--tw-ring-color': 'var(--accent)'
                        }}
                        aria-label="Chat options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}

                    <AnimatePresence>
                      {showMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-48 elevation-2 rounded-xl p-2 z-10"
                          style={{ backgroundColor: 'var(--card)' }}
                        >
                          <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={usePageContextToggle}
                              onChange={(e) => setUsePageContextToggle(e.target.checked)}
                              className="rounded"
                              style={{ accentColor: 'var(--accent)' }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              Use page context
                            </span>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>


                </div>
              </div>

              {/* Messages */}
              <div ref={messageContainerRef} onScroll={handleScroll} className="relative flex-1 overflow-y-auto p-4">


                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.text}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                    onCopy={handleCopyMessage}
                    sources={message.sources}
                  />
                ))}

                {isTyping && <TypingIndicator theme={theme} />}
                <div ref={messagesEndRef} />
                
                <AnimatePresence>
                  {showJumpToBottom && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={scrollToBottom}
                      className="sticky bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-full text-sm elevation-2"
                      style={{backgroundColor: 'var(--card)', color: 'var(--text-primary)'}}
                    >
                      <ArrowDown className="w-4 h-4" /> New Messages
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div
                className="p-4 border-t"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder=""
                      rows="1"
                      className="w-full px-4 py-3 rounded-xl resize-none transition-all duration-300 focus:outline-none"
                      style={{
                       backgroundColor: 'var(--card)',
                       border: '1px solid var(--border)',
                       color: 'var(--text-primary)',
                       maxHeight: '120px',
                       fontSize: '14px',
                       lineHeight: '1.6',
                       letterSpacing: '-0.008em',
                       fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
                       WebkitFontSmoothing: 'antialiased',
                       transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'rgba(77, 163, 255, 0.85)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(77, 163, 255, 0.25), 0 0 32px rgba(77, 163, 255, 0.30), 0 0 60px rgba(77, 163, 255, 0.12)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />

                  </div>

                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-10 h-10 rounded-xl flex items-center justify-center elevation-1 hover:elevation-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: '#FFFFFF',
                      '--tw-ring-color': 'var(--accent)'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" strokeWidth={2} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}