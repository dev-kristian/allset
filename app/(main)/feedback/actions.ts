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

  // 1. Authenticate the user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to submit feedback." }
  }

  // 2. Extract and validate form data
  const content = formData.get("content") as string
  const type = formData.get("type") as string

  if (!content || content.trim().length < 10) {
    return { error: "Feedback must be at least 10 characters long." }
  }

  if (!type) {
    return { error: "Please select a feedback type." }
  }

  // 3. Insert data into the database
  const { error } = await supabase.from("feedback").insert({
    user_id: user.id,
    content: content.trim(),
    type,
  })

  if (error) {
    console.error("Error submitting feedback:", error)
    return { error: "Failed to submit feedback. Please try again." }
  }

  // 4. Return success message
  return { message: "Thank you! Your feedback has been submitted." }
}