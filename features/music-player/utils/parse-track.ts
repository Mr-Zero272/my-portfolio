import { parseBlob, selectCover, type IPicture } from 'music-metadata';

import type { TrackMetadata } from '@/features/music-player/types/music';

export interface ParsedTrackInfo {
  /** Track metadata read from the file tags (never throws; falls back to filename). */
  metadata: TrackMetadata;
  /** Track duration in seconds (0 when unknown). */
  duration: number;
}

/** "song.mp3" -> "song" (keeps names without an extension untouched). */
export function titleFromFileName(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot > 0 ? fileName.slice(0, dot) : fileName;
}

/** Convert an embedded cover picture to a revocable object URL (or `undefined`). */
export function coverToObjectUrl(picture?: IPicture | null): string | undefined {
  if (!picture || !picture.data || picture.data.byteLength === 0) return undefined;
  // Copy into a fresh ArrayBuffer-backed view so it is a valid BlobPart.
  const data = new Uint8Array(picture.data);
  const blob = new Blob([data], { type: picture.format || 'image/jpeg' });
  return URL.createObjectURL(blob);
}

/**
 * Read tags (title/artist/album/… + duration + cover art) from a local audio file.
 *
 * Parsing happens entirely client-side. When the container/tags can't be read the
 * file is still accepted with `title` falling back to the file name.
 */
export async function readTrackInfo(file: File): Promise<ParsedTrackInfo> {
  const fallbackTitle = titleFromFileName(file.name);
  try {
    const { common, format } = await parseBlob(file, { duration: true });
    return {
      duration: format.duration ?? 0,
      metadata: {
        title: common.title?.trim() || fallbackTitle,
        artist: common.artist?.trim() || undefined,
        album: common.album?.trim() || undefined,
        albumArtist: common.albumartist?.trim() || undefined,
        genre: common.genre?.[0]?.trim() || undefined,
        year: common.year ?? undefined,
        trackNumber: common.track?.no ?? undefined,
        discNumber: common.disk?.no ?? undefined,
        cover: coverToObjectUrl(selectCover(common.picture)),
      },
    };
  } catch {
    return { duration: 0, metadata: { title: fallbackTitle } };
  }
}
