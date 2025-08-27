// File: app/[publicLinkId]/not-found.tsx

import Link from "next/link"
import { ArrowLeft, LogIn, LayoutDashboard } from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function PublicNotFound() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-8" />
            <span className="text-lg font-bold">HandoverPlan</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Plan Not Found</h1>
            <p className="text-muted-foreground max-w-md">
              This handover plan doesn&apos;t exist, is no longer available, or you don&apos;t have permission to view it.
            </p>
          </div>
          
          <div className="flex gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </Button>
                </Link>
                <Link href="/login">
                  <Button>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 max-w-md">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> If you&apos;re expecting to see a plan here, please double-check the link or contact the person who shared it with you to ensure you have been granted access.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}