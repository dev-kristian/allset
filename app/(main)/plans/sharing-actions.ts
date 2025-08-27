// File: app/(main)/plans/sharing-actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

type CollaboratorRole = "viewer" | "commenter" | "editor"

interface FormState {
  message?: string
  error?: string
}

async function isOwner(userId: string, planId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("plans")
    .select("author_id")
    .eq("id", planId)
    .single()
  
  if (error || !data) {
    console.error("Error checking plan ownership:", error)
    return false
  }
  return data.author_id === userId
}

async function getProfileByEmail(email: string) {
  const supabaseAdmin = createAdminClient()
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name")
    .eq("email", email)
    .single()
  return profile
}

export async function addCollaborator(
  planId: string,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!(await isOwner(user.id, planId))) {
    return { error: "Only the plan owner can add collaborators." }
  }

  const email = formData.get("email") as string
  const role = formData.get("role") as CollaboratorRole
  const notify = formData.get("notify") === "on"

  if (!email || !role) {
    return { error: "Email and role are required." }
  }
  
  const profileToAdd = await getProfileByEmail(email)
  
  if (!profileToAdd) {
    return { error: `Could not add collaborator. Please check the email address and try again.` }
  }

  if (profileToAdd.id === user.id) {
    return { error: "You cannot add yourself as a collaborator." }
  }

  const { error: upsertError } = await supabase.from("plan_collaborators").upsert({
    plan_id: planId,
    user_id: profileToAdd.id,
    role: role,
  })

  if (upsertError) {
    console.error("Error adding collaborator:", upsertError)
    return { error: "Failed to add collaborator." }
  }

  if (notify) {
    await supabase.from("notifications").insert({
      recipient_id: profileToAdd.id,
      actor_id: user.id,
      type: "PLAN_ACCESS_GRANTED",
      resource_id: planId,
    })
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  return { message: `${profileToAdd.full_name || email} was added as a ${role}.` }
}

export async function updateCollaboratorRole(
  planId: string,
  userIdToUpdate: string,
  newRole: CollaboratorRole
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!(await isOwner(user.id, planId))) {
    return { error: "Only the plan owner can update roles." }
  }

  const { error } = await supabase
    .from("plan_collaborators")
    .update({ role: newRole })
    .eq("plan_id", planId)
    .eq("user_id", userIdToUpdate)

  if (error) {
    console.error("Error updating role:", error)
    return { error: "Failed to update role." }
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  return { message: "Collaborator role updated." }
}

export async function removeCollaborator(planId: string, userIdToRemove: string): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const isRequestingUserOwner = await isOwner(user.id, planId)
  const isSelfRemoval = user.id === userIdToRemove

  if (!isRequestingUserOwner && !isSelfRemoval) {
    return { error: "You do not have permission to remove this collaborator." }
  }

  const { error } = await supabase
    .from("plan_collaborators")
    .delete()
    .eq("plan_id", planId)
    .eq("user_id", userIdToRemove)

  if (error) {
    console.error("Error removing collaborator:", error)
    return { error: "Failed to remove collaborator." }
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  if (isSelfRemoval) {
    return { message: "You have left the plan." }
  }
  return { message: "Collaborator removed." }
}

export async function updatePlanAccessLevel(
  planId: string,
  accessLevel: "restricted" | "public"
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!(await isOwner(user.id, planId))) {
    return { error: "Only the plan owner can change the access level." }
  }

  const { error } = await supabase
    .from("plans")
    .update({ access_level: accessLevel })
    .eq("id", planId)

  if (error) {
    console.error("Error updating plan access level:", error)
    return { error: "Failed to update sharing settings." }
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  revalidatePath(`/${planId}`)
  return { message: `Access level set to "${accessLevel}".` }
}

export async function leavePlan(planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  if (await isOwner(user.id, planId)) {
    throw new Error("Owners cannot leave their own plan. Please delete it instead.")
  }

  const { error } = await supabase
    .from("plan_collaborators")
    .delete()
    .eq("plan_id", planId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error leaving plan:", error)
    throw new Error("Failed to leave the plan.")
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}