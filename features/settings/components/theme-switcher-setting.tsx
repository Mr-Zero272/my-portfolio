import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { themes } from '../constants/appearance-settings';

type ThemeSwitcherSettingProps = {
  theme?: string;
  setTheme: (theme: string) => void;
};

const ThemeSwitcherSetting = ({ theme, setTheme }: ThemeSwitcherSettingProps) => {
  return (
    <div className="space-y-4">
      <Label>Theme Mode</Label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {themes.map(({ name, icon: Icon, value, description }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-4 transition-colors hover:bg-accent',
              theme === value ? 'border-primary' : 'border-transparent',
            )}
          >
            <Icon className="h-6 w-6" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcherSetting;
