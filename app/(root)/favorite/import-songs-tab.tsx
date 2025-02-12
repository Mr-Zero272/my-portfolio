'use client';
import DragNDrop from '@/components/shared/drag-n-drop';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

type Props = {};

const ImportSongsTab = (props: Props) => {
    return (
        <div>
            <div className="mb-2 flex items-center gap-x-2">
                <button className="group rounded-md p-1.5 hover:bg-accent/40">
                    <ChevronLeft className="size-6 transition-all duration-200 ease-in-out group-active:pr-2" />
                </button>
                <h1 className="font-medium">Add songs</h1>
            </div>
            <DragNDrop onFilesSelected={(files: File[]) => {}} />
        </div>
    );
};

export default ImportSongsTab;
