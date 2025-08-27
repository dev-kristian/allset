"use client"

// --- CHANGE: Imports updated for useActionState from 'react' ---
import { useEffect, useRef, useActionState } from "react" 
import { useFormStatus } from "react-dom"
import { MessageSquare, Send } from "lucide-react"
import { toast } from "sonner"

import { submitFeedback } from "@/app/(main)/feedback/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const initialState = {
  message: undefined,
  error: undefined,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        "Submitting..."
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Submit Feedback
        </>
      )}
    </Button>
  )
}

interface FeedbackFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackForm({ open, onOpenChange }: FeedbackFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  
  // --- CHANGE: useFormState renamed to useActionState ---
  const [state, formAction] = useActionState(submitFeedback, initialState)

  useEffect(() => {
    if (state.message) {
      toast.success(state.message)
      onOpenChange(false)
      formRef.current?.reset()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Submit Feedback
          </DialogTitle>
          <DialogDescription>
            Have a bug to report or a feature to suggest? We&apos;d love to hear
            from you!
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="type">Feedback Type</Label>
            <Select name="type" required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="suggestion">Feature Suggestion</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Details</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Please provide as much detail as possible..."
              rows={5}
              required
              minLength={10}
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}