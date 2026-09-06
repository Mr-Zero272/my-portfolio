import type { Track } from '@/features/music-player/types/music';
import { Howl } from 'howler';
import { toast } from 'sonner';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface MusicState {
  // Playlist
  tracks: Track[];
  currentTrackIndex: number;

  // Playback
  isPlaying: boolean;
  progress: number;
  duration: number;
  repeat: boolean;
  isShuffle: boolean;
  volume: number;
  soundRef: Howl | null;
  currentTrackSrcRef: string | null;
  sleepTimerTarget: number | null;

  // Actions
  addTracks: (tracks: Track[]) => void;
  reorderTracks: (tracks: Track[]) => void;
  setTrack: (index: number) => void;
  removeTrack: (trackId: string) => void;
  clearPlaylist: () => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  shuffle: () => void;
  toggleRepeat: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  initializeTrack: () => void;
  cleanupSound: () => void;
  setSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
  checkSleepTimer: () => void;
}

const STOPPED_STATE = {
  soundRef: null,
  currentTrackSrcRef: null,
  isPlaying: false,
  progress: 0,
} as const;

function revokeTrackUrls(track: Track) {
  URL.revokeObjectURL(track.url);
  if (track.metadata.cover) {
    URL.revokeObjectURL(track.metadata.cover);
  }
}

