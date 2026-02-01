'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { useAppStore } from '@/lib/store'

type Tab = 'approvals' | 'tasks' | 'rewards' | 'kids'

export function ParentDashboard() {
  const [tab, setTab] = useState<Tab>('approvals')
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editingReward, setEditingReward] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({ title: '', stars: 1, icon: '✨' })
  const [newReward, setNewReward] = useState({ title: '', star_cost: 5, icon: '🎁' })
  
  const { 
    exitParentMode,
    getPendingCompletions,
    approveCompletion,
    rejectCompletion,
    tasks,
    rewards,
    children,
    addTask,
    removeTask,
    addReward,
    removeReward,
    addChild,
    removeChild,
    resetAll,
  } = useAppStore()

  const pending = getPendingCompletions()
  const ICONS = ['✨', '🛏️', '🦷', '🧹', '📚', '🍽️', '🐕', '📖', '🎹', '🏃', '🎨', '🧺']
  const REWARD_ICONS = ['🎁', '📱', '🍕', '🌙', '🎢', '🍦', '🎮', '🎬', '🛒', '🎪']
  const AVATARS = ['🦁', '🐰', '🦊', '🐼', '🐨', '🦄', '🐸', '🐙', '🦋', '🐝']
  const [newChildName, setNewChildName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])

  return (
    <div className="min-h-screen flex flex-col safe-top safe-bottom">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={exitParentMode}
            className="text-white/80 hover:text-white"
          >
            ← Exit
          </button>
          <h1 className="font-bold text-lg">Parent Dashboard</h1>
          <div className="w-12" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-2 bg-white/50 overflow-x-auto">
        {[
          { id: 'approvals', label: '✅ Approve', count: pending.length },
          { id: 'tasks', label: '📋 Tasks' },
          { id: 'rewards', label: '🎁 Rewards' },
          { id: 'kids', label: '👶 Kids' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              tab === t.id 
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-gray-600'
            }`}
          >
            {t.label}
            {t.count ? (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {/* Approvals Tab */}
          {tab === 'approvals' && (
            <motion.div
              key="approvals"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {pending.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-2">✅</div>
                  No tasks waiting for approval
                </div>
              ) : (
                pending.map((item) => (
                  <Card key={item.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.child.avatar}</span>
                      <span className="font-medium">{item.child.name}</span>
                      <span className="text-gray-400">completed</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="text-2xl">{item.task.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{item.task.title}</div>
                        <div className="text-yellow-500 text-sm">+{item.task.stars} ⭐</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="flex-1"
                        onClick={() => rejectCompletion(item.id)}
                      >
                        ❌ Reject
                      </Button>
                      <Button 
                        variant="success" 
                        className="flex-1"
                        onClick={() => approveCompletion(item.id)}
                      >
                        ✅ Approve
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </motion.div>
          )}

          {/* Tasks Tab */}
          {tab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {/* Add Task Form */}
              <Card>
                <div className="font-semibold mb-3">Add New Task</div>
                <div className="flex gap-2 mb-3">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewTask({ ...newTask, icon })}
                      className={`text-xl p-1 rounded ${newTask.icon === icon ? 'bg-purple-100' : ''}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task name"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <div className="flex gap-2 items-center mb-3">
                  <span className="text-sm text-gray-500">Stars:</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newTask.stars}
                    onChange={(e) => setNewTask({ ...newTask, stars: parseInt(e.target.value) || 1 })}
                    className="w-20 px-2 py-1 border rounded-lg text-center"
                  />
                  <span>⭐</span>
                </div>
                <Button 
                  className="w-full"
                  disabled={!newTask.title.trim()}
                  onClick={() => {
                    addTask({ ...newTask, is_active: true, description: null })
                    setNewTask({ title: '', stars: 1, icon: '✨' })
                  }}
                >
                  + Add Task
                </Button>
              </Card>

              {/* Task List */}
              {tasks.map(task => (
                <Card key={task.id} className="flex items-center gap-3">
                  <span className="text-2xl">{task.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-yellow-500 text-sm">{task.stars} ⭐</div>
                  </div>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-red-400 hover:text-red-600 px-2"
                  >
                    🗑️
                  </button>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Rewards Tab */}
          {tab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {/* Add Reward Form */}
              <Card>
                <div className="font-semibold mb-3">Add New Reward</div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {REWARD_ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewReward({ ...newReward, icon })}
                      className={`text-xl p-1 rounded ${newReward.icon === icon ? 'bg-yellow-100' : ''}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newReward.title}
                  onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                  placeholder="Reward name"
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                />
                <div className="flex gap-2 items-center mb-3">
                  <span className="text-sm text-gray-500">Cost:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newReward.star_cost}
                    onChange={(e) => setNewReward({ ...newReward, star_cost: parseInt(e.target.value) || 1 })}
                    className="w-20 px-2 py-1 border rounded-lg text-center"
                  />
                  <span>⭐</span>
                </div>
                <Button 
                  variant="secondary"
                  className="w-full"
                  disabled={!newReward.title.trim()}
                  onClick={() => {
                    addReward({ ...newReward, is_active: true, description: null })
                    setNewReward({ title: '', star_cost: 5, icon: '🎁' })
                  }}
                >
                  + Add Reward
                </Button>
              </Card>

              {/* Reward List */}
              {rewards.map(reward => (
                <Card key={reward.id} className="flex items-center gap-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{reward.title}</div>
                    <div className="text-purple-500 text-sm">{reward.star_cost} ⭐</div>
                  </div>
                  <button
                    onClick={() => removeReward(reward.id)}
                    className="text-red-400 hover:text-red-600 px-2"
                  >
                    🗑️
                  </button>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Kids Tab */}
          {tab === 'kids' && (
            <motion.div
              key="kids"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {/* Add Child Form */}
              <Card>
                <div className="font-semibold mb-3">Add Child</div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {AVATARS.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`text-2xl p-1 rounded ${selectedAvatar === avatar ? 'bg-purple-100' : ''}`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="Child's name"
                  className="w-full px-3 py-2 border rounded-lg mb-3"
                />
                <Button 
                  className="w-full"
                  disabled={!newChildName.trim()}
                  onClick={() => {
                    addChild(newChildName, selectedAvatar)
                    setNewChildName('')
                  }}
                >
                  + Add Child
                </Button>
              </Card>

              {/* Children List */}
              {children.map(child => (
                <Card key={child.id} className="flex items-center gap-3">
                  <span className="text-3xl">{child.avatar}</span>
                  <div className="flex-1">
                    <div className="font-medium">{child.name}</div>
                    <div className="text-yellow-500 text-sm">{child.stars} ⭐</div>
                  </div>
                  <button
                    onClick={() => removeChild(child.id)}
                    className="text-red-400 hover:text-red-600 px-2"
                  >
                    🗑️
                  </button>
                </Card>
              ))}

              {/* Reset */}
              <div className="pt-8">
                <Button 
                  variant="ghost"
                  className="w-full text-red-500"
                  onClick={() => {
                    if (confirm('Reset everything? This cannot be undone!')) {
                      resetAll()
                    }
                  }}
                >
                  🗑️ Reset All Data
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
