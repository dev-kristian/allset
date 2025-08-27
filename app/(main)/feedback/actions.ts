"use server"

import { createClient } from "@/lib/supabase/server"

interface FormState {
  message?: string
  error?: string
}

export async function submitFeedback(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to submit feedback." }
  }

  const content = formData.get("content") as string
  const type = formData.get("type") as string

  if (!content || content.trim().length < 10) {
    return { error: "Feedback must be at least 10 characters long." }
  }

  if (!type) {
    return { error: "Please select a feedback type." }
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: user.id,
    content: content.trim(),
    type,
  })

  if (error) {
    console.error("Error submitting feedback:", error)
    return { error: "Failed to submit feedback. Please try again." }
  }

  return { message: "Thank you! Your feedback has been submitted." }
}