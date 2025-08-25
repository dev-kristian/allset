import Link from "next/link"
import { FileX, Home, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd } from "lucide-react"

export default function PublicNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-lg font-bold">HandoverPlan</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="rounded-full bg-muted p-6">
            <FileX className="h-16 w-16 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Plan Not Found</h1>
            <p className="text-muted-foreground max-w-md">
              This handover plan doesn&apos;t exist or is no longer available. 
              It may have been removed or the link might be incorrect.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
            <Link href="/login">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 max-w-md">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> If you&apos;re expecting to see a plan here, 
              please double-check the link or contact the person who shared it with you.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}