export interface Task {
  title: string
  notes?: string
  status: string
  priority: string
  link?: string
}

export interface Contact {
  name: string
  role?: string
  email?: string
  phone?: string
  notes?: string
}

export interface PlanItem {
  id: string
  type: "task" | "contact"
  content: Task | Contact
  sort_order: number
}
export interface PlanWithProfiles {
  id: string
  title: string
  start_date: string
  end_date: string
  status: string
  public_link_id: string
  created_at: string
  updated_at: string
  plan_items?: PlanItem[]
  profiles: { full_name: string }[] | null
}

export interface Collaborator {
  user_id: string
  role: 'viewer' | 'commenter' | 'editor'
  profile: {
    full_name: string | null
    avatar_url: string | null
    email: string | null
  } | null
}