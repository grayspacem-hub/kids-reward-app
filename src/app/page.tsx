'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { SetupScreen } from '@/components/screens/SetupScreen'
import { ChildSelectScreen } from '@/components/screens/ChildSelectScreen'
import { KidDashboard } from '@/components/screens/KidDashboard'
import { ParentDashboard } from '@/components/screens/ParentDashboard'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { isSetupComplete, activeChildId, isParentMode } = useAppStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-6xl"
        >
          ⭐
        </motion.div>
      </div>
    )
  }

  if (!isSetupComplete) {
    return <SetupScreen />
  }

  if (isParentMode) {
    return <ParentDashboard />
  }

  if (!activeChildId) {
    return <ChildSelectScreen />
  }

  return <KidDashboard />
}
