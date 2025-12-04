'use client';

import { useMusicStore } from '@/store/use-music-store';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const MusicStoreInitializer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const duration = useMusicStore((state) => state.duration);
  const volume = useMusicStore((state) => state.volume);
  const isEditingTrackName = useMusicStore((state) => state.isEditingTrackName);
  const tracks = useMusicStore((state) => state.tracks);
  const currentTrackIndex = useMusicStore((state) => state.currentTrackIndex);
  const soundRef = useMusicStore((state) => state.soundRef);
  const play = useMusicStore((state) => state.play);
  const pause = useMusicStore((state) => state.pause);
  const setProgress = useMusicStore((state) => state.setProgress);
  const setVolume = useMusicStore((state) => state.setVolume);
  const initializeTrack = useMusicStore((state) => state.initializeTrack);

  // Initialize track when tracks or currentTrackIndex changes
  useEffect(() => {
    if (tracks.length > 0 && currentTrackIndex >= 0 && currentTrackIndex < tracks.length) {
      initializeTrack();
    }
  }, [tracks, currentTrackIndex, initializeTrack]);

  // Progress update interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (soundRef && isPlaying) {
        const seek = soundRef.seek();
        setProgress(seek);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, soundRef, setProgress]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!pathname.includes('favorite')) return;

      if (e.code === 'Space' && !isEditingTrackName) {
        e.preventDefault();
        if (isPlaying) {
          pause();
        } else {
          play();
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const currentSeek = soundRef?.seek() || 0;
        soundRef?.seek(Math.min(currentSeek + 10, duration));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const currentSeek = soundRef?.seek() || 0;
        soundRef?.seek(Math.max(currentSeek - 10, 0));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(Math.min(volume + 0.1, 1));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(Math.max(volume - 0.1, 0));
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setVolume(volume > 0 ? 0 : 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, duration, volume, isEditingTrackName, pathname, play, pause, setVolume, soundRef]);

  // Cleanup on unload
  useEffect(() => {
    const handleUnload = () => {
      tracks.forEach((trackUrl) => URL.revokeObjectURL(trackUrl.url));
    };

    if (tracks.length !== 0) {
      window.addEventListener('unload', handleUnload);
    }

    return () => {
      if (tracks.length !== 0) {
        window.removeEventListener('unload', handleUnload);
      }
    };
  }, [tracks]);

  return <>{children}</>;
};
