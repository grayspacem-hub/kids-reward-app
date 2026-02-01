'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { StarBurst } from '@/components/StarBurst'
import { Confetti } from '@/components/Confetti'
import { useAppStore } from '@/lib/store'

type Tab = 'tasks' | 'rewards'

export function KidDashboard() {
  const [tab, setTab] = useState<Tab>('tasks')
  const [starBurst, setStarBurst] = useState(0)
  const [confetti, setConfetti] = useState(0)
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null)
  
  const { 
    getActiveChild, 
    setActiveChild, 
    tasks, 
    rewards, 
    completions,
    completeTask, 
    redeemReward 
  } = useAppStore()
  
  const child = getActiveChild()
  if (!child) return null

  const pendingTaskIds = new Set(
    completions
      .filter(c => c.child_id === child.id && c.status === 'pending')
      .map(c => c.task_id)
  )

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId)
    setCompletedTaskId(taskId)
    setStarBurst(prev => prev + 1)
    setTimeout(() => setCompletedTaskId(null), 2000)
  }

  const handleRedeemReward = (rewardId: string) => {
    const success = redeemReward(rewardId)
    if (success) {
      setConfetti(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col safe-top safe-bottom">
      <Confetti trigger={confetti} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-500 text-white p-4 rounded-b-3xl shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setActiveChild(null)}
            className="text-white/80 hover:text-white"
          >
            ← Back
          </button>
          <div className="text-right">
            <div className="text-sm opacity-80">Hello,</div>
            <div className="font-bold text-lg">{child.name} {child.avatar}</div>
          </div>
        </div>
        
        <div className="relative flex items-center justify-center py-4">
          <StarBurst trigger={starBurst} />
          <motion.div
            key={child.stars}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="text-5xl font-bold">{child.stars}</div>
            <div className="text-white/80 flex items-center justify-center gap-1">
              <span>⭐</span> Stars
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-4">
        <button
          onClick={() => setTab('tasks')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
            tab === 'tasks' 
              ? 'bg-purple-500 text-white shadow-lg' 
              : 'bg-white text-gray-600'
          }`}
        >
          📋 Tasks
        </button>
        <button
          onClick={() => setTab('rewards')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
            tab === 'rewards' 
              ? 'bg-yellow-400 text-gray-800 shadow-lg' 
              : 'bg-white text-gray-600'
          }`}
        >
          🎁 Rewards
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {tab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {tasks.filter(t => t.is_active).map((task, i) => {
                const isPending = pendingTaskIds.has(task.id)
                const justCompleted = completedTaskId === task.id
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className={`flex items-center gap-4 ${isPending ? 'opacity-60' : ''}`}>
                      <div className="text-3xl">{task.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-700">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500">{task.description}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                          +{task.stars} ⭐
                        </div>
                        {isPending ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xs text-orange-500 font-medium"
                          >
                            ⏳ Pending
                          </motion.div>
                        ) : justCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xs text-green-500 font-medium"
                          >
                            ✓ Done!
                          </motion.div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            Done!
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {tab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {rewards.filter(r => r.is_active).map((reward, i) => {
                const canAfford = child.stars >= reward.star_cost
                
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className={`flex items-center gap-4 ${!canAfford ? 'opacity-60' : ''}`}>
                      <div className="text-3xl">{reward.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-700">{reward.title}</div>
                        {reward.description && (
                          <div className="text-sm text-gray-500">{reward.description}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-purple-500 font-bold mb-1">
                          {reward.star_cost} ⭐
                        </div>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          disabled={!canAfford}
                          onClick={() => handleRedeemReward(reward.id)}
                        >
                          Get it!
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
