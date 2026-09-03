'use client';

import { Button } from '@/components/ui/button';
import type { Track } from '@/features/music-player/types/music';
import { readTrackInfo, titleFromFileName } from '@/features/music-player/utils/parse-track';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/stores/music-store';
import { ChevronLeft, CloudUpload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { PendingTrack, PendingTrackItem } from './pending-track-item';

const MAX_SIZE_FILE = 100 * 1024 * 1024; // 100MB - files stay local, never uploaded

function revokePending(item: PendingTrack) {
  URL.revokeObjectURL(item.url);
  if (item.metadata.cover) {
    URL.revokeObjectURL(item.metadata.cover);
  }
}

type ImportSongsTabProps = {
  onBack: () => void;
};

export const ImportSongsTab = ({ onBack }: ImportSongsTabProps) => {
  const addTracks = useMusicStore((state) => state.addTracks);
  const play = useMusicStore((state) => state.play);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const [pending, setPending] = useState<PendingTrack[]>([]);

  // Track the latest pending list in a ref so the unmount cleanup can revoke
  // object URLs of files that were never committed to the playlist.
  const committedRef = useRef(false);
  const pendingRef = useRef<PendingTrack[]>([]);
  useEffect(() => {
    pendingRef.current = pending;
  });
  useEffect(() => {
    return () => {
      if (committedRef.current) return;
      for (const item of pendingRef.current) {
        revokePending(item);
      }
    };
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    const entries: PendingTrack[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      metadata: { title: titleFromFileName(file.name) },
      duration: 0,
      status: 'parsing',
    }));

    setPending((prev) => [...prev, ...entries]);

    for (const entry of entries) {
      void readTrackInfo(entry.file)
        .then((info) => {
          setPending((prev) =>
            prev.map((item) =>
              item.id === entry.id
                ? { ...item, metadata: info.metadata, duration: info.duration, status: 'ready' }
                : item,
            ),
          );
        })
        .catch(() => {
          // Keep the file playable with its filename fallback if parsing crashed.
          setPending((prev) =>
            prev.map((item) => (item.id === entry.id ? { ...item, status: 'ready' } : item)),
          );
        });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    multiple: true,
    noClick: true,
    noKeyboard: true,
    accept: {
      'audio/*': ['.mp3', '.flac', '.wav', '.m4a', '.aac', '.ogg', '.oga', '.opus'],
    },
    maxSize: MAX_SIZE_FILE,
    onDropAccepted: handleFiles,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            toast.error(`File "${rejection.file.name}" is too large. Max size is 100MB.`);
          } else if (err.code === 'file-invalid-type') {
            toast.error(`File "${rejection.file.name}" is not a supported audio file.`);
          } else {
            toast.error(`File "${rejection.file.name}" was rejected. ${err.message}`);
          }
        });
      });
    },
  });

  const handleRemove = useCallback((id: string) => {
    const item = pending.find((p) => p.id === id);
    if (item) {
      revokePending(item);
    }
    setPending((prev) => prev.filter((p) => p.id !== id));
  }, [pending]);

  const readyCount = pending.filter((p) => p.status === 'ready').length;
  const hasParsing = pending.some((p) => p.status === 'parsing');

  const handleCommit = useCallback(() => {
    if (readyCount === 0 || hasParsing) return;
    const tracks: Track[] = pending
      .filter((p) => p.status === 'ready')
      .map((p) => ({
        id: p.id,
        file: p.file,
        url: p.url,
        duration: p.duration,
        metadata: p.metadata,
      }));

    committedRef.current = true;
    setPending([]);
    addTracks(tracks);
    onBack();
    if (tracks.length > 0 && !isPlaying) {
      play();
    }
  }, [addTracks, hasParsing, onBack, pending, play, readyCount, isPlaying]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-x-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium">Add songs</h1>
        {pending.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {pending.length} file{pending.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center rounded-2xl border border-dashed p-10 text-center transition-colors',
          isDragActive && 'border-primary bg-primary/10',
        )}
      >
        <input {...getInputProps()} />
        <CloudUpload className="size-7 text-muted-foreground" />
        <p className="mt-3 text-sm">Drag & drop your audio files here</p>
        <p className="mt-1 text-xs text-muted-foreground">
          MP3, FLAC, WAV, M4A, AAC, OGG • up to 100MB each
        </p>
        <Button type="button" variant="outline" className="mt-4" onClick={open}>
          Browse files
        </Button>
      </div>

      {pending.length > 0 && (
        <ul className="mt-4 max-h-80 space-y-0.5 overflow-y-auto rounded-lg border p-1.5">
          {pending.map((item) => (
            <PendingTrackItem key={item.id} pending={item} onRemove={handleRemove} />
          ))}
        </ul>
      )}

      {pending.length > 0 && (
        <div className="mt-4 flex items-center justify-end gap-x-2 border-t pt-4">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleCommit} disabled={readyCount === 0 || hasParsing}>
            Add {readyCount} song{readyCount === 1 ? '' : 's'}
          </Button>
        </div>
      )}
    </div>
  );
};