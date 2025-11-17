import { musicImages } from '@/constants/music-images';
import { moveElementInArray } from '@/lib/utils';
import { Howl } from 'howler';
import { toast } from 'sonner';
import { create } from 'zustand';

interface MusicState {
  // State
  tracks: string[];
  trackNames: string[];
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
  setTracks: (tracks: string[]) => void;
  setTrackNames: (trackNames: string[]) => void;
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
  trackNames: [],
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

  setTrackNames: (trackNames) => set({ trackNames }),

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
    const { tracks, trackNames, currentTrackIndex } = get();
    set({ isShuffle: !get().isShuffle });

    if (tracks.length <= 1) return;

    // Create array of indices to maintain track-trackName relationship
    const indices = Array.from({ length: tracks.length }, (_, i) => i);
    const shuffledIndices = [...indices].sort(() => Math.random() - 0.5);

    // Shuffle both tracks and trackNames using the same order
    const shuffledTracks = shuffledIndices.map((i) => tracks[i]);
    const shuffledTrackNames = shuffledIndices.map((i) => trackNames[i]);

    // Find new position of current track
    const currentTrackNewIndex = shuffledIndices.indexOf(currentTrackIndex);

    set({
      tracks: shuffledTracks,
      trackNames: shuffledTrackNames,
      currentTrackIndex: currentTrackNewIndex >= 0 ? currentTrackNewIndex : 0,
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
    const { tracks, trackNames, soundRef } = get();

    URL.revokeObjectURL(tracks[index]);
    const updatedTracks = tracks.filter((_, i) => i !== index);
    const updatedNames = trackNames.filter((_, i) => i !== index);

    soundRef?.unload();

    set({
      tracks: updatedTracks,
      trackNames: updatedNames,
      currentTrackIndex: updatedTracks.length === 0 ? -1 : get().currentTrackIndex,
    });
  },

  updateTrackPosition: (oldPosition, newPosition) => {
    const { tracks, trackNames } = get();

    const updatedTracks = moveElementInArray(tracks, oldPosition, newPosition);
    const updatedNames = moveElementInArray(trackNames, oldPosition, newPosition);

    set({
      tracks: updatedTracks,
      trackNames: updatedNames,
      currentTrackIndex: newPosition,
    });
  },

  updateTrackName: (newName, position) => {
    const { trackNames } = get();
    const updatedNames = [...trackNames];
    updatedNames[position] = newName;
    set({ trackNames: updatedNames });
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

    const currentTrackSrc = tracks[currentTrackIndex];

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
    trackName: state.trackNames[state.currentTrackIndex],
  }));
export const useMusicControls = () =>
  useMusicStore((state) => ({
    play: state.play,
    pause: state.pause,
    nextTrack: state.nextTrack,
    previousTrack: state.previousTrack,
    seek: state.seek,
  }));
