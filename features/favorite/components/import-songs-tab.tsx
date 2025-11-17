'use client';

import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/use-music-store';
import { ChevronLeft, CloudUpload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import SongFileItem from './song-file-item';

const MAX_SIZE_FILE = 15 * 1024 * 1024; // 15MB

type ImportSongsTabProps = {
  onBack: () => void;
};

const ImportSongsTab = ({ onBack }: ImportSongsTabProps) => {
  const setTracks = useMusicStore((state) => state.setTracks);
  const tracks = useMusicStore((state) => state.tracks);
  const setTrackNames = useMusicStore((state) => state.setTrackNames);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback(
    (files: File[]) => {
      setError(null);

      if (files.length === 0) {
        toast.error('No files selected');
        return;
      }

      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > MAX_SIZE_FILE) {
          toast.error('File size is too large');
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        toast.error('No valid files to upload');
        return;
      }

      const newTrackUrls = validFiles.map((file) => URL.createObjectURL(file));
      const newTrackNames = validFiles.map((file) => file.name);

      setTracks([...newTrackUrls]);
      setTrackNames([...newTrackNames]);
      onBack();
    },
    [setError, setTracks, setTrackNames, onBack],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    accept: {
      'audio/mpeg': ['.mp3'],
    },
    maxSize: MAX_SIZE_FILE,
    onDrop: (acceptedFiles) => {
      handleFileChange(acceptedFiles);
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            toast.error(`File ${file.file.name} is too large. Max size is 15MB.`);
          } else if (err.code === 'file-invalid-type') {
            toast.error(`File ${file.file.name} has an invalid file type. Only .mp3 files are allowed.`);
          } else {
            toast.error(`File ${file.file.name} was rejected. ${err.message}`);
          }
        });
      });
    },
  });

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    const newTrackUrls = newFiles.map((file) => URL.createObjectURL(file));
    const newTrackNames = newFiles.map((file) => file.name);
    setTracks(newTrackUrls);
    setTrackNames(newTrackNames);
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-x-2">
        <button className="group hover:bg-accent/40 rounded-md p-1.5" onClick={onBack}>
          <ChevronLeft className="size-6 transition-all duration-200 ease-in-out group-active:pr-2" />
        </button>
        <h1 className="font-medium">Add songs</h1>
      </div>
      <section>
        <div
          className={cn('mb-5 flex items-center justify-center rounded-2xl border border-dashed p-12', {
            'border-primary bg-primary/10': isDragActive,
          })}
          {...getRootProps()}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="mb-2 space-y-2 text-center">
              <div className="flex justify-center">
                <CloudUpload className="text-muted-foreground size-7" />
              </div>
              <div className="text-center">
                <p>Drag and drop your files here</p>
                <p>Limit 15MB per file. Supported files: .MP3</p>
              </div>
            </div>
            <input ref={fileInputRef} type="file" hidden id="browse" {...getInputProps()} />
            <label
              htmlFor="browse"
              className="bg-primary w-fit cursor-pointer rounded-md px-3 py-2 text-white active:scale-95"
            >
              Browse files
            </label>
          </div>
        </div>
        <div className="">
          {files.length !== 0 && (
            <ul className="max-h-[350px] overflow-y-auto">
              {files.map((file, index) => (
                <li key={index} className="flex items-center">
                  <SongFileItem index={index} fileName={file.name} onDelete={handleRemoveFile} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default ImportSongsTab;
