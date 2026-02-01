'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  animate?: boolean
}

export function Card({ children, onClick, className = '', animate = true }: CardProps) {
  const Component = animate ? motion.div : 'div'
  
  return (
    <Component
      onClick={onClick}
      whileHover={animate && onClick ? { scale: 1.02 } : undefined}
      whileTap={animate && onClick ? { scale: 0.98 } : undefined}
      className={`
        bg-white rounded-2xl p-4 shadow-lg shadow-purple-500/10
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  )
}
