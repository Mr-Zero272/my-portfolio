// Example usage of AnimatedButton

import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';

export function ButtonExamples() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Button Examples</h2>

      {/* Regular Button (no animation) */}
      <div className="space-x-2">
        <Button>Regular Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button size="icon">🚀</Button>
      </div>

      {/* Animated Button */}
      <div className="space-x-2">
        <AnimatedButton>Animated Button</AnimatedButton>
        <AnimatedButton variant="outline">Animated Outline</AnimatedButton>
        <AnimatedButton size="icon">🎯</AnimatedButton>
      </div>

      {/* Animated Button with disabled animation */}
      <div className="space-x-2">
        <AnimatedButton disableAnimation>No Animation</AnimatedButton>
      </div>
    </div>
  );
}
