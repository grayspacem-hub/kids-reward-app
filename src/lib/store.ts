'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Child, Task, Reward, Completion, Redemption } from '@/types/database'

// Demo data for MVP (no Supabase required initially)
const DEMO_TASKS: Task[] = [
  { id: '1', family_id: '1', title: 'Make your bed', description: 'Pull up the covers and arrange pillows', stars: 1, icon: '🛏️', is_active: true, created_at: '' },
  { id: '2', family_id: '1', title: 'Brush teeth', description: 'Morning and night!', stars: 1, icon: '🦷', is_active: true, created_at: '' },
  { id: '3', family_id: '1', title: 'Clean your room', description: 'Put toys away and tidy up', stars: 3, icon: '🧹', is_active: true, created_at: '' },
  { id: '4', family_id: '1', title: 'Do homework', description: 'Finish all assignments', stars: 5, icon: '📚', is_active: true, created_at: '' },
  { id: '5', family_id: '1', title: 'Help with dishes', description: 'Wash or dry the dishes after dinner', stars: 2, icon: '🍽️', is_active: true, created_at: '' },
  { id: '6', family_id: '1', title: 'Feed the pet', description: 'Give food and fresh water', stars: 2, icon: '🐕', is_active: true, created_at: '' },
  { id: '7', family_id: '1', title: 'Read for 20 minutes', description: 'Any book you like!', stars: 3, icon: '📖', is_active: true, created_at: '' },
  { id: '8', family_id: '1', title: 'Practice instrument', description: '15 minutes of practice', stars: 4, icon: '🎹', is_active: true, created_at: '' },
]

const DEMO_REWARDS: Reward[] = [
  { id: '1', family_id: '1', title: '30 min Screen Time', description: 'Extra tablet or TV time', star_cost: 5, icon: '📱', is_active: true, created_at: '' },
  { id: '2', family_id: '1', title: 'Choose Dinner', description: 'Pick what we have for dinner', star_cost: 10, icon: '🍕', is_active: true, created_at: '' },
  { id: '3', family_id: '1', title: 'Stay Up Late', description: '30 extra minutes before bed', star_cost: 8, icon: '🌙', is_active: true, created_at: '' },
  { id: '4', family_id: '1', title: 'Trip to Park', description: 'A special trip to the playground', star_cost: 15, icon: '🎢', is_active: true, created_at: '' },
  { id: '5', family_id: '1', title: 'Ice Cream', description: 'A tasty ice cream treat', star_cost: 12, icon: '🍦', is_active: true, created_at: '' },
  { id: '6', family_id: '1', title: 'New Toy (Small)', description: 'Pick a small toy or game', star_cost: 50, icon: '🎁', is_active: true, created_at: '' },
]

interface AppState {
  // Family
  familyId: string | null
  familyName: string
  parentPin: string
  isParentMode: boolean
  
  // Children
  children: Child[]
  activeChildId: string | null
  
  // Tasks & Rewards
  tasks: Task[]
  rewards: Reward[]
  completions: Completion[]
  redemptions: Redemption[]
  
  // Setup
  isSetupComplete: boolean
  
  // Actions
  setupFamily: (name: string, pin: string) => void
  addChild: (name: string, avatar: string) => void
  removeChild: (id: string) => void
  setActiveChild: (id: string | null) => void
  
  enterParentMode: (pin: string) => boolean
  exitParentMode: () => void
  
