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