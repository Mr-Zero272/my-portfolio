import { AccentColor } from '@/components/contexts/color-context';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';
import { colors } from '../constants/appearance-settings';

interface AccentColorPickerProps {
  currentColor: string;
  switchColor: (color: AccentColor) => void;
}

const AccentColorPicker = ({ currentColor, switchColor }: AccentColorPickerProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="accent-color">Accent Color</Label>
      <div className="flex w-full flex-wrap items-center gap-2">
        {colors.map(({ value, color }) => (
          <button
            key={value}
            onClick={() => switchColor(value as never)}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-full border-2 p-1 transition-colors hover:bg-accent',
              currentColor === value ? 'border-primary' : 'border-transparent',
            )}
          >
            <span
              className="flex size-6 items-center justify-center rounded-full border-2 border-background"
              style={{ backgroundColor: color }}
            >
              {currentColor === value && (
                <CircleCheck
                  className="h-4 w-4 fill-white"
                  style={{
                    stroke: color,
                  }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccentColorPicker;
