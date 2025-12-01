'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

type Props = {
  text: string;
  className?: string;
};

const CopyToClipBoardButton = ({ text, className = '' }: Props) => {
  const [status, setStatus] = useState('idle');
  const [_, copy] = useCopyToClipboard();

  useEffect(() => {
    if (status === 'copied') {
      setTimeout(() => {
        setStatus('idle');
      }, 1000);
    }
  }, [status]);

  const handleCopy = async () => {
    await copy(text);
    setStatus('copied');
  };

  return (
    <button
      className={`hidden rounded-md p-0.5 hover:bg-accent md:p-1.5 md:group-hover:inline-block ${className}`}
      onClick={handleCopy}
    >
      {status === 'idle' ? (
        <Copy className="size-3 text-muted-foreground md:size-4" />
      ) : (
        <Check className="size-3 text-muted-foreground md:size-4" />
      )}
    </button>
  );
};

export default CopyToClipBoardButton;