  addTask: (task: Omit<Task, 'id' | 'family_id' | 'created_at'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  
  addReward: (reward: Omit<Reward, 'id' | 'family_id' | 'created_at'>) => void
  updateReward: (id: string, updates: Partial<Reward>) => void
  removeReward: (id: string) => void
  
  completeTask: (taskId: string) => void
  approveCompletion: (completionId: string) => void
  rejectCompletion: (completionId: string) => void
  
  redeemReward: (rewardId: string) => boolean
  
  getActiveChild: () => Child | null
  getPendingCompletions: () => (Completion & { task: Task; child: Child })[]
  
  resetAll: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      familyId: null,
      familyName: '',
      parentPin: '',
      isParentMode: false,
      children: [],
      activeChildId: null,
      tasks: [],
      rewards: [],
      completions: [],
      redemptions: [],
      isSetupComplete: false,

      setupFamily: (name, pin) => set({
        familyId: crypto.randomUUID(),
        familyName: name,
        parentPin: pin,
        tasks: DEMO_TASKS,
        rewards: DEMO_REWARDS,
        isSetupComplete: true,
      }),

      addChild: (name, avatar) => set((state) => ({
        children: [...state.children, {
          id: crypto.randomUUID(),
          family_id: state.familyId!,
          name,
          avatar,
          stars: 0,
          created_at: new Date().toISOString(),
        }],
      })),

      removeChild: (id) => set((state) => ({
        children: state.children.filter(c => c.id !== id),
        activeChildId: state.activeChildId === id ? null : state.activeChildId,
      })),

      setActiveChild: (id) => set({ activeChildId: id, isParentMode: false }),

      enterParentMode: (pin) => {
        if (pin === get().parentPin) {
          set({ isParentMode: true, activeChildId: null })
          return true
        }
        return false
      },

      exitParentMode: () => set({ isParentMode: false }),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: crypto.randomUUID(),
          family_id: state.familyId!,
          created_at: new Date().toISOString(),
        }],
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
      })),

      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id),
      })),

      addReward: (reward) => set((state) => ({
        rewards: [...state.rewards, {
          ...reward,
          id: crypto.randomUUID(),
          family_id: state.familyId!,
          created_at: new Date().toISOString(),
        }],
      })),

      updateReward: (id, updates) => set((state) => ({
        rewards: state.rewards.map(r => r.id === id ? { ...r, ...updates } : r),
      })),

      removeReward: (id) => set((state) => ({
        rewards: state.rewards.filter(r => r.id !== id),
      })),

      completeTask: (taskId) => set((state) => ({
        completions: [...state.completions, {
          id: crypto.randomUUID(),
          task_id: taskId,
          child_id: state.activeChildId!,
          status: 'pending' as const,
          completed_at: new Date().toISOString(),
          approved_at: null,
        }],
      })),

      approveCompletion: (completionId) => set((state) => {
        const completion = state.completions.find(c => c.id === completionId)
        if (!completion) return state
        
        const task = state.tasks.find(t => t.id === completion.task_id)
        if (!task) return state

        return {
          completions: state.completions.map(c => 
            c.id === completionId 
              ? { ...c, status: 'approved' as const, approved_at: new Date().toISOString() }
              : c
          ),
          children: state.children.map(child =>
            child.id === completion.child_id
              ? { ...child, stars: child.stars + task.stars }
              : child
          ),
        }
      }),

      rejectCompletion: (completionId) => set((state) => ({
        completions: state.completions.map(c =>
          c.id === completionId ? { ...c, status: 'rejected' as const } : c
        ),
      })),

      redeemReward: (rewardId) => {
        const state = get()
        const reward = state.rewards.find(r => r.id === rewardId)
        const child = state.children.find(c => c.id === state.activeChildId)
        
        if (!reward || !child || child.stars < reward.star_cost) return false

        set({
          redemptions: [...state.redemptions, {
            id: crypto.randomUUID(),
            reward_id: rewardId,
            child_id: child.id,
            redeemed_at: new Date().toISOString(),
          }],
          children: state.children.map(c =>
            c.id === child.id ? { ...c, stars: c.stars - reward.star_cost } : c
          ),
        })
        return true
      },

      getActiveChild: () => {
        const state = get()
        return state.children.find(c => c.id === state.activeChildId) || null
      },

      getPendingCompletions: () => {
        const state = get()
        return state.completions
          .filter(c => c.status === 'pending')
          .map(c => ({
            ...c,
            task: state.tasks.find(t => t.id === c.task_id)!,
            child: state.children.find(ch => ch.id === c.child_id)!,
          }))
          .filter(c => c.task && c.child)
      },

      resetAll: () => set({
        familyId: null,
        familyName: '',
        parentPin: '',
        isParentMode: false,
        children: [],
        activeChildId: null,
        tasks: [],
        rewards: [],
        completions: [],
        redemptions: [],
        isSetupComplete: false,
      }),
    }),
    {
      name: 'kids-reward-app-storage',
    }
  )
)