export const useMusicStore = create<MusicState>((set, get) => {
  const currentSrc = () => {
    const { tracks, currentTrackIndex } = get();
    return tracks[currentTrackIndex]?.url ?? null;
  };

  // Howler only emits `onseek` when `seek(value)` is called explicitly, so a
  // live position must be polled while the sound is playing; otherwise `progress`
  // stays frozen at 0 and the UI would show a stuck 0:00.
  let progressTimer: ReturnType<typeof setInterval> | null = null;

  const stopProgressTicker = () => {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  };

  const startProgressTicker = () => {
    // Called from `onplay`, which can fire repeatedly (play/pause/play, track
    // switching, on-end auto-advance). Clearing first guarantees a single poller.
    stopProgressTicker();
    progressTimer = setInterval(() => {
      const sound = get().soundRef;
      if (!sound) return;

      // `html5` sounds may only report duration after playback actually starts;
      // refresh it lazily in case `onload` fired before it was available.
      const { duration } = get();
      if (duration <= 0) {
        const realDuration = sound.duration();
        if (realDuration > 0) set({ duration: realDuration });
      }

      const seek = sound.seek();
      if (typeof seek === 'number') set({ progress: seek });
    }, 500);
  };

  const unloadSound = () => {
    const { soundRef } = get();
    stopProgressTicker();
    soundRef?.unload();
    set({ soundRef: null, currentTrackSrcRef: null });
  };

  /**
   * Make sure a Howl exists for the CURRENT track.
   * - Same src already loaded -> returns it untouched (resume / keep playing).
   * - Different src (or none yet) -> unloads the old one and builds a new Howl.
   * Never autoplays by itself: callers decide when to start playback.
   */
  const ensureCurrentSound = (): Howl | null => {
    const src = currentSrc();
    if (!src) return null;

    const { soundRef, currentTrackSrcRef, volume } = get();
    if (soundRef && currentTrackSrcRef === src) return soundRef;

    soundRef?.unload();
    const newSound = new Howl({
      src: [src],
      html5: true,
      volume,
      onplay: () => {
        set({ isPlaying: true });
        startProgressTicker();
      },
      onpause: () => {
        set({ isPlaying: false });
        stopProgressTicker();
      },
      onstop: () => {
        set({ isPlaying: false, progress: 0 });
        stopProgressTicker();
      },
      onend: () => {
        stopProgressTicker();
        set({ isPlaying: false, progress: 0 });
        const { repeat, tracks } = get();
        if (repeat || tracks.length <= 1) {
          get().play();
        } else {
          get().nextTrack();
          get().play();
        }
      },
      onseek: () => {
        const seek = get().soundRef?.seek() || 0;
        set({ progress: seek });
      },
      onload: () => {
        set({ duration: get().soundRef?.duration() || 0 });
      },
    });

    set({ soundRef: newSound, currentTrackSrcRef: src, progress: 0 });
    return newSound;
  };

  return {
    // Playlist
    tracks: [],
    currentTrackIndex: -1,

    // Playback
    isPlaying: false,
    progress: 0,
    duration: 0,
    repeat: false,
    isShuffle: false,
    volume: 1.0,
    soundRef: null,
    currentTrackSrcRef: null,
    sleepTimerTarget: null,

    // ---------- Playlist ----------
    addTracks: (newTracks) => {
      if (newTracks.length === 0) return;
      const { tracks, currentTrackIndex } = get();
      const shouldAutoSelect = tracks.length === 0 && currentTrackIndex < 0;
      set({
        tracks: [...tracks, ...newTracks],
        currentTrackIndex: shouldAutoSelect ? 0 : currentTrackIndex,
      });
    },

    reorderTracks: (newTracks) => {
      const { tracks, currentTrackIndex } = get();

      // No valid current track -> keep -1 (never auto-select on reorder)
      if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) {
        set({ tracks: newTracks, currentTrackIndex: -1 });
        return;
      }

      const currentTrack = tracks[currentTrackIndex];
      const newIndex = newTracks.findIndex((t) => t.id === currentTrack.id);

      // The audio src does not change on reorder, so soundRef is left untouched:
      // playback keeps running seamlessly and only the index follows the track.
      set({ tracks: newTracks, currentTrackIndex: newIndex >= 0 ? newIndex : 0 });
    },

    setTrack: (index) => {
      const { tracks } = get();
      if (index < 0 || index >= tracks.length) return;
      // Select and play this track ("click to play").
      set({ currentTrackIndex: index });
      get().play();
    },

    removeTrack: (trackId) => {
      const {
        tracks,
        currentTrackIndex,
        soundRef,
        currentTrackSrcRef,
        isPlaying,
        progress,
      } = get();
      const index = tracks.findIndex((t) => t.id === trackId);
      if (index === -1) return;

      revokeTrackUrls(tracks[index]);
      const updatedTracks = tracks.filter((t) => t.id !== trackId);

      if (updatedTracks.length === 0) {
        soundRef?.unload();
        set({ tracks: [], currentTrackIndex: -1, ...STOPPED_STATE, duration: 0 });
        return;
      }

      const wasCurrent = index === currentTrackIndex;
      const removedBeforeCurrent = currentTrackIndex >= 0 && index < currentTrackIndex;

      if (wasCurrent) {
        soundRef?.unload();
        // Fall back to the next track, or the previous one when the last was removed.
        const nextIndex = Math.min(currentTrackIndex, updatedTracks.length - 1);
        set({
          tracks: updatedTracks,
          currentTrackIndex: nextIndex,
          ...STOPPED_STATE,
          duration: 0,
        });
        return;
      }

      set({
        tracks: updatedTracks,
        currentTrackIndex: removedBeforeCurrent ? currentTrackIndex - 1 : currentTrackIndex,
        soundRef,
        currentTrackSrcRef,
        isPlaying,
        progress,
      });
    },

    clearPlaylist: () => {
      const { tracks } = get();
      for (const track of tracks) {
        revokeTrackUrls(track);
      }
      unloadSound();
      set({
        tracks: [],
        currentTrackIndex: -1,
        ...STOPPED_STATE,
        duration: 0,
        sleepTimerTarget: null,
      });
    },

    // ---------- Playback control ----------
    play: () => {
      const { tracks, currentTrackIndex } = get();
      if (tracks.length === 0) {
        toast.info('You need to add some music files to play');
        return;
      }
      // After an import there is no Howl yet; make sure one exists for the
      // currently selected track (creates / swaps it), then start playback.
      if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) {
        set({ currentTrackIndex: 0 });
      }
      ensureCurrentSound()?.play();
    },

    pause: () => {
      get().soundRef?.pause();
    },

    nextTrack: () => {
      const { tracks, currentTrackIndex, isPlaying, soundRef } = get();
      if (tracks.length === 0) return;
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      set({ currentTrackIndex: nextIndex });
      if (isPlaying) {
        ensureCurrentSound()?.play();
      } else if (soundRef) {
        // Paused: retarget the sound to the new track but stay paused.
        ensureCurrentSound();
      }
    },

    previousTrack: () => {
      const { tracks, currentTrackIndex, progress, soundRef, isPlaying } = get();
      if (tracks.length === 0) return;
      if (progress > 2) {
        soundRef?.seek(0);
        return;
      }
      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      set({ currentTrackIndex: prevIndex });
      if (isPlaying) {
        ensureCurrentSound()?.play();
      } else if (soundRef) {
        ensureCurrentSound();
      }
    },

    shuffle: () => {
      const { tracks, currentTrackIndex, isShuffle } = get();
      set({ isShuffle: !isShuffle });
      if (tracks.length <= 1) return;

      const current = currentTrackIndex >= 0 ? tracks[currentTrackIndex] : null;
      const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
      const newIndex = current ? shuffledTracks.findIndex((t) => t.id === current.id) : -1;
      set({ tracks: shuffledTracks, currentTrackIndex: newIndex });
    },

    toggleRepeat: () => set({ repeat: !get().repeat }),

    seek: (time) => {
      get().soundRef?.seek(time);
    },

    setVolume: (volume) => {
      set({ volume });
      get().soundRef?.volume(volume);
    },

    setProgress: (progress) => set({ progress }),
    setDuration: (duration) => set({ duration }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),

    // ---------- Howl ----------
    initializeTrack: () => {
      const { tracks, currentTrackIndex } = get();
      if (tracks.length === 0) return;
      if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) {
        set({ currentTrackIndex: 0 });
      }
      ensureCurrentSound()?.play();
    },

    // ---------- Sleep timer ----------
    setSleepTimer: (minutes) => {
      const targetTime = Date.now() + minutes * 60 * 1000;
      set({ sleepTimerTarget: targetTime });
    },

    cancelSleepTimer: () => set({ sleepTimerTarget: null }),

    checkSleepTimer: () => {
      const { sleepTimerTarget, isPlaying } = get();
      if (!sleepTimerTarget || !isPlaying) return;
      if (Date.now() >= sleepTimerTarget) {
        get().pause();
        set({ sleepTimerTarget: null });
      }
    },

    cleanupSound: () => unloadSound(),
  };
});

