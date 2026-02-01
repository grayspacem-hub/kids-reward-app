'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
}

const COLORS = ['#8B5CF6', '#FCD34D', '#10B981', '#F472B6', '#60A5FA', '#F97316']

export function Confetti({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (trigger === 0) return
    
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 720 - 360,
    }))
    
    setPieces(newPieces)
    
    const timeout = setTimeout(() => setPieces([]), 3000)
    return () => clearTimeout(timeout)
  }, [trigger])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ y: -20, x: `${piece.x}vw`, rotate: 0, opacity: 1 }}
            animate={{ 
              y: '100vh',
              rotate: piece.rotation,
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2.5,
              delay: piece.delay,
              ease: 'linear',
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{ backgroundColor: piece.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
