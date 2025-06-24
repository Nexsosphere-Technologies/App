import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  SkipForward, 
  SkipBack,
  Maximize,
  Settings,
  User,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  BookOpen,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

interface TutorialVideoProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TutorialChapter {
  id: string;
  title: string;
  duration: number;
  description: string;
  completed: boolean;
}

const TutorialVideo: React.FC<TutorialVideoProps> = ({ onComplete, onSkip }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const chapters: TutorialChapter[] = [
    {
      id: 'intro',
      title: 'Introduction to NexDentify',
      duration: 60,
      description: 'Learn what NexDentify is and how it revolutionizes digital identity',
      completed: false
    },
    {
      id: 'dids',
      title: 'Understanding DIDs',
      duration: 90,
      description: 'Deep dive into Decentralized Identifiers and how they work',
      completed: false
    },
    {
      id: 'credentials',
      title: 'Managing Verifiable Credentials',
      duration: 120,
      description: 'How to request, store, and present your digital credentials',
      completed: false
    },
    {
      id: 'reputation',
      title: 'Building Your Reputation',
      duration: 100,
      description: 'Strategies for building and maintaining your reputation score',
      completed: false
    },
    {
      id: 'staking',
      title: 'Staking and Rewards',
      duration: 80,
      description: 'Learn how to stake NEXDEN tokens and earn rewards',
      completed: false
    },
    {
      id: 'ecosystem',
      title: 'Ecosystem Integration',
      duration: 70,
      description: 'Connecting with platforms and using your reputation',
      completed: false
    }
  ];

  const totalDuration = chapters.reduce((sum, chapter) => sum + chapter.duration, 0);
  const currentChapterData = chapters[currentChapter];
  const progress = (currentTime / totalDuration) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + playbackSpeed;
          
          // Check if we've completed the current chapter
          let chapterStartTime = 0;
          for (let i = 0; i < currentChapter; i++) {
            chapterStartTime += chapters[i].duration;
          }
          
          if (newTime >= chapterStartTime + currentChapterData.duration) {
            // Move to next chapter
            if (currentChapter < chapters.length - 1) {
              setCurrentChapter(prev => prev + 1);
            } else {
              // Tutorial completed
              setIsPlaying(false);
              onComplete();
              return totalDuration;
            }
          }
          
          return Math.min(newTime, totalDuration);
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentChapter, currentChapterData.duration, totalDuration, onComplete]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    
    // Determine which chapter we're in
    let chapterStartTime = 0;
    for (let i = 0; i < chapters.length; i++) {
      if (time >= chapterStartTime && time < chapterStartTime + chapters[i].duration) {
        setCurrentChapter(i);
        break;
      }
      chapterStartTime += chapters[i].duration;
    }
  };

  const handleChapterSelect = (chapterIndex: number) => {
    let chapterStartTime = 0;
    for (let i = 0; i < chapterIndex; i++) {
      chapterStartTime += chapters[i].duration;
    }
    setCurrentChapter(chapterIndex);
    setCurrentTime(chapterStartTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentChapterTime = () => {
    let chapterStartTime = 0;
    for (let i = 0; i < currentChapter; i++) {
      chapterStartTime += chapters[i].duration;
    }
    return currentTime - chapterStartTime;
  };

  const transcript = [
    "Welcome to NexDentify, your gateway to decentralized identity management.",
    "I'm Alex, your AI guide, and I'll walk you through everything you need to know.",
    "Let's start with the basics of decentralized identifiers, or DIDs...",
    "DIDs give you complete control over your digital identity without relying on centralized authorities.",
    "Next, we'll explore verifiable credentials and how they revolutionize digital trust..."
  ];

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        {/* Video Display */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {/* AI Avatar */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-red to-primary-red-dark rounded-full flex items-center justify-center mx-auto">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-xl">AI Guide - Alex</h3>
              <p className="text-gray-300">Chapter {currentChapter + 1}: {currentChapterData.title}</p>
            </div>
          </div>

          {/* Play/Pause Overlay */}
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center group"
          >
            <div className="bg-black/50 rounded-full p-4 group-hover:scale-110 transition-transform">
              {isPlaying ? (
                <Pause className="w-12 h-12 text-white" />
              ) : (
                <Play className="w-12 h-12 text-white ml-1" />
              )}
            </div>
          </button>

          {/* Chapter Progress Indicator */}
          <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-3 py-1">
            <span className="text-white text-sm">
              {formatTime(getCurrentChapterTime())} / {formatTime(currentChapterData.duration)}
            </span>
          </div>

          {/* Settings Button */}
          <button className="absolute top-4 right-4 bg-black/50 rounded-lg p-2 text-white hover:bg-black/70 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Video Controls */}
        <div className="p-4 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-dark-bg rounded-full h-2 cursor-pointer">
              <div
                className="bg-primary-red h-2 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-dark-text-secondary">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                className="text-dark-text hover:text-primary-red transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="text-dark-text hover:text-primary-red transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button
                onClick={() => handleSeek(Math.min(totalDuration, currentTime + 10))}
                className="text-dark-text hover:text-primary-red transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-dark-text hover:text-primary-red transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-dark-bg border border-dark-border rounded px-2 py-1 text-dark-text text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                <BookOpen className="w-5 h-5" />
              </button>
              <button className="text-dark-text-secondary hover:text-dark-text transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Navigation */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-dark-text font-semibold mb-4">Tutorial Chapters</h3>
        <div className="space-y-2">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => handleChapterSelect(index)}
              className={`w-full p-3 rounded-lg border transition-colors text-left ${
                index === currentChapter
                  ? 'border-primary-red bg-primary-red/10'
                  : 'border-dark-border hover:border-primary-red-light/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    chapter.completed
                      ? 'bg-green-500'
                      : index === currentChapter
                      ? 'bg-primary-red'
                      : 'bg-dark-bg'
                  }`}>
                    {chapter.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-dark-text font-medium">{chapter.title}</h4>
                    <p className="text-sm text-dark-text-secondary">{chapter.description}</p>
                  </div>
                </div>
                <span className="text-sm text-dark-text-secondary">
                  {formatTime(chapter.duration)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transcript */}
      {showTranscript && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-dark-text font-semibold mb-4">Transcript</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {transcript.map((line, index) => (
              <p key={index} className="text-sm text-dark-text-secondary leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Additional Resources */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-dark-text font-semibold mb-4">Additional Resources</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-dark-bg border border-dark-border rounded-lg p-3 hover:border-primary-red-light/30 transition-colors flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="text-dark-text text-sm">Documentation</span>
          </button>
          <button className="bg-dark-bg border border-dark-border rounded-lg p-3 hover:border-primary-red-light/30 transition-colors flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <span className="text-dark-text text-sm">Community</span>
          </button>
          <button className="bg-dark-bg border border-dark-border rounded-lg p-3 hover:border-primary-red-light/30 transition-colors flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            <span className="text-dark-text text-sm">FAQ</span>
          </button>
          <button className="bg-dark-bg border border-dark-border rounded-lg p-3 hover:border-primary-red-light/30 transition-colors flex items-center space-x-2">
            <ExternalLink className="w-5 h-5 text-orange-500" />
            <span className="text-dark-text text-sm">API Docs</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onSkip}
          className="flex-1 bg-dark-card border border-dark-border text-dark-text py-3 rounded-xl font-semibold hover:border-primary-red-light/30 transition-colors"
        >
          Skip Tutorial
        </button>
        <button
          onClick={onComplete}
          className="flex-1 bg-gradient-to-r from-primary-red to-primary-red-dark text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
        >
          <span>Complete Setup</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TutorialVideo;