import { Music, X } from 'lucide-react';
import React from 'react';

type Props = {
    fileName: string;
    index: number;
    onDelete: (index: number) => void;
};

const SongFileItem = ({ fileName, index, onDelete }: Props) => {
    return (
        <div className="group flex w-full items-center justify-between rounded-2xl px-3 py-2 hover:bg-accent/40">
            <div className="flex items-center gap-x-2">
                <Music />
                <p>{fileName}</p>
            </div>
            <button className="rounded-md p-1.5" onClick={() => onDelete(index)}>
                <X className="text-muted-foreground group-hover:text-destructive" />
            </button>
        </div>
    );
};

export default SongFileItem;
