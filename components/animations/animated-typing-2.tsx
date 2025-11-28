'use client';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

type Props = {
  text: string;
  words: string[];
  position?: 'ahead' | 'behind';
  className?: string;
  timeChange?: number;
};

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { opacity: { duration: 0 } } },
  exit: { opacity: 0 },
};

const AnimatedTyping2 = ({ text, words, position = 'ahead', className = '', timeChange = 4000 }: Props) => {
  const [activeWord, setActiveWord] = useState(words[0]);
  const ref = React.useRef(null);
  useEffect(() => {
    const itv = setInterval(
      () => {
        const indexOfWord = words.indexOf(activeWord);
        if (indexOfWord !== -1) {
          if (indexOfWord + 1 >= words.length) {
            setActiveWord(words[0]);
          } else {
            setActiveWord(words[indexOfWord + 1]);
          }
        }
      },
      timeChange + activeWord.length * 100,
    );

    return () => {
      clearInterval(itv);
    };
  }, [activeWord, words, timeChange]);
  return (
    <div className={`flex gap-x-1 ${className}`} ref={ref}>
      {position === 'ahead' && <p>{text}</p>}
      <AnimatePresence mode="wait">
        <motion.p key={activeWord} variants={container} initial="hidden" animate="visible" exit="exit">
          {activeWord.split('').map((letter, index) => (
            <motion.span key={index} variants={letterVariants}>
              {letter}
            </motion.span>
          ))}
        </motion.p>
      </AnimatePresence>
      {position === 'behind' && <p>{text}</p>}
    </div>
  );
};

export default AnimatedTyping2;
