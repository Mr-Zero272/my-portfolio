import type { TrackMetadata } from '@/features/music-player/types/music';
import { formatSecondsToTime } from '@/utils/format';
import { Loader2, Music2, X } from 'lucide-react';

export type PendingStatus = 'parsing' | 'ready';

/**
 * A file that has been dropped into the import view but not committed yet.
 * Owns revocable object URLs until it is either removed or added to the store.
 */
export interface PendingTrack {
  id: string;
  file: File;
  /** Object URL of the audio file. */
  url: string;
  metadata: TrackMetadata;
  /** Track duration in seconds (0 until parsing finishes). */
  duration: number;
  status: PendingStatus;
}

type PendingTrackItemProps = {
  pending: PendingTrack;
  onRemove: (id: string) => void;
};

export const PendingTrackItem = ({ pending, onRemove }: PendingTrackItemProps) => {
  const { metadata, status } = pending;
  const isParsing = status === 'parsing';
  const durationLabel = pending.duration > 0 ? formatSecondsToTime(Math.round(pending.duration)) : '';

  return (
    <li className="group flex items-center gap-x-3 rounded-lg px-2 py-1.5 hover:bg-accent/40">
      {/* Cover art or fallback icon */}
      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
        {metadata.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob object URL from embedded art
          <img src={metadata.cover} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <Music2 className="size-5" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {isParsing ? pending.file.name : metadata.title}
        </p>
        {!isParsing && metadata.artist && (
          <p className="truncate text-xs text-muted-foreground">{metadata.artist}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-x-2">
        {isParsing ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          durationLabel && (
            <span className="text-xs tabular-nums text-muted-foreground">{durationLabel}</span>
          )
        )}
        <button
          type="button"
          aria-label={`Remove ${metadata.title}`}
          onClick={() => onRemove(pending.id)}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      </div>
    </li>
  );
};
