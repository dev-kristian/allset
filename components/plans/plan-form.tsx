"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2, GripVertical } from "lucide-react"

import { createPlan, updatePlan } from "@/app/(main)/plans/actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  status: string
  link?: string
  priority: string
  notes?: string
}

interface Contact {
  id: string
  name: string
  role: string
  email?: string
  phone?: string
  notes?: string
}

interface PlanFormProps {
  plan?: {
    id: string
    title: string
    start_date: string
    end_date: string
    status: string
    items?: Array<{
      type: string
      content: Task | Contact
      sort_order: number
    }>
  }
}

export function PlanForm({ plan }: PlanFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize form state
  const [title, setTitle] = useState(plan?.title || "")
  const [startDate, setStartDate] = useState<Date | undefined>(
    plan?.start_date ? new Date(plan.start_date) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    plan?.end_date ? new Date(plan.end_date) : undefined
  )

  // Initialize tasks and contacts from plan items if editing
  const initialTasks: Task[] =
    plan?.items
      ?.filter((item): item is { type: 'task'; content: Task, sort_order: number } => item.type === 'task')
      .map(item => ({
        id: crypto.randomUUID(),
        title: item.content.title || '',
        status: item.content.status || 'pending',
        link: item.content.link || '',
        priority: item.content.priority || 'medium',
        notes: item.content.notes || '',
      })) || []

  const initialContacts: Contact[] =
    plan?.items
      ?.filter((item): item is { type: 'contact'; content: Contact, sort_order: number } => item.type === 'contact')
      .map(item => ({
        id: crypto.randomUUID(),
        name: item.content.name || '',
        role: item.content.role || '',
        email: item.content.email || '',
        phone: item.content.phone || '',
        notes: item.content.notes || '',
      })) || []

  const [tasks, setTasks] = useState<Task[]>(
    initialTasks.length > 0 ? initialTasks : [
      { id: crypto.randomUUID(), title: "", status: "pending", priority: "medium" }
    ]
  )

  const [contacts, setContacts] = useState<Contact[]>(
    initialContacts.length > 0 ? initialContacts : [
      { id: crypto.randomUUID(), name: "", role: "" }
    ]
  )

  // Task management functions
  const addTask = () => {
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), title: "", status: "pending", priority: "medium" }
    ])
  }

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id))
    }
  }

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ))
  }

  // Contact management functions
  const addContact = () => {
    setContacts([
      ...contacts,
      { id: crypto.randomUUID(), name: "", role: "" }
    ])
  }

  const removeContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(contact => contact.id !== id))
    }
  }

  const updateContact = (id: string, field: keyof Contact, value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ))
  }

  // Form submission
  const handleSubmit = async (action: 'draft' | 'publish') => {
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('start_date', startDate?.toISOString() || '')
      formData.append('end_date', endDate?.toISOString() || '')
      formData.append('status', action === 'publish' ? 'published' : 'draft')
      
      // Add tasks as JSON
      const taskItems = tasks
        .filter(task => task.title) // Only include tasks with titles
        .map((task, index) => ({
          type: 'task',
          content: task,
          sort_order: index
        }))
      
      // Add contacts as JSON
      const contactItems = contacts
        .filter(contact => contact.name) // Only include contacts with names
        .map((contact, index) => ({
          type: 'contact',
          content: contact,
          sort_order: taskItems.length + index
        }))
      
      formData.append('items', JSON.stringify([...taskItems, ...contactItems]))
      
      if (plan?.id) {
        await updatePlan(plan.id, formData)
      } else {
        await createPlan(formData)
      }
      
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error saving plan:', error)
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Information</CardTitle>
          <CardDescription>
            Set up the basic details for your handover plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Plan Title</Label>
            <Input
              id="title"
              placeholder="Q1 2024 Handover Plan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks/Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks & Projects</CardTitle>
          <CardDescription>
            List all tasks and projects that need attention during your absence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Task {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTask(task.id)}
                  disabled={tasks.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Project Alpha Migration"
                    value={task.title}
                    onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={task.status}
                    onValueChange={(value) => updateTask(task.id, 'status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={task.priority}
                    onValueChange={(value) => updateTask(task.id, 'priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Link/Reference</Label>
                  <Input
                    placeholder="https://..."
                    value={task.link || ""}
                    onChange={(e) => updateTask(task.id, 'link', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional details..."
                  value={task.notes || ""}
                  onChange={(e) => updateTask(task.id, 'notes', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addTask}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </CardContent>
      </Card>

      {/* Contacts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Important Contacts</CardTitle>
          <CardDescription>
            People who should be contacted for specific issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={contact.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Contact {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContact(contact.id)}
                  disabled={contacts.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={contact.name}
                    onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Role/Department</Label>
                  <Input
                    placeholder="Engineering Lead"
                    value={contact.role}
                    onChange={(e) => updateContact(contact.id, 'role', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={contact.email || ""}
                    onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={contact.phone || ""}
                    onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Best for questions about..."
                  value={contact.notes || ""}
                  onChange={(e) => updateContact(contact.id, 'notes', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addContact}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleSubmit('draft')}
          disabled={isSubmitting || !title || !startDate || !endDate}
        >
          {isSubmitting ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit('publish')}
          disabled={isSubmitting || !title || !startDate || !endDate}
        >
          {isSubmitting ? "Publishing..." : "Publish Plan"}
        </Button>
      </div>
    </div>
  )
}