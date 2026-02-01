'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

export function StarBurst({ trigger }: { trigger: number }) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    if (trigger === 0) return
    
    const newStars: Star[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 0.2,
    }))
    
    setStars(newStars)
    
    const timeout = setTimeout(() => setStars([]), 1000)
    return () => clearTimeout(timeout)
  }, [trigger])

  return (
    <AnimatePresence>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 1, 0],
            x: star.x,
            y: star.y,
            opacity: [1, 1, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.6,
            delay: star.delay,
            ease: 'easeOut',
          }}
          className="absolute pointer-events-none"
          style={{ fontSize: star.size }}
        >
          ⭐
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
