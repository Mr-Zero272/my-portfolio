'use client';

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
    play: () => void;
    pause: () => void;
    nextTrack: () => void;
    previousTrack: () => void;
    shuffle: () => void;
    repeat: boolean;
    isShuffle: boolean;
    toggleRepeat: () => void;
    seek: (time: number) => void;
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
    const [trackNames, setTrackNames] = useState<string[]>(['empty']);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [repeat, setRepeat] = useState<boolean>(false);
    const [isShuffle, setIsShuffle] = useState<boolean>(false);
    const soundRef = useRef<Howl | null>(null);

    // console.log('tracks :' + tracks);
    // console.log('trackNames :' + trackNames);
    // console.log('currentTrackIndex :' + currentTrackIndex);
    // console.log('isPlaying :' + isPlaying);
    // console.log('progress :' + progress);
    // console.log('duration :' + duration);
    // console.log('repeat :' + repeat);
    // console.log(soundRef);

    const nextTrack = useCallback(() => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    }, [tracks]);

    const setTrack = useCallback((index: number) => {
        setCurrentTrackIndex(index);
    }, []);

    const play = useCallback(() => {
        if (tracks.length === 0) {
            toast.info('You need to add some music files to play');
            return;
        }
        if (soundRef.current) {
            if (soundRef.current.playing()) {
                return; // Prevent duplicate play calls
            }
            soundRef.current.play();
        }
    }, [tracks]);

    const loadTrack = useCallback(
        (index: number) => {
            if (index === -1) {
                return;
            }

            // TODO this block code have a bug need to solve
            if (soundRef.current && soundRef.current.playing()) {
                return;
            }

            if (soundRef.current) {
                soundRef.current.unload();
            }

            soundRef.current = new Howl({
                src: [tracks[index]],
                html5: true,
                onplay: () => setIsPlaying(true),
                onpause: () => setIsPlaying(false),
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

            if (isPlaying) {
                soundRef.current.play();
            }
        },
        [tracks, repeat, isPlaying, play, nextTrack],
    );

    const deleteTrack = useCallback(
        (index: number) => {
            setTracks((prevTracks) => {
                URL.revokeObjectURL(prevTracks[index]);
                const updatedTracks = prevTracks.filter((_, i) => i !== index);

                if (updatedTracks.length === 0) {
                    setCurrentTrackIndex(-1);
                } else {
                    // If the deleted track is the current one, move to the next track
                    if (index === currentTrackIndex) {
                        nextTrack();
                    } else if (index < currentTrackIndex) {
                        // Adjust index if a previous track is deleted
                        setCurrentTrackIndex((prevIndex) => prevIndex - 1);
                    }
                }

                return updatedTracks;
            });

            setTrackNames((prevNames) => prevNames.filter((_, i) => i !== index));
        },
        [currentTrackIndex, nextTrack],
    );

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

    const previousTrack = useCallback(() => {
        setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    }, [tracks]);

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
            setProgress(time);
        }
    }, []);

    const updateTracks = useCallback((newTracks: string[]) => {
        setTracks(newTracks);
        setCurrentTrackIndex(0);
    }, []);

    const updateTrackNames = useCallback((trackNames: string[]) => {
        setTrackNames(trackNames);
    }, []);

    useEffect(() => {
        if (tracks.length > 0 && currentTrackIndex >= 0 && currentTrackIndex < tracks.length) {
            loadTrack(currentTrackIndex);
        }
    }, [tracks, currentTrackIndex, loadTrack]);

    console.log(currentTrackIndex);

    useEffect(() => {
        const interval = setInterval(() => {
            if (soundRef.current && isPlaying) {
                const seek = soundRef.current.seek();
                setProgress(seek);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <MusicPlayerContext.Provider
            value={{
                tracks,
                trackNames,
                setTrackNames: updateTrackNames,
                setTracks: updateTracks,
                currentTrackIndex,
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
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};
