import React, { useState, useRef, useEffect } from 'react';

const CustomVideoPlayer = ({ src, poster, title, onTimeUpdate, onEnded, subtitles = [], autoPlay = false }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const subtitlePopupRef = useRef(null);
  const currentSubtitleRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16/9);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hoveredTime, setHoveredTime] = useState(null);
  const [showHoverPreview, setShowHoverPreview] = useState(false);
  const [hoverPreviewPosition, setHoverPreviewPosition] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState(null);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [showSubtitlePopup, setShowSubtitlePopup] = useState(false);
  const [debugSubtitleState, setDebugSubtitleState] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [videoQuality, setVideoQuality] = useState('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [availableQualities, setAvailableQualities] = useState(['auto']);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [currentSettingsView, setCurrentSettingsView] = useState('main'); // 'main', 'speed', 'quality', 'subtitles'
  const controlsTimeoutRef = useRef(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Debug subtitle state changes
  useEffect(() => {
    console.log('Subtitle state changed:', {
      showSubtitles,
      currentSubtitle,
      debugSubtitleState: `Current: "${currentSubtitle}"`
    });
    setDebugSubtitleState(currentSubtitle || 'null');
  }, [currentSubtitle, showSubtitles]);

  // Auto-play when video is loaded and autoPlay prop is true
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    const handleCanPlay = () => {
      if (autoPlay) {
        video.play().catch(error => {
          console.log('Auto-play failed:', error);
          // Auto-play failed, user will need to click play button
        });
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [autoPlay, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (video.videoWidth && video.videoHeight) {
        setVideoAspectRatio(video.videoWidth / video.videoHeight);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) onTimeUpdate(video.currentTime);
      
      // Update current subtitle based on time
      updateSubtitleForTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    const handleWaiting = () => setBuffering(true);
    const handleCanPlay = () => setBuffering(false);
    
    const handleError = (error) => {
      console.error('Video error:', error);
      setBuffering(false);
      setIsPlaying(false);
    };

    const updateSubtitleForTime = (time) => {
      if (showSubtitles && subtitleTracks.length > 0) {
        const currentTrack = subtitleTracks.find(track => track.active);
        if (currentTrack && currentTrack.cues && currentTrack.cues.length > 0) {
          // Find the subtitle that should be shown at the current time
          const matchingCues = currentTrack.cues.filter(cue => 
            time >= cue.startTime && time <= cue.endTime
          );
          
          // Debug: Show all matching cues
          if (matchingCues.length > 0) {
            console.log(`Found ${matchingCues.length} subtitle(s) for time ${time.toFixed(2)}:`);
            matchingCues.forEach((cue, index) => {
              console.log(`  ${index + 1}. "${cue.text}" (${cue.startTime.toFixed(2)}s - ${cue.endTime.toFixed(2)}s)`);
            });
          } else {
            console.log(`No subtitle found for time ${time.toFixed(2)}`);
          }
          
          // Take only the first matching cue (should be only one)
          const currentCue = matchingCues[0];
          
          if (currentCue && currentCue.text !== currentSubtitleRef.current) {
            console.log('Update subtitle:', currentCue.text, 'at time:', time.toFixed(2));
            currentSubtitleRef.current = currentCue.text;
            setCurrentSubtitle(currentCue.text);
          } else if (!currentCue) {
            // Force clear subtitle if no matching cue found
            if (currentSubtitleRef.current) {
              console.log('Force clear subtitle at time:', time.toFixed(2), 'because no matching cue found');
              currentSubtitleRef.current = null;
              setCurrentSubtitle(null);
              
              // Force a re-render by updating a dummy state
              setDebugSubtitleState('cleared');
            }
          }
        } else {
          // If no active track or no cues, clear subtitle
          if (currentSubtitleRef.current) {
            console.log('No active track or cues, clearing subtitle');
            currentSubtitleRef.current = null;
            setCurrentSubtitle(null);
          }
        }
      } else {
        // If subtitles are disabled, clear subtitle
        if (currentSubtitleRef.current) {
          console.log('Subtitles disabled, clearing subtitle');
          currentSubtitleRef.current = null;
          setCurrentSubtitle(null);
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      
      // Update subtitle when video starts playing
      const video = videoRef.current;
      if (video) {
        updateSubtitleForTime(video.currentTime);
      }
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      
      // Update subtitle when video is paused
      const video = videoRef.current;
      if (video) {
        updateSubtitleForTime(video.currentTime);
      }
    };

    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
      setIsFullscreen(isFullscreenNow);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);

      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      
      // Cleanup controls timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [onTimeUpdate, onEnded, showSubtitles, subtitleTracks]);

  // Load subtitle tracks
  useEffect(() => {
    const loadSubtitleTracks = async () => {
      if (!subtitles || subtitles.length === 0) {
        console.log('No subtitles provided');
        return;
      }

      console.log('Loading subtitle tracks:', subtitles);

      const tracks = [];
      for (const subtitle of subtitles) {
        try {
          console.log('Fetching subtitle from URL:', subtitle.url);
          const response = await fetch(subtitle.url);
          
          if (!response.ok) {
            console.error('Failed to fetch subtitle:', response.status, response.statusText);
            continue;
          }
          
          const text = await response.text();
          console.log('Subtitle content length:', text.length);
          console.log('Subtitle content preview:', text.substring(0, 200));
          
          const track = parseSubtitleFile(text, subtitle.language, subtitle.label);
          console.log('Parsed subtitle track:', track);
          tracks.push(track);
        } catch (error) {
          console.error('Error loading subtitle:', error);
        }
      }
      
      // Set the first track as active by default
      if (tracks.length > 0) {
        tracks[0].active = true;
        console.log('Set first subtitle track as active:', tracks[0]);
        
        // Debug: Show all cues in the active track
        if (tracks[0].cues && tracks[0].cues.length > 0) {
          console.log('All subtitle cues:');
          tracks[0].cues.forEach((cue, index) => {
            console.log(`Cue ${index + 1}: "${cue.text}" (${cue.startTime.toFixed(2)}s - ${cue.endTime.toFixed(2)}s)`);
          });
          
          // Check for overlapping or invalid time ranges
          tracks[0].cues.forEach((cue, index) => {
            if (cue.startTime >= cue.endTime) {
              console.warn(`Cue ${index + 1} has invalid time range: start (${cue.startTime.toFixed(2)}) >= end (${cue.endTime.toFixed(2)})`);
            }
          });
        }
      }
      
      setSubtitleTracks(tracks);
      console.log('Loaded subtitle tracks:', tracks.length);
    };

    loadSubtitleTracks();
  }, [subtitles]);

  const parseSubtitleFile = (content, language, label) => {
    const track = {
      language,
      label,
      active: false,
      cues: []
    };

    console.log('Parsing subtitle file for:', language, label);

    // More robust SRT parser that handles merged blocks
    const lines = content.trim().split('\n');
    console.log('Total lines:', lines.length);
    
    let currentBlock = [];
    let blockNumber = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) {
        if (currentBlock.length > 0) {
          // Process the current block
          processSubtitleBlock(currentBlock, track, blockNumber);
          blockNumber++;
          currentBlock = [];
        }
        continue;
      }
      
      // Check if this line is a number (subtitle index)
      if (/^\d+$/.test(line)) {
        // If we have a previous block, process it first
        if (currentBlock.length > 0) {
          processSubtitleBlock(currentBlock, track, blockNumber);
          blockNumber++;
        }
        // Start new block
        currentBlock = [];
        continue;
      }
      
      // Add line to current block
      currentBlock.push(line);
    }
    
    // Process the last block
    if (currentBlock.length > 0) {
      processSubtitleBlock(currentBlock, track, blockNumber);
    }

    console.log('Total parsed cues:', track.cues.length);
    return track;
  };

  const processSubtitleBlock = (block, track, blockNumber) => {
    console.log(`Processing block ${blockNumber + 1}:`, block);
    
    if (block.length < 2) {
      console.warn(`Block ${blockNumber + 1} too short:`, block);
      return;
    }
    
    // First line should be the time line
    const timeLine = block[0];
    const textLines = block.slice(1);
    
    // Handle different time formats including 2-digit milliseconds
    const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{2,3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{2,3})/);
    
    if (timeMatch) {
      const startHours = parseInt(timeMatch[1]);
      const startMinutes = parseInt(timeMatch[2]);
      const startSeconds = parseInt(timeMatch[3]);
      const startMs = parseInt(timeMatch[4]);
      
      const endHours = parseInt(timeMatch[5]);
      const endMinutes = parseInt(timeMatch[6]);
      const endSeconds = parseInt(timeMatch[7]);
      const endMs = parseInt(timeMatch[8]);
      
      // Convert 2-digit milliseconds to 3-digit if needed
      const startMsAdjusted = startMs < 100 ? startMs * 10 : startMs;
      const endMsAdjusted = endMs < 100 ? endMs * 10 : endMs;
      
      const startTime = startHours * 3600 + startMinutes * 60 + startSeconds + startMsAdjusted / 1000;
      const endTime = endHours * 3600 + endMinutes * 60 + endSeconds + endMsAdjusted / 1000;
      
      // Join text lines and clean
      const rawText = textLines.join('\n');
      let cleanText = rawText
        .replace(/\d{2}:\d{2}:\d{2}[,.]\d{2,3}/g, '') // Remove timestamps
        .replace(/\d+$/g, '') // Remove trailing numbers
        .replace(/\s*→\s*/g, '') // Remove arrow symbols
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\d+\s*$/, '') // Remove any remaining numbers at the end
        .replace(/\s*00:\d{2}:\d{2}[,.]\d{2,3}\s*$/, '') // Remove timestamps at the end
        .replace(/\s*-->\s*\d{2}:\d{2}:\d{2}[,.]\d{2,3}\s*$/, '') // Remove arrow and timestamp at the end
        .trim();
      
      // Skip empty or very short subtitles
      if (cleanText.length < 3) {
        console.warn(`Block ${blockNumber + 1} subtitle too short:`, cleanText);
        return;
      }
      
      console.log(`Block ${blockNumber + 1} cleaned text:`, cleanText);
      console.log(`Block ${blockNumber + 1} time range:`, startTime.toFixed(2), '-', endTime.toFixed(2));
      
      const cue = {
        startTime,
        endTime,
        text: cleanText
      };
      
      track.cues.push(cue);
    } else {
      console.warn(`Block ${blockNumber + 1} could not parse time line:`, timeLine);
    }
  };

  const toggleSubtitles = () => {
    setShowSubtitlePopup(!showSubtitlePopup);
  };

  const selectSubtitleTrack = (trackIndex) => {
    // Clear current subtitle when switching tracks
    currentSubtitleRef.current = null;
    setCurrentSubtitle(null);
    
    setSubtitleTracks(prev => prev.map((track, index) => ({
      ...track,
      active: index === trackIndex
    })));
    
    setShowSettingsMenu(false);
    setCurrentSettingsView('main');
    console.log('Switched to subtitle track:', trackIndex);
  };

  const enableSubtitles = () => {
    setShowSubtitles(true);
    setShowSubtitlePopup(false);
    setShowSettingsMenu(false);
    setCurrentSettingsView('main');
    
    // Clear current subtitle when enabling to ensure clean state
    currentSubtitleRef.current = null;
    setCurrentSubtitle(null);
    
    console.log('Subtitles enabled, tracks available:', subtitleTracks.length);
    if (subtitleTracks.length === 0) {
      console.warn('No subtitle tracks available');
    } else {
      const activeTrack = subtitleTracks.find(track => track.active);
      if (activeTrack) {
        console.log('Active subtitle track:', activeTrack);
        console.log('Number of cues in active track:', activeTrack.cues.length);
        if (activeTrack.cues.length > 0) {
          console.log('First few cues:', activeTrack.cues.slice(0, 3));
          
          // Check if there's a subtitle for current time
          const video = videoRef.current;
          if (video && activeTrack.cues) {
            const currentCue = activeTrack.cues.find(cue => 
              video.currentTime >= cue.startTime && video.currentTime <= cue.endTime
            );
            
            if (currentCue) {
              console.log('Enable: Showing subtitle for current time:', currentCue.text, 'at time:', video.currentTime.toFixed(2));
              currentSubtitleRef.current = currentCue.text;
              setCurrentSubtitle(currentCue.text);
            } else {
              console.log('Enable: No subtitle for current time:', video.currentTime.toFixed(2));
              currentSubtitleRef.current = null;
              setCurrentSubtitle(null);
            }
          }
        }
      }
    }
  };

  const disableSubtitles = () => {
    setShowSubtitles(false);
    currentSubtitleRef.current = null;
    setCurrentSubtitle(null);
    setShowSubtitlePopup(false);
    setShowSettingsMenu(false);
    setCurrentSettingsView('main');
    console.log('Subtitles disabled');
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Video play/pause error:', error);
      // Reset state if there's an error
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !duration || duration <= 0) return;

    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const seekTime = Math.max(0, Math.min(duration, (clickX / width) * duration));
      
      video.currentTime = seekTime;
      setCurrentTime(seekTime);
      
      // Update subtitle immediately after seeking
      updateSubtitleForTime(seekTime);
    } catch (error) {
      console.error('Seek error:', error);
    }
  };

  const handleProgressHover = (e) => {
    if (!duration || duration <= 0) return;
    
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const hoverX = e.clientX - rect.left;
      const width = rect.width;
      const hoverTime = Math.max(0, Math.min(duration, (hoverX / width) * duration));
      const hoverPosition = (hoverX / width) * 100;
      
      setHoveredTime(hoverTime);
      setHoverPreviewPosition(hoverPosition);
      setShowHoverPreview(true);
    } catch (error) {
      console.error('Progress hover error:', error);
    }
  };

  const handleProgressLeave = () => {
    setHoveredTime(null);
    setShowHoverPreview(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    try {
      const newVolume = parseFloat(e.target.value);
      if (isNaN(newVolume)) return;
      
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      setVolume(clampedVolume);
      if (clampedVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    } catch (error) {
      console.error('Volume change error:', error);
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen toggle error:', error);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = (event) => {
    setShowControls(true);
    setShowSubtitlePopup(false); // Close subtitle popup on mouse move
    setShowSpeedMenu(false); // Close speed menu on mouse move
    setShowQualityMenu(false); // Close quality menu on mouse move
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
    setShowVolumeSlider(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          const video = videoRef.current;
          if (video) {
            const newTime = Math.max(0, video.currentTime - 10);
            video.currentTime = newTime;
            
            // Update subtitle for keyboard seek
            updateSubtitleForTime(newTime);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          const videoRight = videoRef.current;
          if (videoRight) {
            const newTime = Math.min(duration, videoRight.currentTime + 10);
            videoRight.currentTime = newTime;
            
            // Update subtitle for keyboard seek
            updateSubtitleForTime(newTime);
          }
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyS':
          e.preventDefault();
          if (subtitleTracks.length > 0) {
            toggleSettingsMenu();
          }
          break;
        case 'KeyR':
          e.preventDefault();
          // Cycle through playback speeds: 0.5x -> 0.75x -> 1x -> 1.25x -> 1.5x -> 2x
          const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
          const currentIndex = speeds.indexOf(playbackSpeed);
          const nextIndex = (currentIndex + 1) % speeds.length;
          changePlaybackSpeed(speeds[nextIndex]);
          break;
        case 'KeyC':
          e.preventDefault();
          // Toggle settings menu
          toggleSettingsMenu();
          break;
        case 'KeyQ':
          e.preventDefault();
          // Toggle settings menu
          toggleSettingsMenu();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          // Close all menus
          setShowSpeedMenu(false);
          setShowQualityMenu(false);
          setShowSubtitlePopup(false);
          setShowSettingsMenu(false);
          setCurrentSettingsView('main');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, duration, subtitleTracks.length, playbackSpeed]);

  const getVideoContainerStyle = () => {
    if (isFullscreen) {
      return {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    }

    const containerAspectRatio = 16/9;
    const videoAspect = videoAspectRatio;
    
    if (videoAspect > containerAspectRatio) {
      return {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      };
    } else {
      return {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      };
    }
  };

  const changePlaybackSpeed = (speed) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
      setShowSettingsMenu(false);
      setCurrentSettingsView('main');
      console.log('Playback speed changed to:', speed);
    }
  };

  const toggleSpeedMenu = () => {
    setShowSpeedMenu(!showSpeedMenu);
    setShowQualityMenu(false);
    setShowSubtitlePopup(false);
    setShowSettingsMenu(false);
  };

  const toggleQualityMenu = () => {
    setShowQualityMenu(!showQualityMenu);
    setShowSpeedMenu(false);
    setShowSubtitlePopup(false);
    setShowSettingsMenu(false);
  };

  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
    setShowSpeedMenu(false);
    setShowQualityMenu(false);
    setShowSubtitlePopup(false);
    if (!showSettingsMenu) {
      setCurrentSettingsView('main');
    }
  };

  const changeVideoQuality = (quality) => {
    setVideoQuality(quality);
    setShowQualityMenu(false);
    setShowSettingsMenu(false);
    setCurrentSettingsView('main');
    console.log('Video quality changed to:', quality);
    // TODO: Implement actual quality change logic
  };

  // Update video playback speed when speed changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Handle clicking outside settings menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettingsMenu && !event.target.closest('.settings-menu-container')) {
        setShowSettingsMenu(false);
        setCurrentSettingsView('main');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsMenu]);

  const handleVideoClick = () => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 300) {
      // Double click detected - toggle fullscreen
      toggleFullscreen();
    } else {
      // Single click - toggle play/pause
      togglePlay();
    }
    
    setLastClickTime(currentTime);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-xl overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full max-w-5xl mx-auto'} ${!showControls ? 'cursor-none' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Container */}
      <div 
        className={`relative ${isFullscreen ? 'w-full h-full' : ''}`}
        style={!isFullscreen ? { paddingBottom: '56.25%' } : {}}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          style={getVideoContainerStyle()}
          className={`${isFullscreen ? 'absolute inset-0' : 'absolute inset-0 w-full h-full'} transition-all duration-300`}
          onClick={handleVideoClick}
        />
      </div>

      {/* Buffering indicator */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-15">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-opacity-20"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-brand-orange absolute top-0 left-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-sm font-medium">Yükleniyor...</div>
            </div>
          </div>
        </div>
      )}

      {/* Center play button overlay */}
      {!isPlaying && !buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-15">
          <button
            onClick={togglePlay}
            className="transition-all duration-300"
          >
            <svg className="w-16 h-16 text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent transition-all duration-500 z-10 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Progress bar */}
        <div className="px-6 pt-4 pb-2">
          <div 
            className="relative w-full h-2 bg-white/10 rounded-full cursor-pointer group"
            onClick={handleSeek}
            onMouseMove={handleProgressHover}
            onMouseLeave={handleProgressLeave}
          >
            {/* Progress fill */}
            <div 
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 ease-out"
              style={{ 
                width: `${(currentTime / duration) * 100}%`,
                backgroundColor: '#ffffff'
              }}
            />
            
            {/* Progress handle */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
              style={{ 
                left: `calc(${(currentTime / duration) * 100}% - 6px)`,
                backgroundColor: '#ffffff'
              }}
            />
            
            {/* Hover preview */}
            {hoveredTime !== null && (
              <div 
                className="absolute bottom-full transform -translate-x-1/2 text-white text-xs px-2 py-1 rounded pointer-events-none mb-2 z-15"
                style={{ left: `${(hoveredTime / duration) * 100}%` }}
              >
                {formatTime(hoveredTime)}
              </div>
            )}
            
            {/* Hover preview thumbnail */}
            {showHoverPreview && poster && (
              <div 
                className="absolute bottom-full transform -translate-x-1/2 bg-black/90 rounded pointer-events-none mb-8 z-15"
                style={{ left: `${hoverPreviewPosition}%` }}
              >
                <img 
                  src={poster} 
                  alt="Preview" 
                  className="w-24 h-14 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-6">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className="text-white transition-all duration-300 flex items-center justify-center"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Volume control */}
            <div className="relative flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className="text-white transition-all duration-300 flex items-center justify-center"
                onMouseEnter={() => setShowVolumeSlider(true)}
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : volume < 0.5 ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
              
              {/* Volume slider */}
              <div 
                className={`relative transition-all duration-300 ${showVolumeSlider ? 'opacity-100 w-20' : 'opacity-0 w-0 overflow-hidden'}`}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <div className="relative w-full h-2 bg-white/10 rounded-full">
                  {/* Volume fill */}
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-200"
                    style={{ 
                      width: `${(isMuted ? 0 : volume) * 100}%`,
                      backgroundColor: '#ffffff'
                    }}
                  />
                  
                  {/* Volume handle */}
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full shadow-md"
                    style={{ 
                      left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)`,
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>
                
                {/* Hidden input for volume control */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Time display */}
            <div className="text-white text-sm tracking-wide flex items-center">
              <span className="text-brand-orange font-bold">{formatTime(currentTime)}</span>
              <span className="text-white/60 mx-2">/</span>
              <span className="text-white/80 font-normal">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Settings Button */}
            <div className="relative settings-menu-container">
              <button
                onClick={toggleSettingsMenu}
                className="text-white transition-all duration-300 flex items-center justify-center"
                title="Ayarlar"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
              </button>
              
              {/* Unified Settings Menu */}
              {showSettingsMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm rounded-lg p-2 min-w-48 border border-white/20 shadow-xl z-20">
                  {/* Main Settings Menu */}
                  {currentSettingsView === 'main' && (
                    <div className="space-y-1">
                      {/* Playback Speed Option */}
                      <button
                        onClick={() => setCurrentSettingsView('speed')}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors text-white/90 hover:bg-white/10"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-white/70 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.6 1.53c.56-1.24.9-2.62.9-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
                          </svg>
                          <span>Hız</span>
                        </div>
                        <div className="flex items-center text-white/60">
                          <span className="text-white font-medium mr-1">{playbackSpeed}x</span>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                          </svg>
                        </div>
                      </button>

                      {/* Video Quality Option */}
                      <button
                        onClick={() => setCurrentSettingsView('quality')}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors text-white/90 hover:bg-white/10"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-white/70 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 12H3V5h18v10z"/>
                          </svg>
                          <span>Kalite</span>
                        </div>
                        <div className="flex items-center text-white/60">
                          <span className="text-white font-medium mr-1">{videoQuality}</span>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                          </svg>
                        </div>
                      </button>

                      {/* Subtitle Option */}
                      {(subtitleTracks.length > 0 || (subtitles && subtitles.length > 0)) && (
                        <button
                          onClick={() => setCurrentSettingsView('subtitles')}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors text-white/90 hover:bg-white/10"
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-white/70 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"/>
                            </svg>
                            <span>Altyazı</span>
                          </div>
                          <div className="flex items-center text-white/60">
                            <span className={`font-medium mr-1 ${showSubtitles ? 'text-green-400' : 'text-red-400'}`}>
                              {showSubtitles ? 'Açık' : 'Kapalı'}
                            </span>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                            </svg>
                          </div>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Speed Settings Sub-menu */}
                  {currentSettingsView === 'speed' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                        <button
                          onClick={() => setCurrentSettingsView('main')}
                          className="text-white/70 hover:text-white transition-colors p-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                          </svg>
                        </button>
                        <span className="text-white text-sm font-medium">Hız</span>
                        <div className="w-4"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 px-2">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => changePlaybackSpeed(speed)}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              speed === playbackSpeed 
                                ? 'text-white bg-white/20' 
                                : 'text-white/80 hover:bg-white/10'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quality Settings Sub-menu */}
                  {currentSettingsView === 'quality' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                        <button
                          onClick={() => setCurrentSettingsView('main')}
                          className="text-white/70 hover:text-white transition-colors p-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                          </svg>
                        </button>
                        <span className="text-white text-sm font-medium">Kalite</span>
                        <div className="w-4"></div>
                      </div>
                      {availableQualities.map((quality) => (
                        <button
                          key={quality}
                          onClick={() => changeVideoQuality(quality)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors ${
                            quality === videoQuality 
                              ? 'text-white bg-white/20' 
                              : 'text-white/80 hover:bg-white/10'
                          }`}
                        >
                          <span>{quality}</span>
                          {quality === videoQuality && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Subtitle Settings Sub-menu */}
                  {currentSettingsView === 'subtitles' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                        <button
                          onClick={() => setCurrentSettingsView('main')}
                          className="text-white/70 hover:text-white transition-colors p-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                          </svg>
                        </button>
                        <span className="text-white text-sm font-medium">Altyazı</span>
                        <div className="w-4"></div>
                      </div>
                      
                      {/* Enable/Disable subtitle option */}
                      <button
                        onClick={showSubtitles ? disableSubtitles : enableSubtitles}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors ${
                          showSubtitles 
                            ? 'text-red-400 bg-red-500/10' 
                            : 'text-green-400 bg-green-500/10'
                        }`}
                      >
                        <span>{showSubtitles ? 'Altyazıları Kapat' : 'Altyazıları Aç'}</span>
                        <svg className={`w-4 h-4 ${showSubtitles ? 'text-red-400' : 'text-green-400'}`} fill="currentColor" viewBox="0 0 24 24">
                          {showSubtitles ? (
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          ) : (
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          )}
                        </svg>
                      </button>
                      
                      {/* Subtitle tracks */}
                      {showSubtitles && subtitleTracks.length > 0 && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="text-white/60 text-xs mb-2 px-3">Altyazı seç:</div>
                          <div className="space-y-1">
                            {subtitleTracks.map((track, index) => (
                              <button
                                key={index}
                                onClick={() => selectSubtitleTrack(index)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors ${
                                  track.active 
                                    ? 'text-white bg-white/20' 
                                    : 'text-white/80 hover:bg-white/10'
                                }`}
                              >
                                <span>{track.label}</span>
                                {track.active && (
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fullscreen button */}
            <button
              onClick={toggleFullscreen}
              className="text-white transition-all duration-300 flex items-center justify-center"
            >
              {isFullscreen ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Title overlay */}
      {title && isFullscreen && (
        <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/40 via-black/20 to-transparent transition-all duration-500 z-10 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h3 className="text-white text-xl font-semibold tracking-wide">{title}</h3>
        </div>
      )}

      {/* Subtitle overlay */}
      {showSubtitles && currentSubtitleRef.current && currentSubtitleRef.current.trim() !== '' && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none z-5">
          <div className={`bg-black/70 text-white px-4 py-2 rounded-lg max-w-4xl mx-4 text-center ${isFullscreen ? 'text-2xl' : 'text-lg'}`}>
            <div className={`font-medium leading-relaxed ${isFullscreen ? 'text-2xl' : 'text-lg'}`}>
              {currentSubtitleRef.current}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer; 