import { motion, type Variants } from 'framer-motion';

import { Button, type ButtonProps } from './button';

// Animation variants for the button
const buttonAnimations: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 15,
    },
  },
  focus: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10,
    },
  },
};

// Special animation for icon buttons
const iconButtonAnimations: Variants = {
  initial: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.9,
    rotate: -5,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 15,
    },
  },
};

export type AnimatedButtonProps = ButtonProps & {
  disableAnimation?: boolean;
};

function AnimatedButton({ size, disableAnimation = false, ...props }: AnimatedButtonProps) {
  // Choose appropriate animation based on button size
  const animations = size === 'icon' ? iconButtonAnimations : buttonAnimations;

  // If animations are disabled, return regular button
  if (disableAnimation) {
    return <Button size={size} {...props} />;
  }

  // Return animated button wrapper
  return (
    <motion.div
      variants={animations}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      whileFocus="focus"
      style={{ display: 'inline-block' }}
    >
      <Button size={size} {...props} />
    </motion.div>
  );
}

export { AnimatedButton };
