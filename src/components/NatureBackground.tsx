import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Leaf {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
}

interface NeonLight {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
  delay: number;
  angle: number;
}

const NatureBackground: React.FC = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [neonLights, setNeonLights] = useState<NeonLight[]>([]);

  useEffect(() => {
    // Leaf generation - increased frequency
    const leafInterval = setInterval(() => {
      const newLeaf: Leaf = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 15 + 15,
        rotation: Math.random() * 360,
        duration: Math.random() * 10 + 6, // slightly faster
        delay: Math.random() * 2,
      };
      setLeaves((prev) => [...prev.slice(-60), newLeaf]); // keep more leaves
    }, 450); // faster generation

    // Neon light generation - increased frequency
    const neonInterval = setInterval(() => {
      const newNeon: NeonLight = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: Math.random() * 200 + 100, // slightly longer
        height: 2,
        duration: Math.random() * 3 + 2, // faster
        delay: Math.random() * 1,
        angle: Math.random() * 30 - 15,
      };
      setNeonLights((prev) => [...prev.slice(-30), newNeon]); // keep more lights
    }, 800); // faster generation

    return () => {
      clearInterval(leafInterval);
      clearInterval(neonInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* High-Tech Neon Lights */}
      <AnimatePresence>
        {neonLights.map((light) => (
          <motion.div
            key={light.id}
            initial={{ 
              opacity: 0, 
              x: '-20vw', 
              y: `${light.y}vh`,
              rotate: light.angle,
              scaleX: 0
            }}
            animate={{ 
              opacity: [0, 0.4, 0.4, 0],
              x: '120vw',
              scaleX: [1, 1.5, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: light.duration, 
              ease: "linear",
              times: [0, 0.2, 0.8, 1]
            }}
            className="absolute"
            style={{ 
              width: light.width, 
              height: light.height,
              background: 'linear-gradient(90deg, transparent, #00BCD4, transparent)',
              boxShadow: '0 0 20px #00BCD4, 0 0 40px #00BCD4',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Floating Leaf Particles */}
      <AnimatePresence>
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{ 
              opacity: 0, 
              x: `${leaf.x}vw`, 
              y: '-10vh', 
              rotate: leaf.rotation 
            }}
            animate={{ 
              opacity: [0, 0.7, 0.7, 0],
              y: '110vh',
              x: `${leaf.x + (Math.random() * 30 - 15)}vw`,
              rotate: leaf.rotation + 720
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: leaf.duration, 
              ease: "easeInOut",
              times: [0, 0.1, 0.9, 1]
            }}
            className="absolute text-accent/40"
            style={{ 
              width: leaf.size, 
              height: leaf.size,
              filter: 'drop-shadow(0 0 12px rgba(0, 188, 212, 0.3))'
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              {/* Realistic Leaf Shape */}
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
              {/* Internal vein for digital look */}
              <path d="M2,13.5C2,11.5 4,7.25 9,6.25C14,5.25 21,5 22,3C22,3 19,20 8,20C7.64,20 7.14,19.87 6.66,19.7L12,12L17,8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NatureBackground;
