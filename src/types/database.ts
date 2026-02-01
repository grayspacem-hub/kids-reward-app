export type Database = {
  public: {
    Tables: {
      families: {
        Row: {
          id: string
          name: string
          parent_pin: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_pin: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_pin?: string
          created_at?: string
        }
      }
      children: {
        Row: {
          id: string
          family_id: string
          name: string
          avatar: string
          stars: number
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          avatar?: string
          stars?: number
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          avatar?: string
          stars?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          family_id: string
          title: string
          description: string | null
          stars: number
          icon: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          title: string
          description?: string | null
          stars: number
          icon?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          title?: string
          description?: string | null
          stars?: number
          icon?: string
          is_active?: boolean
          created_at?: string
        }
      }
      completions: {
        Row: {
          id: string
          task_id: string
          child_id: string
          status: 'pending' | 'approved' | 'rejected'
          completed_at: string
          approved_at: string | null
        }
        Insert: {
          id?: string
          task_id: string
          child_id: string
          status?: 'pending' | 'approved' | 'rejected'
          completed_at?: string
          approved_at?: string | null
        }
        Update: {
          id?: string
          task_id?: string
          child_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          completed_at?: string
          approved_at?: string | null
        }
      }
      rewards: {
        Row: {
          id: string
          family_id: string
          title: string
          description: string | null
          star_cost: number
          icon: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          title: string
          description?: string | null
          star_cost: number
          icon?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          title?: string
          description?: string | null
          star_cost?: number
          icon?: string
          is_active?: boolean
          created_at?: string
        }
      }
      redemptions: {
        Row: {
          id: string
          reward_id: string
          child_id: string
          redeemed_at: string
        }
        Insert: {
          id?: string
          reward_id: string
          child_id: string
          redeemed_at?: string
        }
        Update: {
          id?: string
          reward_id?: string
          child_id?: string
          redeemed_at?: string
        }
      }
    }
  }
}

export type Family = Database['public']['Tables']['families']['Row']
export type Child = Database['public']['Tables']['children']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Completion = Database['public']['Tables']['completions']['Row']
export type Reward = Database['public']['Tables']['rewards']['Row']
export type Redemption = Database['public']['Tables']['redemptions']['Row']
