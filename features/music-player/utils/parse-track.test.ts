import type { IAudioMetadata, ICommonTagsResult, IFormat } from 'music-metadata';
import { parseBlob } from 'music-metadata';
import { describe, expect, it, vi } from 'vitest';
import { coverToObjectUrl, readTrackInfo, titleFromFileName } from './parse-track';

vi.mock('music-metadata', () => ({
  parseBlob: vi.fn(),
  selectCover: (pictures?: { format: string; data: Uint8Array }[]) => pictures?.[0] ?? null,
}));

const parseBlobMock = vi.mocked(parseBlob);

interface SampleOverrides {
  common?: Partial<ICommonTagsResult>;
  format?: Partial<IFormat>;
}

function sample(overrides: SampleOverrides = {}): IAudioMetadata {
  return {
    common: {
      track: { no: null, of: null },
      disk: { no: null, of: null },
      movementIndex: { no: null, of: null },
      title: 'Hello',
      artist: 'Artist',
      album: 'Album',
      albumartist: 'Album Artist',
      genre: ['Pop'],
      year: 2021,
      picture: [{ format: 'image/jpeg', data: new Uint8Array([9, 8, 7]) }],
      ...overrides.common,
    },
    format: { duration: 123.4, ...overrides.format },
  } as unknown as IAudioMetadata;
}

const file = { name: 'song-file.mp3' } as File;

describe('titleFromFileName', () => {
  it('strips the extension', () => {
    expect(titleFromFileName('song.mp3')).toBe('song');
    expect(titleFromFileName('my.mix.flac')).toBe('my.mix');
  });

  it('keeps names without an extension', () => {
    expect(titleFromFileName('no-ext')).toBe('no-ext');
  });
});

describe('coverToObjectUrl', () => {
  it('creates a blob object url for a picture', () => {
    const url = coverToObjectUrl({ format: 'image/png', data: new Uint8Array([1, 2, 3]) });
    expect(url).toMatch(/^blob:/);
  });

  it('returns undefined when there is no usable picture', () => {
    expect(coverToObjectUrl(undefined)).toBeUndefined();
    expect(coverToObjectUrl(null)).toBeUndefined();
    expect(coverToObjectUrl({ format: 'image/png', data: new Uint8Array(0) })).toBeUndefined();
  });
});

describe('readTrackInfo', () => {
  it('maps every tag field and the embedded cover art', async () => {
    parseBlobMock.mockResolvedValueOnce(sample());

    const { metadata, duration } = await readTrackInfo(file);

    expect(metadata.title).toBe('Hello');
    expect(metadata.artist).toBe('Artist');
    expect(metadata.album).toBe('Album');
    expect(metadata.albumArtist).toBe('Album Artist');
    expect(metadata.genre).toBe('Pop');
    expect(metadata.year).toBe(2021);
    expect(metadata.cover).toMatch(/^blob:/);
    expect(duration).toBe(123.4);
  });

  it('maps track/disc numbers', async () => {
    parseBlobMock.mockResolvedValueOnce(
      sample({ common: { track: { no: 4, of: 9 }, disk: { no: 2, of: 2 } } }),
    );

    const { metadata } = await readTrackInfo(file);

    expect(metadata.trackNumber).toBe(4);
    expect(metadata.discNumber).toBe(2);
  });

  it('falls back to the file name when no title tag exists', async () => {
    parseBlobMock.mockResolvedValueOnce(sample({ common: { title: undefined } }));

    const { metadata } = await readTrackInfo(file);

    expect(metadata.title).toBe('song-file');
  });

  it('ignores blank/empty values', async () => {
    parseBlobMock.mockResolvedValueOnce(
      sample({ common: { title: '   ', genre: [], picture: [] } }),
    );

    const { metadata } = await readTrackInfo(file);

    expect(metadata.title).toBe('song-file');
    expect(metadata.genre).toBeUndefined();
    expect(metadata.cover).toBeUndefined();
  });

  it('returns a filename fallback when parsing fails instead of throwing', async () => {
    parseBlobMock.mockRejectedValueOnce(new Error('cannot parse'));

    const { metadata, duration } = await readTrackInfo(file);

    expect(metadata.title).toBe('song-file');
    expect(duration).toBe(0);
  });
});
