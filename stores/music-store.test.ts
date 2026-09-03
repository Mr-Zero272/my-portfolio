import type { Track } from '@/features/music-player/types/music';
import { useMusicStore } from '@/stores/music-store';
import type { Howl } from 'howler';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Keep real audio out of jsdom. `new Howl` is only created by the playback
// actions; instances are recorded so tests can assert start/switch behaviour.
const howlerState = vi.hoisted(() => ({
  instances: [] as Array<{
    play: ReturnType<typeof vi.fn>;
    unload: ReturnType<typeof vi.fn>;
  }>,
}));

vi.mock('howler', () => {
  class HowlMock {
    play = vi.fn();
    pause = vi.fn();
    stop = vi.fn();
    unload = vi.fn();
    seek = vi.fn();
    volume = vi.fn();
    duration = () => 0;

    constructor() {
      howlerState.instances.push(this);
    }
  }
  // The store imports `Howl` as a named export; expose the class under both.
  return { default: HowlMock, Howl: HowlMock };
});

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
  howlerState.instances.length = 0;
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

describe('playback', () => {
  it('play() creates a Howl for the current track and starts it after an import', () => {
    const a = makeTrack('A');
    useMusicStore.getState().addTracks([a]); // selects index 0, but no sound yet

    useMusicStore.getState().play();

    const state = useMusicStore.getState();
    expect(howlerState.instances).toHaveLength(1);
    expect(state.soundRef).toBe(howlerState.instances[0]);
    expect(state.currentTrackSrcRef).toBe(a.url);
    expect(howlerState.instances[0].play).toHaveBeenCalledTimes(1);
  });

  it('play() falls back to the first track when no index is selected', () => {
    useMusicStore.setState({ tracks: [makeTrack('A')], currentTrackIndex: -1 });

    useMusicStore.getState().play();

    const state = useMusicStore.getState();
    expect(state.currentTrackIndex).toBe(0);
    expect(howlerState.instances).toHaveLength(1);
  });

  it('setTrack() selects and starts playing the chosen track', () => {
    const [a, b] = [makeTrack('A'), makeTrack('B')];
    useMusicStore.getState().addTracks([a, b]);

    useMusicStore.getState().setTrack(1);

    const state = useMusicStore.getState();
    expect(state.currentTrackIndex).toBe(1);
    expect(howlerState.instances).toHaveLength(1);
    expect(state.soundRef).toBe(howlerState.instances[0]);
    expect(state.currentTrackSrcRef).toBe(b.url);
    expect(howlerState.instances[0].play).toHaveBeenCalledTimes(1);
  });

  it('play() resumes an existing paused sound instead of recreating it', () => {
    useMusicStore.getState().addTracks([makeTrack('A')]);
    useMusicStore.getState().play(); // creates the first sound
    useMusicStore.getState().pause();

    useMusicStore.getState().play();

    expect(howlerState.instances).toHaveLength(1); // same sound reused
    expect(howlerState.instances[0].play).toHaveBeenCalledTimes(2);
  });

  it('nextTrack() while playing swaps to the next track sound', () => {
    const [a, b] = [makeTrack('A'), makeTrack('B')];
    useMusicStore.getState().addTracks([a, b]);
    useMusicStore.getState().play(); // A starts
    useMusicStore.setState({ isPlaying: true }); // simulate howler onplay
    const firstInstance = howlerState.instances[0];

    useMusicStore.getState().nextTrack();

    const state = useMusicStore.getState();
    expect(state.currentTrackIndex).toBe(1);
    expect(howlerState.instances).toHaveLength(2); // new sound for B
    expect(firstInstance.unload).toHaveBeenCalledTimes(1);
    expect(state.soundRef).toBe(howlerState.instances[1]);
    expect(state.currentTrackSrcRef).toBe(b.url);
    expect(howlerState.instances[1].play).toHaveBeenCalledTimes(1);
  });
});
