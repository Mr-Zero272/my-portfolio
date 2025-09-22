'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cleanHtmlContent, estimateReadingTime, formatReadingTime } from '@/lib/text';
import { cn } from '@/lib/utils';
import { PauseIcon, PlayIcon, Square, Volume2Icon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  content: string;
  className?: string;
  showProgress?: boolean;
  showEstimatedTime?: boolean;
};

type ReadingState = 'idle' | 'reading' | 'paused' | 'stopped';

const ReadPost = ({ content, className, showProgress = false, showEstimatedTime = false }: Props) => {
  const [lang, setLang] = useState('vi-VN');
  const [readingState, setReadingState] = useState<ReadingState>('idle');
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanedContent = cleanHtmlContent(content);
  const estimatedTime = estimateReadingTime(cleanedContent);

  const startProgressTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / (estimatedTime * 1000)) * 100, 99);
      setProgress(progressPercent);
    }, 100);
  }, [estimatedTime]);

  const handleRead = useCallback(() => {
    if (readingState === 'reading') {
      // Pause reading
      window.speechSynthesis.pause();
      setReadingState('paused');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    if (readingState === 'paused') {
      // Resume reading
      window.speechSynthesis.resume();
      setReadingState('reading');
      startProgressTracking();
      return;
    }

    // Start new reading
    if (!cleanedContent.trim()) {
      console.warn('No content to read');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedContent);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setReadingState('reading');
      setProgress(0);
      startProgressTracking();
    };

    utterance.onend = () => {
      setReadingState('idle');
      setProgress(100);
      utteranceRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setReadingState('idle');
      setProgress(0);
      utteranceRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    utterance.onpause = () => {
      setReadingState('paused');
    };

    utterance.onresume = () => {
      setReadingState('reading');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [readingState, cleanedContent, lang, startProgressTracking]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setReadingState('idle');
    setProgress(0);
    utteranceRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle visibility change to pause when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && readingState === 'reading') {
        window.speechSynthesis.pause();
        setReadingState('paused');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [readingState]);

  const getButtonIcon = () => {
    switch (readingState) {
      case 'reading':
        return <PauseIcon className="h-4 w-4" />;
      case 'paused':
        return <PlayIcon className="h-4 w-4" />;
      default:
        return <Volume2Icon className="h-4 w-4" />;
    }
  };

  const getButtonTitle = () => {
    switch (readingState) {
      case 'reading':
        return 'Pause reading';
      case 'paused':
        return 'Resume reading';
      default:
        return 'Start reading aloud';
    }
  };

  const isContentEmpty = !cleanedContent.trim();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        <Button
          variant={readingState === 'reading' ? 'default' : 'ghost'}
          size="icon"
          onClick={handleRead}
          title={getButtonTitle()}
          disabled={isContentEmpty}
          className={cn('transition-all duration-200', readingState === 'reading' && 'bg-blue-600 hover:bg-blue-700')}
        >
          {getButtonIcon()}
        </Button>

        {readingState !== 'idle' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStop}
            title="Stop reading"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Square className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress and time display */}
      {(showProgress || showEstimatedTime) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {showProgress && readingState !== 'idle' && (
            <div className="flex items-center gap-1">
              <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs">{Math.round(progress)}%</span>
            </div>
          )}

          {showEstimatedTime && estimatedTime > 0 && (
            <span className="text-xs text-gray-500">~{formatReadingTime(estimatedTime)}</span>
          )}
        </div>
      )}
      <Select value={lang} onValueChange={(value) => setLang(value)} disabled={readingState === 'reading'}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en-US">English</SelectItem>
          <SelectItem value="vi-VN">Vietnamese</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReadPost;
