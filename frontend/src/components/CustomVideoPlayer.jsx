import React, { useState, useRef, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import useIsMobile from '../hooks/useIsMobile';
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiVolumeX, 
  FiMaximize, 
  FiMinimize,
  FiChevronRight,
  FiChevronLeft,
  FiCheck,
  FiX,
  FiClock,
  FiMonitor,
  FiType,
  FiVolume,
  FiMoreVertical,
  FiDownload,
  FiShare2,
  FiInfo,
  FiRotateCw,
  FiSettings
} from 'react-icons/fi';
import { IoMdSettings } from 'react-icons/io';

const CustomVideoPlayer = ({ src, poster, title, onTimeUpdate, onEnded, subtitles = [], autoPlay = false, qualitySources = {} }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const subtitlePopupRef = useRef(null);
  const currentSubtitleRef = useRef(null);
  const isMobile = useIsMobile();
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
  
  // Mobile bottom sheet modal state
  const [showMobileSettingsModal, setShowMobileSettingsModal] = useState(false);
  
  // Custom right-click menu state
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

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
        
        // Video kalite seçeneklerini belirle
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        // Mevcut video çözünürlüğü
        const currentQuality = `${videoWidth}x${videoHeight}`;
        
        // Kalite seçeneklerini oluştur (mevcut kaliteden düşüğe doğru)
        const qualityOptions = [];
        
        // Mevcut çözünürlük
        qualityOptions.push(currentQuality);
        
        // Mevcut kaliteden düşük kaliteleri ekle
        if (videoHeight > 720) {
          qualityOptions.push('1280x720'); // HD
        }
        if (videoHeight > 480) {
          qualityOptions.push('854x480'); // SD
        }
        if (videoHeight > 360) {
          qualityOptions.push('640x360'); // Low
        }
        
        // Otomatik seçeneği en sona ekle
        qualityOptions.push('auto');
        
        // Mevcut çözünürlük zaten listedeyse tekrar ekleme
        const uniqueQualities = qualityOptions.filter((quality, index, arr) => 
          arr.indexOf(quality) === index
        );
        
        setAvailableQualities(uniqueQualities);
        setVideoQuality(currentQuality); // Varsayılan olarak mevcut çözünürlüğü seç
        
        console.log('Video kalite seçenekleri yüklendi:', uniqueQualities);
        console.log('Mevcut video çözünürlüğü:', currentQuality);
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

  const toggleSubtitlePopup = () => {
    setShowSubtitlePopup(!showSubtitlePopup);
    setShowSpeedMenu(false);
    setShowQualityMenu(false);
    setShowSettingsMenu(false);
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
    if (isMobile) {
      setShowMobileSettingsModal(false);
    }
    console.log('Switched to subtitle track:', trackIndex);
  };

  const enableSubtitles = () => {
    setShowSubtitles(true);
    setShowSubtitlePopup(false);
    setShowSettingsMenu(false);
    setCurrentSettingsView('main');
    if (isMobile) {
      setShowMobileSettingsModal(false);
    }
    
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
    if (isMobile) {
      setShowMobileSettingsModal(false);
    }
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
    if (!time || isNaN(time)) return '00:00:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
      if (isMobile) {
        setShowMobileSettingsModal(false);
      }
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
    if (isMobile) {
      setShowMobileSettingsModal(!showMobileSettingsModal);
      setCurrentSettingsView('main');
    } else {
      setShowSettingsMenu(!showSettingsMenu);
      setShowSpeedMenu(false);
      setShowQualityMenu(false);
      setShowSubtitlePopup(false);
      if (!showSettingsMenu) {
        setCurrentSettingsView('main');
      }
    }
  };

  const closeMobileSettingsModal = () => {
    setShowMobileSettingsModal(false);
    setCurrentSettingsView('main');
  };

  const getQualityDisplayName = (quality) => {
    if (quality === 'auto') return 'Otomatik';
    
    // Çözünürlük bilgisini parse et
    const [width, height] = quality.split('x').map(Number);
    
    // HD ve 4K etiketlerini belirle
    let qualityLabel = '';
    if (width >= 2560 && height >= 1440) {
      qualityLabel = <span className="text-red-400 text-xs ml-2 font-semibold bg-red-400/10 px-2 py-1 rounded">4K</span>;
    } else if (width >= 1280 && height >= 720) {
      qualityLabel = <span className="text-red-400 text-xs ml-2 font-semibold bg-red-400/10 px-2 py-1 rounded">HD</span>;
    }
    
    // Çözünürlüğü p formatında göster
    let displayQuality = quality;
    if (height === 1080) displayQuality = '1080p';
    else if (height === 720) displayQuality = '720p';
    else if (height === 480) displayQuality = '480p';
    else if (height === 360) displayQuality = '360p';
    
    return (
      <div className="flex items-center justify-between w-full">
        <span>{displayQuality}</span>
        {qualityLabel}
      </div>
    );
  };

  const changeVideoQuality = (quality) => {
    setVideoQuality(quality);
    setShowQualityMenu(false);
    setShowSettingsMenu(false);
    setCurrentSettingsView('main');
    if (isMobile) {
      setShowMobileSettingsModal(false);
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    if (quality === 'auto') {
      console.log('Video kalitesi otomatik olarak ayarlandı');
      // Otomatik kalite için video source'unu orijinal hale getir
      video.src = src;
      video.setAttribute('data-quality', 'auto');
    } else {
      console.log('Video kalitesi değiştirildi:', quality);
      
      // Seçilen çözünürlüğe göre video source'unu değiştir
      const [width, height] = quality.split('x').map(Number);
      
      // QualitySources prop'undan uygun video URL'ini al
      let newVideoSrc = src; // Varsayılan olarak orijinal source
      
      // Eğer qualitySources prop'u varsa ve seçilen kalite için URL varsa kullan
      if (qualitySources && qualitySources[quality]) {
        newVideoSrc = qualitySources[quality];
        console.log('Yeni video URL yükleniyor:', newVideoSrc);
      }
      
      // Video source'unu değiştir
      video.src = newVideoSrc;
      video.setAttribute('data-quality', quality);
      
      // Video container'ın aspect ratio'sunu güncelle
      const aspectRatio = width / height;
      setVideoAspectRatio(aspectRatio);
      
      // Video elementinin boyutunu ayarla
      video.style.width = '100%';
      video.style.height = '100%';
      
      // Video'yu yeniden yükle
      video.load();
      
      // Eğer video oynatılıyorsa, yeni kalitede devam et
      if (isPlaying) {
        const currentTime = video.currentTime;
        video.currentTime = currentTime;
        video.play().catch(error => {
          console.log('Video yeniden oynatılamadı:', error);
        });
      }
    }
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

  // Custom right-click menu handlers
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Determine if click is in top or bottom half of the player
    const isTopHalf = y < rect.height / 2;
    
    // Ensure menu stays within container bounds
    const menuWidth = 192; // min-w-48 = 12rem = 192px
    const menuHeight = 400; // Approximate height
    
    // Adjust X position if menu would go outside right edge
    if (x + menuWidth/2 > rect.width) {
      x = rect.width - menuWidth/2;
    }
    if (x - menuWidth/2 < 0) {
      x = menuWidth/2;
    }
    
    // Adjust Y position based on which half was clicked
    if (isTopHalf) {
      // Clicked in top half - show menu below cursor
      if (y + menuHeight > rect.height) {
        y = rect.height - menuHeight - 20; // Ensure menu fits
      }
    } else {
      // Clicked in bottom half - show menu above cursor
      if (y - menuHeight < 0) {
        y = menuHeight + 20; // Ensure menu fits
      }
    }
    
    setContextMenuPosition({ x, y, isTopHalf });
    setShowContextMenu(true);
    
    // Close context menu when clicking outside
    const handleClickOutside = () => {
      setShowContextMenu(false);
      document.removeEventListener('click', handleClickOutside);
    };
    
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);
  };

  const handleContextMenuAction = (action) => {
    setShowContextMenu(false);
    
    switch (action) {
      case 'playPause':
        togglePlay();
        break;
      case 'fullscreen':
        toggleFullscreen();
        break;
      case 'mute':
        toggleMute();
        break;
      case 'settings':
        toggleSettingsMenu();
        break;
      case 'speed':
        toggleSpeedMenu();
        break;
      case 'quality':
        toggleQualityMenu();
        break;
      case 'subtitles':
        if (subtitleTracks.length > 0) {
          toggleSubtitlePopup();
        }
        break;
      case 'reset':
        resetVideo();
        break;
      case 'info':
        showVideoInfo();
        break;
      case 'toggleSubtitles':
        if (subtitleTracks.length > 0) {
          setShowSubtitles(!showSubtitles);
          setShowSubtitlePopup(false); // Close subtitle popup if open
          setShowSettingsMenu(false); // Close settings menu if open
          setCurrentSettingsView('main');
          console.log('Subtitles toggled:', showSubtitles ? 'Disabled' : 'Enabled');
        }
        break;
      default:
        break;
    }
  };

  const resetVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        video.play().catch(console.error);
      }
    }
  };

  const showVideoInfo = () => {
    const video = videoRef.current;
    if (video) {
      const info = {
        title: title || 'Video',
        duration: formatTime(duration),
        currentTime: formatTime(currentTime),
        volume: Math.round(volume * 100),
        muted: isMuted,
        playbackSpeed: playbackSpeed,
        quality: videoQuality,
        subtitles: subtitleTracks.length > 0 ? `${subtitleTracks.length} track(s)` : 'None',
        fullscreen: isFullscreen
      };
      
      alert(`Video Information:\n${Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n')}`);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full'} ${!showControls ? 'cursor-none' : ''} ${!isFullscreen ? 'rounded-none lg:rounded-xl' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
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
          onContextMenu={handleContextMenu}
          data-quality={videoQuality}
        />
      </div>

      {/* Buffering indicator */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-15">
          <LoadingSpinner size="large" text="Yükleniyor..." className="text-white" />
        </div>
      )}

      {/* Center play button overlay */}
      {!isPlaying && !buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-15">
          <button
            onClick={togglePlay}
            className="transition-all duration-300"
          >
            <img src="/playerlogo.svg" alt="Play" className="w-24 h-16 object-contain transition-all duration-300" />
          </button>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent transition-all duration-500 z-10 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Progress bar */}
        <div className="px-6 py-0">
          <div 
            className="relative w-full h-1 bg-white/10 rounded-full cursor-pointer group"
            onClick={handleSeek}
            onMouseMove={handleProgressHover}
            onMouseLeave={handleProgressLeave}
          >
            {/* Progress fill */}
            <div 
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 ease-out"
              style={{ 
                width: `${(currentTime / duration) * 100}%`,
                background: 'linear-gradient(to right, #f5f5f7,rgb(210, 242, 255))'
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
                <div className="relative w-full h-1 bg-white/10 rounded-full">
                  {/* Volume fill */}
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-200"
                    style={{ 
                      width: `${(isMuted ? 0 : volume) * 100}%`,
                      background: 'linear-gradient(to right, #f5f5f7, #f5f5f7)'
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
                <IoMdSettings className="w-6 h-6" />
              </button>
              
              {/* Desktop Settings Menu */}
              {!isMobile && showSettingsMenu && (
                <div className="absolute bottom-full right-0 mb-4 bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 min-w-96 w-96 shadow-2xl z-20">
                  {/* Main Settings Menu */}
                  {currentSettingsView === 'main' && (
                    <div className="space-y-3">
                      {/* Playback Speed Option */}
                      <button
                        onClick={() => setCurrentSettingsView('speed')}
                        className="w-full flex items-center justify-between px-6 py-5 text-base rounded-xl hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white group"
                      >
                        <div className="flex items-center">
                          <FiClock className="w-5 h-5 text-white/60 mr-4 group-hover:text-white/80 transition-colors" />
                          <span className="font-medium">Oynatma Hızı</span>
                        </div>
                        <div className="flex items-center text-white/60 group-hover:text-white/80 transition-colors">
                          <span className="text-white font-semibold mr-3">{playbackSpeed}x</span>
                          <FiChevronRight className="w-4 h-4" />
                        </div>
                      </button>

                      {/* Video Quality Option */}
                      <button
                        onClick={() => setCurrentSettingsView('quality')}
                        className="w-full flex items-center justify-between px-6 py-5 text-base rounded-xl hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white group"
                      >
                        <div className="flex items-center">
                          <FiMonitor className="w-5 h-5 text-white/60 mr-4 group-hover:text-white/80 transition-colors" />
                          <span className="font-medium">Video Kalitesi</span>
                        </div>
                        <div className="flex items-center text-white/60 group-hover:text-white/80 transition-colors">
                          <span className="text-white font-semibold mr-3">{getQualityDisplayName(videoQuality)}</span>
                          <FiChevronRight className="w-4 h-4" />
                        </div>
                      </button>

                      {/* Subtitle Option */}
                      {(subtitleTracks.length > 0 || (subtitles && subtitles.length > 0)) && (
                        <button
                          onClick={() => setCurrentSettingsView('subtitles')}
                          className="w-full flex items-center justify-between px-6 py-5 text-base rounded-xl hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white group"
                        >
                          <div className="flex items-center">
                            <FiType className="w-5 h-5 text-white/60 mr-4 group-hover:text-white/80 transition-colors" />
                            <span className="font-medium">Altyazı</span>
                          </div>
                          <div className="flex items-center text-white/60 group-hover:text-white/80 transition-colors">
                            <span className={`font-semibold mr-3 ${showSubtitles ? 'text-green-400' : 'text-red-400'}`}>
                              {showSubtitles ? 'Açık' : 'Kapalı'}
                            </span>
                            <FiChevronRight className="w-4 h-4" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Speed Settings Sub-menu */}
                  {currentSettingsView === 'speed' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2 py-2">
                        <button
                          onClick={() => setCurrentSettingsView('main')}
                          className="text-white/60 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"
                        >
                          <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-white text-lg font-semibold">Oynatma Hızı</span>
                        <div className="w-11"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 px-2">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => changePlaybackSpeed(speed)}
                            className={`px-4 py-4 text-base rounded-xl transition-all duration-200 font-medium ${
                              speed === playbackSpeed 
                                ? 'text-white bg-red-600 shadow-lg' 
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2 py-2">
                        <button
                          onClick={() => setCurrentSettingsView('main')}
                          className="text-white/60 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"
                        >
                          <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-white text-lg font-semibold">Video Kalitesi</span>
                        <div className="w-11"></div>
                      </div>
                      <div className="space-y-2">
                        {availableQualities.map((quality) => (
                          <button
                            key={quality}
                            onClick={() => changeVideoQuality(quality)}
                            className={`w-full flex items-center justify-between px-5 py-4 text-base rounded-xl transition-all duration-200 ${
                              quality === videoQuality 
                                ? 'text-white bg-red-600 shadow-lg' 
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span className="font-medium">{getQualityDisplayName(quality)}</span>
                            {quality === videoQuality && (
                              <FiCheck className="w-5 h-5 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subtitle Settings Sub-menu */}
                  {currentSettingsView === 'subtitles' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2 py-2">
                        <button
                          onClick={() => setCurrentSettingsView('main')}
                          className="text-white/60 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"
                        >
                          <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-white text-lg font-semibold">Altyazı</span>
                        <div className="w-11"></div>
                      </div>
                      
                      {/* Enable/Disable subtitle option */}
                      <button
                        onClick={showSubtitles ? disableSubtitles : enableSubtitles}
                        className={`w-full flex items-center justify-between px-5 py-4 text-base rounded-xl transition-all duration-200 font-medium ${
                          showSubtitles 
                            ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30' 
                            : 'text-green-400 bg-green-500/20 hover:bg-green-500/30'
                        }`}
                      >
                        <span>{showSubtitles ? 'Altyazıları Kapat' : 'Altyazıları Aç'}</span>
                        {showSubtitles ? (
                          <FiX className="w-5 h-5 text-red-400" />
                        ) : (
                          <FiCheck className="w-5 h-5 text-green-400" />
                        )}
                      </button>
                      
                      {/* Subtitle tracks */}
                      {showSubtitles && subtitleTracks.length > 0 && (
                        <div className="pt-4">
                          <div className="text-white/60 text-sm mb-4 px-2 font-medium">Altyazı Seç:</div>
                          <div className="space-y-2">
                            {subtitleTracks.map((track, index) => (
                              <button
                                key={index}
                                onClick={() => selectSubtitleTrack(index)}
                                className={`w-full flex items-center justify-between px-5 py-4 text-base rounded-xl transition-all duration-200 ${
                                  track.active 
                                    ? 'text-white bg-red-600 shadow-lg' 
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                <span className="font-medium">{track.label}</span>
                                {track.active && (
                                  <FiCheck className="w-5 h-5 text-white" />
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

      {/* Custom Right-Click Context Menu */}
      {showContextMenu && (
        <div 
          className="absolute z-50 bg-gray-900/95 border border-gray-700 rounded-lg shadow-2xl py-2 min-w-48"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
            transform: contextMenuPosition.isTopHalf ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'
          }}
        >
          {/* Play/Pause */}
          <button
            onClick={() => handleContextMenuAction('playPause')}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700/50 transition-colors duration-200 text-left"
          >
            {isPlaying ? (
              <>
                <FiPause className="w-4 h-4 mr-3 text-gray-300" />
                <span>Duraklat</span>
              </>
            ) : (
              <>
                <FiPlay className="w-4 h-4 mr-3 text-gray-300" />
                <span>Oynat</span>
              </>
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => handleContextMenuAction('fullscreen')}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700/50 transition-colors duration-200 text-left"
          >
            {isFullscreen ? (
              <>
                <FiMinimize className="w-4 h-4 mr-3 text-gray-300" />
                <span>Küçült</span>
              </>
            ) : (
              <>
                <FiMaximize className="w-4 h-4 mr-3 text-gray-300" />
                <span>Tam Ekran</span>
              </>
            )}
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={() => handleContextMenuAction('mute')}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700/50 transition-colors duration-200 text-left"
          >
            {isMuted ? (
              <>
                <FiVolume2 className="w-4 h-4 mr-3 text-gray-300" />
                <span>Sesi Aç</span>
              </>
            ) : (
              <>
                <FiVolumeX className="w-4 h-4 mr-3 text-gray-300" />
                <span>Sesi Kapat</span>
              </>
            )}
          </button>

          <div className="border-t border-gray-700 my-1"></div>

          {/* Subtitles */}
          {subtitleTracks.length > 0 && (
            <button
              onClick={() => handleContextMenuAction('subtitles')}
              className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700/50 transition-colors duration-200 text-left"
            >
              <FiType className="w-4 h-4 mr-3 text-gray-300" />
              <span>Altyazılar</span>
            </button>
          )}

          {/* Subtitle Toggle - Direct Enable/Disable */}
          {subtitleTracks.length > 0 && (
            <button
              onClick={() => handleContextMenuAction('toggleSubtitles')}
              className={`w-full flex items-center px-4 py-3 transition-all duration-200 text-left ${
                showSubtitles 
                  ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300' 
                  : 'text-green-400 hover:bg-green-500/20 hover:text-green-300'
              }`}
            >
              {showSubtitles ? (
                <>
                  <FiX className="w-4 h-4 mr-3 text-red-400" />
                  <span className="font-medium">Altyazıları Kapat</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4 mr-3 text-green-400" />
                  <span className="font-medium">Altyazıları Aç</span>
                </>
              )}
            </button>
          )}

          <div className="border-t border-gray-700 my-1"></div>

          {/* Settings */}
          <button
            onClick={() => handleContextMenuAction('settings')}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700/50 transition-colors duration-200 text-left"
          >
            <FiSettings className="w-4 h-4 mr-3 text-gray-300" />
            <span>Ayarlar</span>
          </button>

          {/* Reset Video */}
          <button
            onClick={() => handleContextMenuAction('reset')}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700/50 transition-colors duration-200 text-left"
          >
            <FiRotateCw className="w-4 h-4 mr-3 text-gray-300" />
            <span>Videoyu Sıfırla</span>
          </button>

          {/* Video Info */}
          <button
            onClick={() => handleContextMenuAction('info')}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-gray-700/50 transition-colors duration-200 text-left"
          >
            <FiInfo className="w-4 h-4 mr-3 text-gray-300" />
            <span>Video Bilgileri</span>
          </button>
        </div>
      )}

      {/* Mobile Bottom Sheet Settings Modal */}
      {isMobile && showMobileSettingsModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeMobileSettingsModal}
          />
          
          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 ease-out">
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video Ayarları</h3>
                <button
                  onClick={closeMobileSettingsModal}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {/* Main Settings Menu */}
              {currentSettingsView === 'main' && (
                <div className="space-y-2">
                  {/* Playback Speed Option */}
                  <button
                    onClick={() => setCurrentSettingsView('speed')}
                    className="w-full flex items-center justify-between px-4 py-4 text-base rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                  >
                    <div className="flex items-center">
                      <FiClock className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-4" />
                      <span className="font-medium">Oynatma Hızı</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <span className="text-gray-900 dark:text-white font-semibold mr-3">{playbackSpeed}x</span>
                      <FiChevronRight className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Video Quality Option */}
                  <button
                    onClick={() => setCurrentSettingsView('quality')}
                    className="w-full flex items-center justify-between px-4 py-4 text-base rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                  >
                    <div className="flex items-center">
                      <FiMonitor className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-4" />
                      <span className="font-medium">Video Kalitesi</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <span className="text-gray-900 dark:text-white font-semibold mr-3">{getQualityDisplayName(videoQuality)}</span>
                      <FiChevronRight className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Subtitle Option */}
                  {(subtitleTracks.length > 0 || (subtitles && subtitles.length > 0)) && (
                    <button
                      onClick={() => setCurrentSettingsView('subtitles')}
                      className="w-full flex items-center justify-between px-4 py-4 text-base rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                    >
                      <div className="flex items-center">
                        <FiType className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-4" />
                        <span className="font-medium">Altyazı</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <span className={`font-semibold mr-3 ${showSubtitles ? 'text-green-500' : 'text-red-500'}`}>
                          {showSubtitles ? 'Açık' : 'Kapalı'}
                        </span>
                        <FiChevronRight className="w-5 h-5" />
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Speed Settings Sub-menu */}
              {currentSettingsView === 'speed' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setCurrentSettingsView('main')}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-gray-900 dark:text-white text-xl font-semibold">Oynatma Hızı</span>
                    <div className="w-10"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 px-2 pb-4">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => changePlaybackSpeed(speed)}
                        className={`px-6 py-4 text-lg rounded-xl transition-colors font-medium ${
                          speed === playbackSpeed 
                            ? 'text-white bg-brand-orange' 
                            : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setCurrentSettingsView('main')}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-gray-900 dark:text-white text-xl font-semibold">Video Kalitesi</span>
                    <div className="w-10"></div>
                  </div>
                  {availableQualities.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => changeVideoQuality(quality)}
                      className={`w-full flex items-center justify-between px-4 py-4 text-base rounded-xl transition-colors ${
                        quality === videoQuality 
                          ? 'text-white bg-brand-orange' 
                          : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="font-medium">{getQualityDisplayName(quality)}</span>
                      {quality === videoQuality && (
                        <FiCheck className="w-6 h-6 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Subtitle Settings Sub-menu */}
              {currentSettingsView === 'subtitles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setCurrentSettingsView('main')}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-gray-900 dark:text-white text-xl font-semibold">Altyazı</span>
                    <div className="w-10"></div>
                  </div>
                  
                  {/* Enable/Disable subtitle option */}
                  <button
                    onClick={showSubtitles ? disableSubtitles : enableSubtitles}
                    className={`w-full flex items-center justify-between px-4 py-4 text-base rounded-xl transition-colors font-medium ${
                      showSubtitles 
                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                        : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}
                  >
                    <span>{showSubtitles ? 'Altyazıları Kapat' : 'Altyazıları Aç'}</span>
                    {showSubtitles ? (
                      <FiX className="w-6 h-6 text-red-600 dark:text-red-400" />
                    ) : (
                      <FiCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                  </button>
                  
                  {/* Subtitle tracks */}
                  {showSubtitles && subtitleTracks.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 px-4 font-medium">Altyazı Seç:</div>
                      <div className="space-y-2">
                        {subtitleTracks.map((track, index) => (
                          <button
                            key={index}
                            onClick={() => selectSubtitleTrack(index)}
                            className={`w-full flex items-center justify-between px-4 py-4 text-base rounded-xl transition-colors ${
                              track.active 
                                ? 'text-white bg-brand-orange' 
                                : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <span className="font-medium">{track.label}</span>
                            {track.active && (
                              <FiCheck className="w-6 h-6 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomVideoPlayer; 