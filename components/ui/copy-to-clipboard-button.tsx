'use client';
import React, { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { Check, Copy } from 'lucide-react';

type Props = {
    text: string;
    className?: string;
};

const CopyToClipBoardButton = ({ text, className = '' }: Props) => {
    const [status, setStatus] = useState('idle');
    useEffect(() => {
        if (status === 'copied') {
            setTimeout(() => {
                setStatus('idle');
            }, 1000);
        }
    }, [status]);

    const handleCopy = () => {
        copy(text);
        setStatus('copied');
    };
    return (
        <button
            className={`hidden rounded-md p-0.5 hover:bg-accent md:p-1.5 md:group-hover:inline-block ${className}`}
            onClick={handleCopy}
        >
            {status === 'idle' ? (
                <Copy className="size-3 text-gray-500 md:size-4" />
            ) : (
                <Check className="size-3 text-gray-500 md:size-4" />
            )}
        </button>
    );
};

export default CopyToClipBoardButton;
