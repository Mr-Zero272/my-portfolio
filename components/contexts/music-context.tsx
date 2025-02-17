'use client';

import { musicImages } from '@/constants/music-images';
import { moveElementInArray } from '@/lib/utils';
import { Howl } from 'howler';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface MusicPlayerContextType {
    tracks: string[];
    trackNames: string[];
    setTrack: (index: number) => void;
    setTrackNames: (trackNames: string[]) => void;
    setTracks: (tracks: string[]) => void;
    currentTrackIndex: number;
    isPlaying: boolean;
    progress: number;
    duration: number;
    deleteTrack: (index: number) => void;
    updateTrackPosition: (oldPosition: number, newPosition: number) => void;
    updateTrackName: (newName: string, position: number) => void;
    isEditingTrackName: boolean;
    updateEditingTrackNameState: (state: boolean) => void;
    play: () => void;
    pause: () => void;
    nextTrack: () => void;
    previousTrack: () => void;
    shuffle: () => void;
    repeat: boolean;
    isShuffle: boolean;
    toggleRepeat: () => void;
    seek: (time: number) => void;
    musicBackgroundSrc: string;
    volume: number;
    setVolume: (volume: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export const useMusicPlayer = () => {
    const context = useContext(MusicPlayerContext);
    if (!context) {
        throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
    }
    return context;
};

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tracks, setTracks] = useState<string[]>([]);
    const [trackNames, setTrackNames] = useState<string[]>([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [repeat, setRepeat] = useState<boolean>(false);
    const [isShuffle, setIsShuffle] = useState<boolean>(false);
    const [isEditingTrackName, setIsEditingTrackName] = useState<boolean>(false);
    const [musicBackgroundSrc, setMusicBackgroundSrc] = useState<string>(musicImages[0]);
    const [volume, setVolume] = useState(1.0);
    const soundRef = useRef<Howl | null>(null);
    const currentTrackSrcRef = useRef<string | null>(null);

    const randomMusicBackground = () => {
        const randomIndex = Math.floor(Math.random() * musicImages.length);
        setMusicBackgroundSrc(musicImages[randomIndex]);
    };

    const nextTrack = useCallback(() => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
        randomMusicBackground();
    }, [tracks]);

    const previousTrack = useCallback(() => {
        if (progress > 2) {
            soundRef.current?.seek(0);
            return;
        }
        setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
        randomMusicBackground();
    }, [tracks, progress]);

    const setTrack = useCallback((index: number) => {
        setCurrentTrackIndex(index);
        randomMusicBackground();
    }, []);

    const play = useCallback(() => {
        if (tracks.length === 0) {
            toast.info('You need to add some music files to play');
            return;
        }

        if (soundRef.current) {
            soundRef.current.play();
        }
    }, [tracks]);

    const deleteTrack = useCallback((index: number) => {
        setTracks((prevTracks) => {
            URL.revokeObjectURL(prevTracks[index]);
            const updatedTracks = prevTracks.filter((_, i) => i !== index);

            if (updatedTracks.length === 0) {
                setCurrentTrackIndex(-1);
            }

            return updatedTracks;
        });

        setTrackNames((prevNames) => prevNames.filter((_, i) => i !== index));
    }, []);

    const updateTrackPosition = useCallback((oldPosition: number, newPosition: number) => {
        setTracks((prevTracks) => {
            const updateTracks = moveElementInArray(prevTracks, oldPosition, newPosition);
            setCurrentTrackIndex(newPosition);

            return updateTracks;
        });

        setTrackNames((prevNames) => {
            const updateNames = moveElementInArray(prevNames, oldPosition, newPosition);
            return updateNames;
        });
    }, []);

    const pause = useCallback(() => {
        if (soundRef.current) {
            soundRef.current.pause();
        }
    }, []);

    const shuffle = useCallback(() => {
        setIsShuffle((prev) => !prev);
        const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
        setTracks(shuffledTracks);
        setCurrentTrackIndex(0);
    }, [tracks]);

    const toggleRepeat = useCallback(() => {
        setRepeat((prev) => !prev);
    }, []);

    const seek = useCallback((time: number) => {
        if (soundRef.current) {
            soundRef.current.seek(time);
        }
    }, []);

    const updateTracks = useCallback((newTracks: string[]) => {
        setTracks(newTracks);
        setCurrentTrackIndex(0);
    }, []);

    const updateTrackNames = useCallback((trackNames: string[]) => {
        setTrackNames(trackNames);
    }, []);

    const updateTrackName = useCallback((newName: string, position: number) => {
        setTrackNames((prevNames) => {
            const updatedNames = [...prevNames];
            updatedNames[position] = newName;
            return updatedNames;
        });
    }, []);

    const updateEditingTrackNameState = useCallback((state: boolean) => {
        setIsEditingTrackName(state);
    }, []);

    const updateVolume = useCallback((volume: number) => {
        setVolume(volume);
        if (soundRef.current) {
            soundRef.current.volume(volume);
        }
    }, []);

    useEffect(() => {
        if (tracks.length > 0 && currentTrackIndex >= 0 && currentTrackIndex < tracks.length) {
            const currentTrackSrc = tracks[currentTrackIndex];
            if (currentTrackIndex === -1) {
                return;
            }

            if (soundRef.current && currentTrackSrcRef.current !== currentTrackSrc) {
                soundRef.current.unload();
                soundRef.current = null;
            }

            if (!soundRef.current) {
                soundRef.current = new Howl({
                    src: [currentTrackSrc],
                    html5: true,
                    volume: volume,
                    onplay: () => setIsPlaying(true),
                    onpause: () => setIsPlaying(false),
                    onstop: () => {
                        setIsPlaying(false);
                        setProgress(0);
                    },
                    onend: () => {
                        if (repeat) {
                            play();
                        } else {
                            if (tracks.length === 1) {
                                play();
                            } else {
                                nextTrack();
                            }
                        }
                    },
                    onseek: () => {
                        const seek = soundRef.current?.seek() || 0;
                        setProgress(seek);
                    },
                    onload: () => {
                        setDuration(soundRef.current?.duration() || 0);
                    },
                });

                // Update the ref to track the current track's source
                currentTrackSrcRef.current = currentTrackSrc;

                soundRef.current.play();
            }
        }
    }, [tracks, currentTrackIndex, isPlaying, nextTrack, play, repeat, volume]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (soundRef.current && isPlaying) {
                const seek = soundRef.current.seek();
                setProgress(seek);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isEditingTrackName) {
                if (isPlaying) {
                    pause();
                } else {
                    play();
                }
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                const seek = soundRef.current?.seek() || 0;
                soundRef.current?.seek(seek + 10 > duration ? duration : seek + 10);
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                const seek = soundRef.current?.seek() || 0;
                soundRef.current?.seek(seek - 10 > 0 ? 0 : seek - 10);
            } else if (e.code === 'ArrowUp') {
                e.preventDefault();
                updateVolume(Math.min(volume + 0.1, 1));
            } else if (e.code === 'ArrowDown') {
                e.preventDefault();
                updateVolume(Math.max(volume - 0.1, 0));
            } else if (e.code === 'KeyM') {
                if (volume > 0) {
                    updateVolume(0);
                } else {
                    updateVolume(1);
                }
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [isPlaying, seek, duration, progress, updateVolume, play, pause, volume, isEditingTrackName]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            tracks.forEach((trackUrl) => URL.revokeObjectURL(trackUrl));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup the event listener when the component is unmounted
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [tracks]);

    return (
        <MusicPlayerContext.Provider
            value={{
                tracks,
                trackNames,
                setTrackNames: updateTrackNames,
                updateTrackName,
                isEditingTrackName,
                updateEditingTrackNameState,
                setTracks: updateTracks,
                currentTrackIndex,
                musicBackgroundSrc,
                isPlaying,
                progress,
                duration,
                setTrack,
                play,
                pause,
                updateTrackPosition,
                deleteTrack,
                nextTrack,
                previousTrack,
                shuffle,
                isShuffle,
                repeat,
                toggleRepeat,
                seek,
                volume,
                setVolume: updateVolume,
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};
