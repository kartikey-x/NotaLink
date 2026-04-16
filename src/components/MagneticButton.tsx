import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  strength?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  style,
  strength = 0.2,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // useMotionValue bypasses React state for 60fps+ buttery smooth tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Apply spring physics directly to the motion values
  const springConfig = { damping: 20, stiffness: 100, mass: 0.05 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, x: springX, y: springY }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;