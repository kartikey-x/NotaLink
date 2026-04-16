import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  isDarkMode: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isDarkMode }) => {
  const orbs = [
    {
      size: 500,
      color: isDarkMode
        ? 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)',
      animate: {
        x: [0, 80, -40, 60, 0],
        y: [0, 50, 80, -20, 0],
        scale: [1, 1.1, 0.95, 1.08, 1],
      },
      duration: 25,
    },
    {
      size: 400,
      color: isDarkMode
        ? 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)',
      animate: {
        x: [0, -60, 40, -30, 0],
        y: [0, 40, -30, 60, 0],
        scale: [1, 0.95, 1.1, 0.98, 1],
      },
      duration: 30,
    },
    {
      size: 350,
      color: isDarkMode
        ? 'radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
      animate: {
        x: [0, 50, -70, 30, 0],
        y: [0, -50, 30, -40, 0],
        scale: [1, 1.05, 0.92, 1.03, 1],
      },
      duration: 35,
    },
    {
      size: 250,
      color: isDarkMode
        ? 'radial-gradient(circle, rgba(217,119,6,0.04) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
      animate: {
        x: [0, -40, 60, -50, 0],
        y: [0, 60, -20, 40, 0],
        scale: [1, 1.08, 0.96, 1.04, 1],
      },
      duration: 20,
    },
  ];

  const positions = [
    { top: '-8%', right: '-5%' },
    { bottom: '-6%', left: '-5%' },
    { top: '40%', left: '20%' },
    { top: '20%', right: '15%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            mixBlendMode: isDarkMode ? 'screen' : 'multiply',
            willChange: 'transform', // Forces GPU hardware acceleration
            ...positions[i],
          }}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
          }}
        />
      ))}

      {/* Subtle floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            background: isDarkMode
              ? `rgba(251,191,36,${0.1 + Math.random() * 0.15})`
              : `rgba(217,119,6,${0.12 + Math.random() * 0.18})`,
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -(20 + Math.random() * 40), 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Slow breathing gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? 'radial-gradient(ellipse at 50% 50%, rgba(217,119,6,0.03) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.06) 0%, transparent 60%)',
          willChange: 'opacity, transform',
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default React.memo(AnimatedBackground);