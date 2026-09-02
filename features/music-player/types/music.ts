/**
 * Shared types for the local music player.
 *
 * Tracks are local-only: the audio bytes are held as a `File` and played via
 * `URL.createObjectURL`. They are never uploaded to the server.
 */
export interface TrackMetadata {
  title: string;
  artist?: string;
  album?: string;
  albumArtist?: string;
  genre?: string;
  year?: number;
  trackNumber?: number;
  discNumber?: number;
  /** Object URL of the embedded cover art. Revoked together with the track. */
  cover?: string;
}

export interface Track {
  id: string;
  /** The original local audio file. */
  file: File;
  /** Object URL of the audio file; howler/html5 plays this. */
  url: string;
  /** Track duration in seconds (0 when unknown). */
  duration: number;
  metadata: TrackMetadata;
}
