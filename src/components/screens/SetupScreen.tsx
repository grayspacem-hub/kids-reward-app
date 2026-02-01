'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'
import { useAppStore } from '@/lib/store'

const AVATARS = ['🦁', '🐰', '🦊', '🐼', '🐨', '🦄', '🐸', '🐙', '🦋', '🐝']

export function SetupScreen() {
  const [step, setStep] = useState<'welcome' | 'family' | 'children' | 'pin'>('welcome')
  const [familyName, setFamilyName] = useState('')
  const [pin, setPin] = useState('')
  const [children, setChildren] = useState<{ name: string; avatar: string }[]>([])
  const [newChildName, setNewChildName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  
  const { setupFamily, addChild } = useAppStore()

  const handleAddChild = () => {
    if (newChildName.trim()) {
      setChildren([...children, { name: newChildName.trim(), avatar: selectedAvatar }])
      setNewChildName('')
      setSelectedAvatar(AVATARS[(children.length + 1) % AVATARS.length])
    }
  }

  const handleFinish = () => {
    setupFamily(familyName, pin)
    children.forEach(child => addChild(child.name, child.avatar))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 safe-top safe-bottom">
      {step === 'welcome' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            ⭐
          </motion.div>
          <h1 className="text-4xl font-bold text-purple-600 mb-3">Star Rewards</h1>
          <p className="text-gray-600 mb-8">
            Complete tasks, earn stars, and unlock awesome rewards!
          </p>
          <Button size="lg" onClick={() => setStep('family')}>
            Let&apos;s Get Started! 🚀
          </Button>
        </motion.div>
      )}

      {step === 'family' && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
            What&apos;s your family name? 👨‍👩‍👧‍👦
          </h2>
          <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="The Smith Family"
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none text-lg mb-4"
          />
          <Button 
            size="lg" 
            className="w-full"
            disabled={!familyName.trim()}
            onClick={() => setStep('children')}
          >
            Next →
          </Button>
        </motion.div>
      )}

      {step === 'children' && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
            Add your kids 🧒
          </h2>
          
          <div className="space-y-3 mb-6">
            {children.map((child, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-white rounded-xl p-3 shadow"
              >
                <span className="text-3xl">{child.avatar}</span>
                <span className="font-medium text-gray-700">{child.name}</span>
                <button
                  onClick={() => setChildren(children.filter((_, j) => j !== i))}
                  className="ml-auto text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <input
              type="text"
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              placeholder="Child's name"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 mb-3"
              onKeyDown={(e) => e.key === 'Enter' && handleAddChild()}
            />
            <div className="flex gap-2 flex-wrap mb-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-2xl p-1 rounded-lg transition-all ${
                    selectedAvatar === avatar 
                      ? 'bg-purple-100 scale-110' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            <Button variant="secondary" className="w-full" onClick={handleAddChild}>
              + Add Child
            </Button>
          </div>

          <Button 
            size="lg" 
            className="w-full"
            disabled={children.length === 0}
            onClick={() => setStep('pin')}
          >
            Next →
          </Button>
        </motion.div>
      )}

      {step === 'pin' && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm text-center"
        >
          <h2 className="text-2xl font-bold text-purple-600 mb-2">
            Set a Parent PIN 🔒
          </h2>
          <p className="text-gray-600 mb-6">
            You&apos;ll need this to approve tasks and manage settings
          </p>
          
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="4-digit PIN"
            maxLength={4}
            className="w-32 mx-auto px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none text-2xl text-center tracking-widest mb-6"
            inputMode="numeric"
          />

          <Button 
            size="lg" 
            className="w-full"
            disabled={pin.length !== 4}
            onClick={handleFinish}
          >
            Start Earning Stars! ⭐
          </Button>
        </motion.div>
      )}
    </div>
  )
}
