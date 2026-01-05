'use client';

import { AudioWaveformIcon } from '@/components/icons/audio-waveform';
import { useState } from 'react';
import { TwitterPicker } from 'react-color';

export default function SortableDefault() {
  const [color, setColor] = useState('#000000');
  console.log({
    color,
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <TwitterPicker color={color} onChange={(e) => setColor(e.hex)} />
      <AudioWaveformIcon width={40} height={40} />
    </div>
  );
}
