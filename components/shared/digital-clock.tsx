'use client';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

const DigitalClock = () => {
    const [currentTime, setCurrentTime] = useState(() => new Date().toISOString());
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
        setInterval(() => {
            setCurrentTime(new Date().toISOString());
        }, 1000);
    }, []);

    if (!hydrated) {
        return null;
    }
    return <div className="p-1 text-[15px]">{format(currentTime, 'MMM dd, yyyy hh:mm:ss a')}</div>;
};

export default DigitalClock;
