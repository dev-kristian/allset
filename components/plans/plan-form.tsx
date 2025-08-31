"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"

import { createPlan, updatePlan } from "@/app/(main)/plans/actions"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Calendar } from "@/components/ui/calendar"
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

// Interfaces remain the same as they define the data structure
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
  isOwner?: boolean
}

export function PlanForm({ plan, isOwner = true }: PlanFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useIsMobile()
  
  const [title, setTitle] = useState(plan?.title || "")
  const [date, setDate] = useState<DateRange | undefined>({
    from: plan?.start_date ? new Date(plan.start_date) : undefined,
    to: plan?.end_date ? new Date(plan.end_date) : undefined,
  })

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

  const addTask = () => setTasks([...tasks, { id: crypto.randomUUID(), title: "", status: "pending", priority: "medium" }])
  const removeTask = (id: string) => tasks.length > 1 && setTasks(tasks.filter(task => task.id !== id))
  const updateTask = (id: string, field: keyof Task, value: string) => setTasks(tasks.map(task => task.id === id ? { ...task, [field]: value } : task))

  const addContact = () => setContacts([...contacts, { id: crypto.randomUUID(), name: "", role: "" }])
  const removeContact = (id: string) => contacts.length > 1 && setContacts(contacts.filter(contact => contact.id !== id))
  const updateContact = (id: string, field: keyof Contact, value: string) => setContacts(contacts.map(contact => contact.id === id ? { ...contact, [field]: value } : contact))

  const handleSubmit = async (action: 'draft' | 'publish') => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('start_date', date?.from?.toISOString() || '')
      formData.append('end_date', date?.to?.toISOString() || '')
      formData.append('status', action === 'publish' ? 'published' : 'draft')
      
      const taskItems = tasks.filter(task => task.title).map((task, index) => ({ type: 'task', content: task, sort_order: index }))
      const contactItems = contacts.filter(contact => contact.name).map((contact, index) => ({ type: 'contact', content: contact, sort_order: taskItems.length + index }))
      
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
      // TODO: Show an error toast to the user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative">
      <div className="space-y-4 sm:space-y-8 pb-20 sm:pb-28">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b p-3 sm:p-6">
            <h2 className="text-lg font-semibold leading-none tracking-tight">Plan Details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Basic information about your handover plan</p>
          </div>
          <div className="p-3 sm:p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="title" className="font-medium">
                  Plan Title <span className="text-destructive">*</span>
                </Label>
              </div>
              <Input
                id="title"
                placeholder="e.g., Q3 Marketing Campaign Handover"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">A clear and descriptive title for the plan.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="font-medium">
                  Coverage Period <span className="text-destructive">*</span>
                </Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal py-4 sm:py-6 text-base",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span className="text-muted-foreground">Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                The start and end date for the handover coverage.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold leading-none tracking-tight">Tasks & Projects</h2>
                  <p className="mt-1 text-sm text-muted-foreground">List all ongoing tasks and projects that require attention.</p>
                </div>
                <Button type="button" variant="outline" onClick={addTask} className="gap-2 w-full sm:w-auto hidden sm:flex">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>
            <div className="p-3 sm:p-6 space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <div key={task.id} className="rounded-lg border bg-card p-3 sm:p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                        <h3 className="font-medium">Task</h3>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} disabled={tasks.length === 1}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Task</span>
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          placeholder="Project Alpha Migration"
                          value={task.title}
                          onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                          className="text-base"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="space-y-2 sm:col-span-1">
                          <Label>Status</Label>
                          <Select
                            value={task.status}
                            onValueChange={(value) =>
                              updateTask(task.id, "status", value)
                            }
                          >
                            <SelectTrigger className="w-full truncate-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <Label>Priority</Label>
                          <Select
                            value={task.priority}
                            onValueChange={(value) =>
                              updateTask(task.id, "priority", value)
                            }
                          >
                            <SelectTrigger className="w-full truncate-select">
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
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Link/Reference (Optional)</Label>
                          <Input
                            placeholder="https://..."
                            value={task.link || ""}
                            onChange={(e) =>
                              updateTask(task.id, "link", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          placeholder="Additional details..."
                          value={task.notes || ""}
                          onChange={(e) => updateTask(task.id, 'notes', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No tasks added yet</p>
                </div>
              )}
            </div>
            <div className="p-3 sm:p-6 sm:hidden">
              <Button type="button" variant="outline" onClick={addTask} className="gap-2 w-full">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold leading-none tracking-tight">Important Contacts</h2>
                  <p className="mt-1 text-sm text-muted-foreground">List key people who can be contacted for specific issues.</p>
                </div>
                <Button type="button" variant="outline" onClick={addContact} className="gap-2 w-full sm:w-auto hidden sm:flex">
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              </div>
            </div>
            <div className="p-3 sm:p-6 space-y-4">
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <div key={contact.id} className="rounded-lg border bg-card p-3 sm:p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                        <h3 className="font-medium">Contact</h3>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeContact(contact.id)} disabled={contacts.length === 1}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Contact</span>
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            placeholder="John Doe"
                            value={contact.name}
                            onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                            className="text-base"
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
                          <Label>Email (Optional)</Label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            value={contact.email || ""}
                            onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone (Optional)</Label>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            value={contact.phone || ""}
                            onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          placeholder="Best for questions about..."
                          value={contact.notes || ""}
                          onChange={(e) => updateContact(contact.id, 'notes', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No contacts added yet</p>
                </div>
              )}
            </div>
            <div className="p-3 sm:p-6 sm:hidden">
              <Button type="button" variant="outline" onClick={addContact} className="gap-2 w-full">
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t bg-background/95 backdrop-blur py-2 sm:py-4 mt-2">
        <div className="mx-auto flex w-full  flex-col sm:flex-row items-center justify-end gap-2 px-3">
          {!isMobile && (
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="w-full sm:w-auto">
              Cancel
            </Button>
          )}
          {isOwner && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting || !title || !date?.from || !date?.to}
              className="w-full sm:w-auto px-4 sm:px-6"
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </Button>
          )}
          <Button
            type="button"
            onClick={() => handleSubmit('publish')}
            disabled={isSubmitting || !title || !date?.from || !date?.to}
            className="w-full sm:w-auto px-4 sm:px-6"
          >
            {isSubmitting ? "Publishing..." : (plan?.id ? "Publish Changes" : "Publish Plan")}
          </Button>
        </div>
      </div>
    </form>
  )
}