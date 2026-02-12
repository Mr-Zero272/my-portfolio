import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { CursorStyle } from '@/store/use-settings';
import { cursorStyles } from '../constants/appearance-settings';

type CustomCursorPickerProps = {
  isAnimationCursorEnabled: boolean;
  cursorStyle: CursorStyle;
  setCursorStyle: (cursorStyle: CursorStyle) => void;
  setIsAnimationCursorEnabled: (enabled: boolean) => void;
};

const CustomCursorPicker = ({
  isAnimationCursorEnabled,
  cursorStyle,
  setCursorStyle,
  setIsAnimationCursorEnabled,
}: CustomCursorPickerProps) => {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Enable Animation Cursor</Label>
          <p className="text-xs text-muted-foreground">Use special cursor instead of default cursor</p>
        </div>
        <Switch checked={isAnimationCursorEnabled} onCheckedChange={setIsAnimationCursorEnabled} />
      </div>
      {isAnimationCursorEnabled && (
        <div>
          <Label className="text-sm font-medium">Cursor Style</Label>
          <p className="text-xs text-muted-foreground">Choose your cursor style</p>
          <RadioGroup value={cursorStyle} onValueChange={setCursorStyle as never} className="space-y-2 py-2">
            {cursorStyles.map(({ name, icon, value }) => (
              <div key={value} className="flex items-center gap-3">
                <RadioGroupItem value={value} id={value} />
                <Label className="flex items-center gap-3" htmlFor={value}>
                  <span className="text-sm">{name}</span>
                  <span>{icon}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </>
  );
};

export default CustomCursorPicker;
