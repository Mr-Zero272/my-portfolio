'use client';

import { useColorContext } from '@/components/contexts/color-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSettingsStore } from '@/store/use-settings';
import { useTheme } from 'next-themes';
import AccentColorPicker from '../components/accent-color-picker';
import CustomCursorPicker from '../components/custom-cursor-picker';
import PageTransitionSetting from '../components/page-transition-setting';
import ThemeSwitcherSetting from '../components/theme-switcher-setting';

const AppearanceSettingsSection = () => {
  const { theme, setTheme } = useTheme();
  const { currentColor, switchColor } = useColorContext();
  const {
    isTransitionPageEnabled,
    setIsTransitionPageEnabled,
    isAnimationCursorEnabled,
    setIsAnimationCursorEnabled,
    cursorStyle,
    setCursorStyle,
  } = useSettingsStore();

  const handleResetToDefault = () => {
    setTheme('system');
    switchColor('orange');
    setIsTransitionPageEnabled(true);
    setIsAnimationCursorEnabled(false);
  };

  return (
    <div className="max-w-7xl space-y-6 md:pr-10">
      <Card className="border-none shadow-none">
        <CardHeader className="border-b">
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the appearance of your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThemeSwitcherSetting theme={theme} setTheme={setTheme} />
          <Separator />
          <AccentColorPicker currentColor={currentColor} switchColor={switchColor} />
          <Separator />
          <PageTransitionSetting
            isTransitionPageEnabled={isTransitionPageEnabled}
            setIsTransitionPageEnabled={setIsTransitionPageEnabled}
          />
          <Separator />
          <CustomCursorPicker
            isAnimationCursorEnabled={isAnimationCursorEnabled}
            cursorStyle={cursorStyle}
            setCursorStyle={setCursorStyle}
            setIsAnimationCursorEnabled={setIsAnimationCursorEnabled}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleResetToDefault}>
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettingsSection;
