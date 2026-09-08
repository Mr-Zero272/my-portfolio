import { useAnimatedIcon } from '@/hooks/use-animated-icon';
import { AnimatedIconHandle } from '@/types/animated-icon';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cloneElement, forwardRef, useMemo } from 'react';
import { Button, ButtonProps } from '../ui/button';

interface ButtonWithAnimatedIconProps extends Omit<
  ButtonProps,
  'children' | 'onMouseEnter' | 'onMouseLeave'
> {
  icon: React.ReactElement<{ ref?: React.Ref<AnimatedIconHandle> }>;
  iconPosition?: 'start' | 'end';
  label?: string;
  children?: React.ReactNode;
  /**
   * Tùy chọn wrapper. Nếu có thì dùng item từ render, không có thì mặc định là Button.
   * Có thể truyền ReactElement hoặc function nhận props + state để render.
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<ButtonProps>, state: unknown) => React.ReactElement);
}

export const ButtonWithAnimatedIcon = forwardRef<
  HTMLButtonElement | HTMLElement,
  ButtonWithAnimatedIconProps
>(function ButtonWithAnimatedIcon(
  { icon: Icon, iconPosition = 'start', label, children, render, ...buttonProps },
  forwardedRef,
) {
  const { iconRef, onMouseEnter, onMouseLeave } = useAnimatedIcon<AnimatedIconHandle>();
  const icon = cloneElement(Icon, { ref: iconRef });

  // Nội dung mặc định của button
  const defaultChildren = (
    <>
      {iconPosition === 'start' && icon}
      {label}
      {children}
      {iconPosition === 'end' && icon}
    </>
  );

  const internalRef = useMemo(() => forwardedRef ?? null, [forwardedRef]);

  const element = useRender({
    defaultTagName: 'button',
    ref: internalRef,
    render,
    props: mergeProps<typeof Button>(
      {
        ...buttonProps,
        onMouseEnter,
        onMouseLeave,
        children: defaultChildren,
      } as ButtonProps,
      {},
    ),
  });

  return element as React.ReactElement;
});
