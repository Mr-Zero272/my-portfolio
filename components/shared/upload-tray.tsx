'use client';

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileTextIcon,
  FileWarningIcon,
  RefreshCwIcon,
  XIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import { Button } from '@/components/ui/button';
import { CircularProgress } from '@/components/ui/circular-progress';
import { formatFileSize } from '@/lib/format';
import type { UploadTask } from '@/lib/upload/types';
import { uploadManager } from '@/lib/upload/upload-manager';
import { cn } from '@/lib/utils';
import { useUploadStore } from '@/stores/upload';
import Image from 'next/image';

// ─── Constants ──────────────────────────────────────────────────────────────

const AUTO_CLOSE_DELAY = 3000; // ms after all done before auto-hiding

// ─── Animation variants ─────────────────────────────────────────────────────

const trayVariants = {
  hidden: { y: '120%', opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1 },
  exit: { y: '120%', opacity: 0, scale: 0.95 },
};

const itemVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: 'auto', marginBottom: 8 },
  exit: { opacity: 0, height: 0, marginBottom: 0 },
};

const transition = { type: 'spring', stiffness: 400, damping: 35 } as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getOverallProgress(tasks: UploadTask[]): number {
  if (tasks.length === 0) return 0;
  const sum = tasks.reduce((acc, t) => {
    if (t.status === 'uploaded') return acc + 100;
    if (t.status === 'error') return acc + 0;
    return acc + t.progress;
  }, 0);
  return Math.round(sum / tasks.length);
}

function getStatusCounts(tasks: UploadTask[]) {
  return {
    uploading: tasks.filter((t) => t.status === 'uploading' || t.status === 'queued').length,
    error: tasks.filter((t) => t.status === 'error').length,
    done: tasks.filter((t) => t.status === 'uploaded').length,
    total: tasks.length,
  };
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function UploadTray() {
  const [minimized, setMinimized] = useState(false);

  // Subscribe to ALL tasks from the store (not scoped)
  const allTasks = useUploadStore((s) => s.tasks);
  const tasks = useMemo(() => {
    const arr = Array.from(allTasks.values());
    return arr.filter((t) => t.status !== 'idle');
  }, [allTasks]);

  const progress = getOverallProgress(tasks);
  const counts = getStatusCounts(tasks);

  // Only auto-close when every task finished successfully — failed tasks must
  // stay visible so the user can retry them.
  const allDone = tasks.length > 0 && counts.uploading === 0 && counts.error === 0;

  // Force-close X only shows when nothing is uploading and at least one task
  // failed — lets the user dismiss the tray entirely instead of retrying.
  const showForceClose = counts.uploading === 0 && counts.error > 0;

  // Auto-close: clear completed tasks after a delay when all are done
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (allDone) {
      closeTimerRef.current = setTimeout(() => {
        useUploadStore.getState().clearCompleted();
      }, AUTO_CLOSE_DELAY);
    }
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [allDone]);

  // Reset minimized when new tasks appear
  useEffect(() => {
    if (counts.uploading > 0) {
      setMinimized(false);
    }
  }, [counts.uploading]);

  // Don't render when nothing is happening
  const shouldShow = tasks.length > 0;

  const handleCancel = useCallback((taskId: string) => {
    uploadManager.cancel(taskId);
  }, []);

  const handleRetry = useCallback((taskId: string) => {
    uploadManager.retry(taskId);
  }, []);

  const handleCloseAll = useCallback(() => {
    const store = useUploadStore.getState();
    // Cancel any in-flight/queued uploads first so the manager's queue and
    // concurrency counters stay consistent.
    for (const id of Array.from(store.tasks.keys())) {
      uploadManager.cancel(id);
    }
    store.clearAll();
  }, []);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="upload-tray"
          variants={trayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          className={cn(
            'bg-background fixed right-4 z-51 overflow-hidden rounded-2xl border shadow-2xl',
            minimized ? 'bottom-4 w-auto' : 'bottom-4 w-95 max-w-[calc(100vw-2rem)]',
          )}
        >
          {minimized ? (
            /* ── Minimized ────────────────────────────────────────── */
            <motion.button
              layout
              onClick={() => setMinimized(false)}
              className="flex items-center gap-3 px-4 py-3"
            >
              <CircularProgress
                value={progress}
                size={42}
                strokeWidth={4}
                circleStrokeWidth={4}
                progressStrokeWidth={4}
              />
              <div className="text-left">
                <p className="text-sm font-medium">
                  {counts.done}/{counts.total} done
                </p>
                {counts.uploading > 0 && (
                  <p className="text-muted-foreground text-xs">
                    {counts.uploading} uploading · {progress}%
                  </p>
                )}
                {counts.error > 0 && (
                  <p className="text-destructive text-xs">{counts.error} failed</p>
                )}
              </div>
              <ChevronUpIcon className="text-muted-foreground size-4" />
            </motion.button>
          ) : (
            /* ── Expanded ─────────────────────────────────────────── */
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Uploads
                    {tasks.length > 0 && (
                      <span className="text-muted-foreground ml-1 font-normal">
                        ({counts.done}/{counts.total})
                      </span>
                    )}
                  </h3>
                  {allDone && (
                    <p className="text-muted-foreground text-xs">All done — closing soon</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setMinimized(true)}
                    aria-label="Minimize upload tray"
                  >
                    <ChevronDownIcon className="size-4" />
                  </Button>
                  {showForceClose && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleCloseAll}
                      aria-label="Clear all uploads"
                    >
                      <XIcon className="size-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Body — file list */}
              <div className="max-h-[50vh] scrollbar-thin overflow-y-auto px-4 py-3">
                <AnimatePresence mode="popLayout">
                  {tasks.map((task) => (
                    <UploadTaskItem
                      key={task.id}
                      task={task}
                      onCancel={() => handleCancel(task.id)}
                      onRetry={() => handleRetry(task.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Upload Task Item ───────────────────────────────────────────────────────

function UploadTaskItem({
  task,
  onCancel,
  onRetry,
}: {
  task: UploadTask;
  onCancel: () => void;
  onRetry: () => void;
}) {
  const isImage = task.file.type.startsWith('image/');
  const isDone = task.status === 'uploaded';
  const isError = task.status === 'error';

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2 }}
      layout
    >
      <Attachment state={isError ? 'error' : isDone ? 'done' : 'uploading'} className="w-full">
        <AttachmentMedia variant={isImage && !isError ? 'image' : 'icon'}>
          {isError ? (
            <FileWarningIcon className="size-5" />
          ) : isDone ? (
            <CheckIcon className="size-5" />
          ) : isImage ? (
            <Image
              src={URL.createObjectURL(task.file)}
              alt={task.file.name}
              className="size-full object-cover"
              width={200}
              height={200}
            />
          ) : (
            <FileTextIcon className="size-5" />
          )}
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{task.file.name}</AttachmentTitle>
          <AttachmentDescription>
            {isError
              ? (task.error ?? 'Upload failed')
              : isDone
                ? formatFileSize(task.file.size)
                : `Uploading · ${task.progress}%`}
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          {isError ? (
            <AttachmentAction aria-label={`Retry ${task.file.name}`} onClick={onRetry}>
              <RefreshCwIcon className="size-4" />
            </AttachmentAction>
          ) : !isDone ? (
            <AttachmentAction aria-label={`Cancel ${task.file.name}`} onClick={onCancel}>
              <XIcon className="size-4" />
            </AttachmentAction>
          ) : null}
        </AttachmentActions>
      </Attachment>
    </motion.div>
  );
}
