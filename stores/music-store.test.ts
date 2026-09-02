import type { Track } from '@/features/music-player/types/music';
import { useMusicStore } from '@/stores/music-store';
import type { Howl } from 'howler';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Avoid real audio instantiation in jsdom: only initializeTrack uses `new Howl`,
// which none of these tests exercise.
vi.mock('howler', () => ({
  default: class HowlMock {
    play() {}
    pause() {}
    stop() {}
    unload() {}
    seek() {}
    volume() {}
    duration() {
      return 0;
    }
  },
}));

const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');

const resetStore = () =>
  useMusicStore.setState({
    tracks: [],
    currentTrackIndex: -1,
    isPlaying: false,
    progress: 0,
    duration: 0,
    repeat: false,
    isShuffle: false,
    volume: 1,
    soundRef: null,
    currentTrackSrcRef: null,
    sleepTimerTarget: null,
  });

let counter = 0;
function makeTrack(name: string, withCover = false): Track {
  counter += 1;
  return {
    id: `track-${counter}`,
    file: {} as File,
    url: `blob:mock-audio-${counter}`,
    duration: 180,
    metadata: withCover
      ? { title: name, artist: 'Singer', cover: `blob:mock-cover-${counter}` }
      : { title: name, artist: 'Singer' },
  };
}

function makeSound() {
  return { unload: vi.fn() } as unknown as Howl;
}

beforeEach(() => {
  resetStore();
  revokeSpy.mockClear();
});

describe('addTracks', () => {
  it('appends and auto-selects the first track when the playlist was empty', () => {
    useMusicStore.getState().addTracks([makeTrack('A'), makeTrack('B')]);
    const state = useMusicStore.getState();
    expect(state.tracks).toHaveLength(2);
    expect(state.currentTrackIndex).toBe(0);
  });

  it('appends without moving the current index when tracks already exist', () => {
    useMusicStore.getState().addTracks([makeTrack('A'), makeTrack('B')]);
    useMusicStore.getState().addTracks([makeTrack('C')]);
    const state = useMusicStore.getState();
    expect(state.tracks).toHaveLength(3);
    expect(state.currentTrackIndex).toBe(0);
  });

  it('ignores empty arrays', () => {
    useMusicStore.getState().addTracks([]);
    expect(useMusicStore.getState().tracks).toHaveLength(0);
  });
});

describe('reorderTracks', () => {
  it('keeps the same track selected by id and never stops playback', () => {
    const [a, b, c] = [makeTrack('A'), makeTrack('B'), makeTrack('C')];
    const sound = makeSound();
    useMusicStore.getState().addTracks([a, b, c]); // current = A (index 0)
    useMusicStore.setState({
      isPlaying: true,
      progress: 42,
      soundRef: sound,
      currentTrackSrcRef: a.url,
    });

    useMusicStore.getState().reorderTracks([b, c, a]); // move A to the end

    const state = useMusicStore.getState();
    expect(state.tracks.map((t) => t.id)).toEqual([b.id, c.id, a.id]);
    expect(state.currentTrackIndex).toBe(2); // still A
    expect(state.isPlaying).toBe(true);
    expect(state.progress).toBe(42);
    expect(sound.unload).not.toHaveBeenCalled();
  });

  it('keeps -1 when no track is selected', () => {
    const [a, b] = [makeTrack('A'), makeTrack('B')];
    useMusicStore.setState({ tracks: [a, b], currentTrackIndex: -1 });
    useMusicStore.getState().reorderTracks([b, a]);
    expect(useMusicStore.getState().currentTrackIndex).toBe(-1);
  });

  it('handles an empty playlist without throwing', () => {
    useMusicStore.getState().reorderTracks([]);
    const state = useMusicStore.getState();
    expect(state.tracks).toHaveLength(0);
    expect(state.currentTrackIndex).toBe(-1);
  });
});

