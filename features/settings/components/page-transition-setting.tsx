import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type PageTransitionSettingProps = {
  isTransitionPageEnabled: boolean;
  setIsTransitionPageEnabled: (enabled: boolean) => void;
};

const PageTransitionSetting = ({ isTransitionPageEnabled, setIsTransitionPageEnabled }: PageTransitionSettingProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <Label className="text-sm font-medium">Enable Page Transition</Label>
        <p className="text-xs text-muted-foreground">Smooth transitions when navigating between pages</p>
      </div>
      <Switch checked={isTransitionPageEnabled} onCheckedChange={setIsTransitionPageEnabled} />
    </div>
  );
};

export default PageTransitionSetting;
