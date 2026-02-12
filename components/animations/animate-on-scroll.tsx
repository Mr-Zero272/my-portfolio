'use client';

import { motion, useInView, type Variants } from 'motion/react';
import { useRef } from 'react';

// Định nghĩa các animation variants
const animationVariants: Record<string, Variants> = {
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },

  fadeUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },

  fadeDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },

  fadeLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },

  fadeRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },

  fadeTopLeft: {
    hidden: { opacity: 0, x: -50, y: -50 },
    visible: { opacity: 1, x: 0, y: 0 },
  },

  fadeTopRight: {
    hidden: { opacity: 0, x: 50, y: -50 },
    visible: { opacity: 1, x: 0, y: 0 },
  },

  fadeBottomLeft: {
    hidden: { opacity: 0, x: -50, y: 50 },
    visible: { opacity: 1, x: 0, y: 0 },
  },

  fadeBottomRight: {
    hidden: { opacity: 0, x: 50, y: 50 },
    visible: { opacity: 1, x: 0, y: 0 },
  },

  // Scale animations
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },

  scaleUp: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  },

  // Slide animations (từ ngoài viewport)
  slideUp: {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },

  slideDown: {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },

  slideLeft: {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },

  slideRight: {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },

  // Rotate animations
  rotateIn: {
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0 },
  },

  // Zoom animations
  zoomIn: {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  },

  zoomOut: {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1 },
  },

  // Flip animation
  flipUp: {
    hidden: { opacity: 0, rotateX: -90 },
    visible: { opacity: 1, rotateX: 0 },
  },

  // Blur animation
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },

  // Combined effects
  bounceIn: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    },
  },

  // Stagger children (dùng cho container có nhiều children)
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};

interface AnimateOnScrollProps {
  children: React.ReactNode;
  variant?:
    | 'fadeIn'
    | 'fadeUp'
    | 'fadeDown'
    | 'fadeLeft'
    | 'fadeRight'
    | 'fadeTopLeft'
    | 'fadeTopRight'
    | 'fadeBottomLeft'
    | 'fadeBottomRight'
    | 'scaleIn'
    | 'scaleUp'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'rotateIn'
    | 'zoomIn'
    | 'zoomOut'
    | 'flipUp'
    | 'blurIn'
    | 'bounceIn'
    | 'staggerContainer'
    | 'staggerItem';
  duration?: number;
  delay?: number;
  easing?: [number, number, number, number];
  once?: boolean;
  threshold?: number;
  className?: string;
  customVariants?: Variants | null;
  viewport?: {
    margin?: string;
  };
  [key: string]: unknown;
}

const AnimateOnScroll = ({
  children,
  variant = 'fadeUp',
  duration = 0.6,
  delay = 0,
  easing = [0.25, 0.1, 0.25, 1],
  once = true,
  threshold = 0.1,
  className = '',
  customVariants = null,
  viewport: _viewport,
  ...props
}: AnimateOnScrollProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  // Sử dụng custom variants nếu có, không thì dùng preset
  const selectedVariants = customVariants || animationVariants[variant];

  // Transition mặc định
  const defaultTransition = {
    duration,
    delay,
    ease: easing,
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={selectedVariants}
      transition={defaultTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnScroll;
