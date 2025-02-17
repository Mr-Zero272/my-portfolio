'use client';
import { useMusicPlayer } from '@/components/contexts/music-context';
import DragNDrop from '@/components/shared/drag-n-drop';
import { ChevronLeft } from 'lucide-react';
import { useCallback } from 'react';

type Props = {
    onBack: () => void;
};

const ImportSongsTab = ({ onBack }: Props) => {
    const { setTracks, tracks, setTrackNames } = useMusicPlayer();

    const handleSelectFileChange = useCallback(
        (files: File[]) => {
            if (files.length === 0) return;

            // Revoke previous object URLs to free up memory
            tracks.forEach((track) => URL.revokeObjectURL(track));

            const fileUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setTracks(fileUrls);
            setTrackNames(files.map((file) => file.name.slice(0, file.name.length - 4)));
            onBack();
        },
        [setTracks, tracks, setTrackNames, onBack],
    );

    return (
        <div>
            <div className="mb-2 flex items-center gap-x-2">
                <button className="group rounded-md p-1.5 hover:bg-accent/40" onClick={onBack}>
                    <ChevronLeft className="size-6 transition-all duration-200 ease-in-out group-active:pr-2" />
                </button>
                <h1 className="font-medium">Add songs</h1>
            </div>
            <DragNDrop onFilesSelected={handleSelectFileChange} />
        </div>
    );
};

export default ImportSongsTab;
