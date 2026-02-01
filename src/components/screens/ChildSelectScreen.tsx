'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { useAppStore } from '@/lib/store'

export function ChildSelectScreen() {
  const [showPinInput, setShowPinInput] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  
  const { familyName, children, setActiveChild, enterParentMode } = useAppStore()

  const handleParentMode = () => {
    if (enterParentMode(pin)) {
      setShowPinInput(false)
      setPin('')
    } else {
      setError(true)
      setTimeout(() => setError(false), 1000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-6 safe-top safe-bottom">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-purple-600">{familyName}</h1>
        <p className="text-gray-600">Who&apos;s earning stars today?</p>
      </motion.div>

      <div className="flex-1 grid grid-cols-2 gap-4 content-start">
        {children.map((child, i) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card onClick={() => setActiveChild(child.id)} className="text-center py-6">
              <div className="text-5xl mb-2">{child.avatar}</div>
              <div className="font-semibold text-gray-700">{child.name}</div>
              <div className="flex items-center justify-center gap-1 mt-2 text-yellow-500">
                <span className="text-xl">⭐</span>
                <span className="font-bold">{child.stars}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        {!showPinInput ? (
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => setShowPinInput(true)}
          >
            👨‍👩‍👧 Parent Mode
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow"
          >
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter PIN"
              maxLength={4}
              className={`w-full px-4 py-2 rounded-lg border-2 text-center text-xl tracking-widest mb-3 transition-colors ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
              inputMode="numeric"
              autoFocus
            />
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                className="flex-1"
                onClick={() => { setShowPinInput(false); setPin(''); }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleParentMode}
                disabled={pin.length !== 4}
              >
                Enter
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
