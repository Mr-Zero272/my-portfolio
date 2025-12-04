import { musicImages } from '@/constants/music-images';
import { moveElementInArray } from '@/lib/utils';
import { Howl } from 'howler';
import { toast } from 'sonner';
import { create } from 'zustand';

export interface Track {
  id: string;
  url: string;
  name: string;
}

interface MusicState {
  // State
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  repeat: boolean;
  isShuffle: boolean;
  isEditingTrackName: boolean;
  musicBackgroundSrc: string;
  volume: number;
  soundRef: Howl | null;
  currentTrackSrcRef: string | null;

  // Actions
  setTracks: (tracks: Track[]) => void;
  reorderTracks: (tracks: Track[]) => void;
  setTrack: (index: number) => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  shuffle: () => void;
  toggleRepeat: () => void;
  seek: (time: number) => void;
  deleteTrack: (index: number) => void;
  updateTrackPosition: (oldPosition: number, newPosition: number) => void;
  updateTrackName: (newName: string, position: number) => void;
  updateEditingTrackNameState: (state: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  randomMusicBackground: () => void;
  initializeTrack: () => void;
  cleanupSound: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  // Initial state
  tracks: [],
  currentTrackIndex: -1,
  isPlaying: false,
  progress: 0,
  duration: 0,
  repeat: false,
  isShuffle: false,
  isEditingTrackName: false,
  musicBackgroundSrc: musicImages[0],
  volume: 1.0,
  soundRef: null,
  currentTrackSrcRef: null,

  // Actions
  setTracks: (tracks) => {
    set({ tracks });
    if (tracks.length > 0) {
      set({ currentTrackIndex: 0 });
    }
  },

  reorderTracks: (tracks) => {
    const { soundRef, currentTrackIndex, tracks: oldTracks } = get();

    // Find the current playing track in the new order
    const currentTrack = oldTracks[currentTrackIndex];
    const newIndex = currentTrack ? tracks.findIndex((t) => t.id === currentTrack.id) : -1;

    // Cleanup old sound since track order changed
    if (soundRef) {
      soundRef.unload();
    }

    set({
      tracks,
      currentTrackIndex: newIndex >= 0 ? newIndex : 0,
      soundRef: null,
      currentTrackSrcRef: null,
      isPlaying: false,
      progress: 0,
    });
  },

  setTrack: (index) => {
    set({ currentTrackIndex: index });
    get().randomMusicBackground();
  },

  play: () => {
    const { tracks, soundRef } = get();
    if (tracks.length === 0) {
      toast.info('You need to add some music files to play');
      return;
    }

    if (soundRef) {
      soundRef.play();
    }
  },

  pause: () => {
    const { soundRef } = get();
    if (soundRef) {
      soundRef.pause();
    }
  },

  nextTrack: () => {
    const { tracks, currentTrackIndex } = get();
    set({ currentTrackIndex: (currentTrackIndex + 1) % tracks.length });
    get().randomMusicBackground();
  },

  previousTrack: () => {
    const { tracks, currentTrackIndex, progress, soundRef } = get();
    if (progress > 2) {
      soundRef?.seek(0);
      return;
    }
    set({ currentTrackIndex: (currentTrackIndex - 1 + tracks.length) % tracks.length });
    get().randomMusicBackground();
  },

  shuffle: () => {
    const { tracks, currentTrackIndex } = get();
    set({ isShuffle: !get().isShuffle });

    if (tracks.length <= 1) return;

    const currentTrackId = tracks[currentTrackIndex].id;
    const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
    const newIndex = shuffledTracks.findIndex((t) => t.id === currentTrackId);

    set({
      tracks: shuffledTracks,
      currentTrackIndex: newIndex >= 0 ? newIndex : 0,
    });
  },

  toggleRepeat: () => set({ repeat: !get().repeat }),

  seek: (time) => {
    const { soundRef } = get();
    if (soundRef) {
      soundRef.seek(time);
    }
  },

  deleteTrack: (index) => {
    const { tracks, soundRef } = get();

    URL.revokeObjectURL(tracks[index].url);
    const updatedTracks = tracks.filter((_, i) => i !== index);

    soundRef?.unload();

    set({
      tracks: updatedTracks,
      currentTrackIndex: updatedTracks.length === 0 ? -1 : get().currentTrackIndex,
    });
  },

  updateTrackPosition: (oldPosition, newPosition) => {
    const { tracks, soundRef } = get();
    const updatedTracks = moveElementInArray(tracks, oldPosition, newPosition);

    // Cleanup old sound since track position changed
    if (soundRef) {
      soundRef.unload();
    }

    set({
      tracks: updatedTracks,
      currentTrackIndex: newPosition,
      soundRef: null,
      currentTrackSrcRef: null,
      isPlaying: false,
      progress: 0,
    });
  },

  updateTrackName: (newName, position) => {
    const { tracks } = get();
    const updatedTracks = [...tracks];
    updatedTracks[position] = { ...updatedTracks[position], name: newName };
    set({ tracks: updatedTracks });
  },

  updateEditingTrackNameState: (state) => set({ isEditingTrackName: state }),

  setVolume: (volume) => {
    const { soundRef } = get();
    set({ volume });
    if (soundRef) {
      soundRef.volume(volume);
    }
  },

  setProgress: (progress) => set({ progress }),

  setDuration: (duration) => set({ duration }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  randomMusicBackground: () => {
    const randomIndex = Math.floor(Math.random() * musicImages.length);
    set({ musicBackgroundSrc: musicImages[randomIndex] });
  },

  initializeTrack: () => {
    const state = get();
    const { tracks, currentTrackIndex, volume, repeat } = state;

    if (tracks.length === 0 || currentTrackIndex < 0 || currentTrackIndex >= tracks.length) {
      return;
    }

    const currentTrackSrc = tracks[currentTrackIndex].url;

    // Cleanup old sound if track changed
    if (state.soundRef && state.currentTrackSrcRef !== currentTrackSrc) {
      state.soundRef.unload();
      set({ soundRef: null });
    }

    // Create new Howl instance
    if (!state.soundRef) {
      const newSound = new Howl({
        src: [currentTrackSrc],
        html5: true,
        volume: volume,
        onplay: () => set({ isPlaying: true }),
        onpause: () => set({ isPlaying: false }),
        onstop: () => {
          set({ isPlaying: false, progress: 0 });
        },
        onend: () => {
          if (repeat) {
            get().play();
          } else {
            if (tracks.length === 1) {
              get().play();
            } else {
              get().nextTrack();
            }
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

      set({
        soundRef: newSound,
        currentTrackSrcRef: currentTrackSrc,
      });

      newSound.play();
    }
  },

  cleanupSound: () => {
    const { soundRef } = get();
    if (soundRef) {
      soundRef.unload();
      set({ soundRef: null });
    }
  },
}));

// Selectors for performance optimization
export const useIsPlaying = () => useMusicStore((state) => state.isPlaying);
export const useProgress = () => useMusicStore((state) => state.progress);
export const useDuration = () => useMusicStore((state) => state.duration);
export const useCurrentTrack = () =>
  useMusicStore((state) => ({
    currentTrackIndex: state.currentTrackIndex,
    trackName: state.tracks[state.currentTrackIndex]?.name,
  }));
export const useMusicControls = () =>
  useMusicStore((state) => ({
    play: state.play,
    pause: state.pause,
    nextTrack: state.nextTrack,
    previousTrack: state.previousTrack,
    seek: state.seek,
  }));
