'use client';
import { CloudUpload } from 'lucide-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SongFileItem from '../ui/song-file-item';

type Props = {
    onFilesSelected: (files: File[]) => void;
};

const DragNDrop = ({ onFilesSelected }: Props) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const newFiles = Array.from(selectedFiles);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        const files = event.dataTransfer.files;
        const validFiles = Array.from(files).filter((file) => file.type === 'audio/mpeg');
        if (validFiles.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        }
        event.preventDefault();
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    useEffect(() => {
        onFilesSelected(files);
    }, [files, onFilesSelected]);

    return (
        <section>
            <div className="mb-5 flex items-center justify-center rounded-2xl border border-dashed p-12">
                <div
                    className="flex flex-col items-center justify-center"
                    onDrop={handleDrop}
                    onDragOver={(event) => event.preventDefault()}
                >
                    <div className="mb-2 space-y-2 text-center">
                        <div className="flex justify-center">
                            <CloudUpload className="size-7 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p>Drag and drop your files here</p>
                            <p>Limit 15MB per file. Supported files: .MP3</p>
                        </div>
                    </div>
                    <input type="file" hidden id="browse" onChange={handleFileChange} accept=".mp3,audio/*" multiple />
                    <label
                        htmlFor="browse"
                        className="w-fit cursor-pointer rounded-md bg-primary px-3 py-2 text-white active:scale-95"
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
    );
};

export default DragNDrop;
