"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

interface FormState {
  message?: string
  error?: string
}

export async function createComment(
  planId: string,
  formData: FormData
): Promise<FormState> {
  const content = formData.get("content") as string
  if (!content || content.trim().length < 1) {
    return { error: "Comment cannot be empty." }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to comment." }
  }

  const { error } = await supabase.from("comments").insert({
    plan_id: planId,
    content: content.trim(),
    author_id: user.id,
  })

  if (error) {
    console.error("Error creating comment:", error)
    return { error: "Failed to post comment. You may not have permission." }
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  return { message: "Comment posted." }
}