describe('removeTrack', () => {
  it('decrements the index when removing a track before the current one', () => {
    const [a, b, c] = [makeTrack('A'), makeTrack('B'), makeTrack('C')];
    useMusicStore.getState().addTracks([a, b, c]);
    useMusicStore.setState({ currentTrackIndex: 2 });

    useMusicStore.getState().removeTrack(a.id);

    const state = useMusicStore.getState();
    expect(state.tracks.map((t) => t.id)).toEqual([b.id, c.id]);
    expect(state.currentTrackIndex).toBe(1);
  });

  it('falls back to the next track and stops sound when the current one is removed', () => {
    const [a, b, c] = [makeTrack('A'), makeTrack('B'), makeTrack('C')];
    const sound = makeSound();
    useMusicStore.getState().addTracks([a, b, c]);
    useMusicStore.setState({
      currentTrackIndex: 1,
      isPlaying: true,
      progress: 30,
      soundRef: sound,
      currentTrackSrcRef: b.url,
    });

    useMusicStore.getState().removeTrack(b.id);

    const state = useMusicStore.getState();
    expect(state.tracks.map((t) => t.id)).toEqual([a.id, c.id]);
    expect(state.currentTrackIndex).toBe(1); // c
    expect(state.isPlaying).toBe(false);
    expect(state.soundRef).toBeNull();
    expect(sound.unload).toHaveBeenCalledTimes(1);
  });

  it('falls back to the previous track when the last one is removed', () => {
    const [a, b, c] = [makeTrack('A'), makeTrack('B'), makeTrack('C')];
    useMusicStore.getState().addTracks([a, b, c]);
    useMusicStore.setState({ currentTrackIndex: 2 });

    useMusicStore.getState().removeTrack(c.id);

    const state = useMusicStore.getState();
    expect(state.tracks.map((t) => t.id)).toEqual([a.id, b.id]);
    expect(state.currentTrackIndex).toBe(1);
  });

  it('resets everything when the last track is removed', () => {
    const a = makeTrack('Only');
    useMusicStore.getState().addTracks([a]);
    useMusicStore.setState({ isPlaying: true, progress: 10 });

    useMusicStore.getState().removeTrack(a.id);

    const state = useMusicStore.getState();
    expect(state.tracks).toHaveLength(0);
    expect(state.currentTrackIndex).toBe(-1);
    expect(state.isPlaying).toBe(false);
    expect(state.soundRef).toBeNull();
  });

  it('revokes the audio and cover object urls', () => {
    const track = makeTrack('Covered', true);
    useMusicStore.getState().addTracks([track]);

    useMusicStore.getState().removeTrack(track.id);

    expect(revokeSpy).toHaveBeenCalledWith(track.url);
    expect(revokeSpy).toHaveBeenCalledWith(track.metadata.cover);
  });

  it('is a no-op for unknown ids', () => {
    useMusicStore.getState().addTracks([makeTrack('A')]);
    useMusicStore.getState().removeTrack('does-not-exist');
    expect(useMusicStore.getState().tracks).toHaveLength(1);
  });
});

describe('clearPlaylist', () => {
  it('revokes every url and resets all playback state', () => {
    const [a, b] = [makeTrack('A'), makeTrack('B', true)];
    const sound = makeSound();
    useMusicStore.getState().addTracks([a, b]);
    useMusicStore.setState({
      currentTrackIndex: 1,
      isPlaying: true,
      progress: 10,
      sleepTimerTarget: Date.now() + 60_000,
      soundRef: sound,
      currentTrackSrcRef: b.url,
    });

    useMusicStore.getState().clearPlaylist();

    const state = useMusicStore.getState();
    expect(state.tracks).toHaveLength(0);
    expect(state.currentTrackIndex).toBe(-1);
    expect(state.isPlaying).toBe(false);
    expect(state.progress).toBe(0);
    expect(state.duration).toBe(0);
    expect(state.soundRef).toBeNull();
    expect(state.sleepTimerTarget).toBeNull();
    expect(revokeSpy).toHaveBeenCalledWith(a.url);
    expect(revokeSpy).toHaveBeenCalledWith(b.url);
    expect(revokeSpy).toHaveBeenCalledWith(b.metadata.cover);
    expect(sound.unload).toHaveBeenCalledTimes(1);
  });
});
