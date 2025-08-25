"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${error.message}`)
  }

  revalidatePath("/", "layout")
  return redirect("/dashboard")
}

export async function signInWithOAuth(provider: "google" | "apple") {
  const origin = (await headers()).get("origin")
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/callback`,
    },
  })

  if (error) {
    return redirect(`/login?error=${error.message}`)
  }

  if (data.url) {
    return redirect(data.url)
  }

  return redirect("/login?error=Could not authenticate with provider")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  return redirect("/")
}