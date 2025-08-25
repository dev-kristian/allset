"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

// Helper function to generate unique public link IDs
function generatePublicLinkId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function createPlan(formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Extract form data
  const title = formData.get("title") as string
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const status = formData.get("status") as string
  const itemsJson = formData.get("items") as string
  
  const items = JSON.parse(itemsJson)

  // Generate public link ID if publishing
  let public_link_id = null
  if (status === 'published') {
    public_link_id = generatePublicLinkId()
  }

  // Start a transaction by inserting the plan first
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .insert({
      author_id: user.id,
      title,
      start_date: new Date(start_date).toISOString().split('T')[0],
      end_date: new Date(end_date).toISOString().split('T')[0],
      status,
      public_link_id,
    })
    .select()
    .single()

  if (planError) {
    console.error("Error creating plan:", planError)
    throw new Error("Failed to create plan")
  }

  // Insert plan items if there are any
  if (items.length > 0) {
    const planItems = items.map((item: any) => ({
      plan_id: plan.id,
      type: item.type,
      content: item.content,
      sort_order: item.sort_order,
    }))

    const { error: itemsError } = await supabase
      .from("plan_items")
      .insert(planItems)

    if (itemsError) {
      console.error("Error creating plan items:", itemsError)
      // Consider rolling back the plan creation here
      throw new Error("Failed to create plan items")
    }
  }

  revalidatePath("/dashboard")
  redirect(`/dashboard/plans/${plan.id}`)
}

export async function updatePlan(planId: string, formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Extract form data
  const title = formData.get("title") as string
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const status = formData.get("status") as string
  const itemsJson = formData.get("items") as string
  
  const items = JSON.parse(itemsJson)

  // Generate public link ID if publishing for the first time
  let updateData: any = {
    title,
    start_date: new Date(start_date).toISOString().split('T')[0],
    end_date: new Date(end_date).toISOString().split('T')[0],
    status,
    updated_at: new Date().toISOString(),
  }

  // Check if we need to generate a public link
  if (status === 'published') {
    const { data: existingPlan } = await supabase
      .from("plans")
      .select("public_link_id")
      .eq("id", planId)
      .single()
    
    if (!existingPlan?.public_link_id) {
      updateData.public_link_id = generatePublicLinkId()
    }
  }

  // Update the plan
  const { error: planError } = await supabase
    .from("plans")
    .update(updateData)
    .eq("id", planId)
    .eq("author_id", user.id) // Ensure user owns this plan

  if (planError) {
    console.error("Error updating plan:", planError)
    throw new Error("Failed to update plan")
  }

  // Delete existing items and insert new ones
  await supabase
    .from("plan_items")
    .delete()
    .eq("plan_id", planId)

  if (items.length > 0) {
    const planItems = items.map((item: any) => ({
      plan_id: planId,
      type: item.type,
      content: item.content,
      sort_order: item.sort_order,
    }))

    const { error: itemsError } = await supabase
      .from("plan_items")
      .insert(planItems)

    if (itemsError) {
      console.error("Error updating plan items:", itemsError)
      throw new Error("Failed to update plan items")
    }
  }

  revalidatePath("/dashboard")
  revalidatePath(`/dashboard/plans/${planId}`)
  redirect(`/dashboard/plans/${planId}`)
}

export async function publishPlan(planId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Check if already has a public link
  const { data: existingPlan } = await supabase
    .from("plans")
    .select("public_link_id, status")
    .eq("id", planId)
    .single()

  // If already published, just redirect
  if (existingPlan?.status === 'published' && existingPlan?.public_link_id) {
    revalidatePath(`/dashboard/plans/${planId}`)
    return
  }

  const public_link_id = generatePublicLinkId()

  const { error } = await supabase
    .from("plans")
    .update({ 
      status: 'published',
      public_link_id,
      updated_at: new Date().toISOString()
    })
    .eq("id", planId)
    .eq("author_id", user.id)

  if (error) {
    console.error("Error publishing plan:", error)
    throw new Error("Failed to publish plan")
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  revalidatePath('/dashboard')
}

export async function deletePlan(planId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("plans")
    .delete()
    .eq("id", planId)
    .eq("author_id", user.id)

  if (error) {
    console.error("Error deleting plan:", error)
    throw new Error("Failed to delete plan")
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}