import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FaPlay, FaStop, FaDownload, FaGlobe } from 'react-icons/fa';
import { VscAzure } from "react-icons/vsc";
import { SiGoogle } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState('azure');
  const [voices, setVoices] = useState({ azure: [], google: [] });
  const [selectedVoice, setSelectedVoice] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [languages, setLanguages] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    // Fetch available languages when component mounts
    fetch('http://localhost:5000/languages')
      .then(response => response.json())
      .then(data => {
        setLanguages(data);
      })
      .catch(error => console.error('Error fetching languages:', error));
      
    // Load initial voices
    fetchVoicesForLanguage('en-US');
  }, []);

  // Fetch voices when language changes
  const fetchVoicesForLanguage = (languageCode) => {
    fetch(`http://localhost:5000/voices?language=${languageCode}`)
      .then(response => response.json())
      .then(data => {
        setVoices(data);
        // Set default voice for the current model and language
        if (data[activeModel] && data[activeModel].length > 0) {
          setSelectedVoice(data[activeModel][0].id);
        }
      })
      .catch(error => console.error('Error fetching voices:', error));
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setIsTyping(true);
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout
    const newTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    
    setTypingTimeout(newTimeout);
  };

  const handleModelSwitch = (model) => {
    setActiveModel(model);
    if (voices[model] && voices[model].length > 0) {
      setSelectedVoice(voices[model][0].id);
    }
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    fetchVoicesForLanguage(newLanguage);
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `tts_${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleListen = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          model: activeModel,
          voiceId: selectedVoice,
          language: selectedLanguage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert text to speech');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to convert text to speech. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } }
  };

  const waveVariants = {
    initial: { scaleY: 0.1, opacity: 0.3 },
    typing: index => ({
      scaleY: [0.2, 1, 0.2],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        delay: index * 0.1,
        ease: "easeInOut"
      }
    }),
    playing: index => ({
      scaleY: [0.2, 1, 0.2],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1,
        repeat: Infinity,
        delay: index * 0.1,
        ease: "easeInOut"
      }
    })
  };

  return (
    <motion.div
      className="app-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="app-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="app-header glass-effect" variants={itemVariants}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            AI Voice Generator
          </motion.h1>
          <motion.div className="model-selector" variants={itemVariants}>
            <motion.button
              className={`model-button glass-button ${activeModel === 'azure' ? 'active' : ''}`}
              onClick={() => handleModelSwitch('azure')}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <VscAzure /> Azure TTS
            </motion.button>
            <motion.button
              className={`model-button glass-button ${activeModel === 'google' ? 'active' : ''}`}
              onClick={() => handleModelSwitch('google')}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <SiGoogle /> Google TTS
            </motion.button>
          </motion.div>

          <motion.div className="selectors-container" variants={itemVariants}>
            <div className="selector-group">
              <div className="selector-icon">
                <FaGlobe />
              </div>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="modern-select"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="selector-group">
              <div className="selector-icon">
                {activeModel === 'azure' ? <VscAzure /> : <SiGoogle />}
              </div>
              <select
                value={selectedVoice}
                onChange={handleVoiceChange}
                className="modern-select"
              >
                {voices[activeModel]?.map(voice => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="content-area" variants={itemVariants}>
          <motion.div
            className="text-input-container glass-effect"
            variants={itemVariants}
          >
            <motion.textarea
              value={text}
              onChange={handleTextChange}
              placeholder={`Enter text in ${languages.find(l => l.code === selectedLanguage)?.name || 'selected language'}...`}
              rows={6}
              className="modern-textarea"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            />
            
            <AnimatePresence>
              {(isTyping || isPlaying) && (
                <motion.div
                  className="animated-wave"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="wave-container">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="wave-bar"
                        custom={i}
                        variants={waveVariants}
                        initial="initial"
                        animate={isTyping ? "typing" : "playing"}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div className="controls" variants={itemVariants}>
            <AnimatePresence mode="wait">
              {!isPlaying ? (
                <motion.button
                  key="listen"
                  className="control-button listen-button glass-button"
                  onClick={handleListen}
                  disabled={!text.trim() || loading}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {loading ? (
                    <span className="loading-text">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Processing...
                      </motion.span>
                    </span>
                  ) : (
                    <>
                      <FaPlay /> Listen
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  key="stop"
                  className="control-button stop-button glass-button"
                  onClick={handleStop}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaStop /> Stop
                </motion.button>
              )}
            </AnimatePresence>

            {audioUrl && !isPlaying && (
              <motion.button
                className="control-button download-button glass-button"
                onClick={handleDownload}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FaDownload /> Download
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      </motion.div>
    </motion.div>
  );
}

export default App;