// Selectors for performance optimization
export const useIsPlaying = () => useMusicStore((state) => state.isPlaying);
export const useIsShuffle = () => useMusicStore((state) => state.isShuffle);
export const useIsRepeat = () => useMusicStore((state) => state.repeat);
export const useProgress = () => useMusicStore((state) => state.progress);
export const useDuration = () => useMusicStore((state) => state.duration);
export const useCurrentTrack = () =>
  useMusicStore(
    useShallow((state) => ({
      currentTrackIndex: state.currentTrackIndex,
      // Return the stable element reference from the array — never rebuild a
      // fresh object, otherwise the shallow-compared snapshot changes every
      // render and React falls into an infinite update loop.
      track: state.tracks[state.currentTrackIndex] ?? null,
    })),
  );

/** All playback-control actions grouped so components don't subscribe one-by-one. */
export const useMusicControls = () =>
  useMusicStore(
    useShallow((state) => ({
      play: state.play,
      pause: state.pause,
      nextTrack: state.nextTrack,
      previousTrack: state.previousTrack,
      seek: state.seek,
      shuffle: state.shuffle,
      toggleRepeat: state.toggleRepeat,
      initializeTrack: state.initializeTrack,
      checkSleepTimer: state.checkSleepTimer,
    })),
  );

/** Playback/player state flags (stable snapshot via shallow compare). */
export const useMusicFlags = () =>
  useMusicStore(
    useShallow((state) => ({
      isPlaying: state.isPlaying,
      isShuffle: state.isShuffle,
      repeat: state.repeat,
      progress: state.progress,
      duration: state.duration,
      sleepTimerTarget: state.sleepTimerTarget,
    })),
  );