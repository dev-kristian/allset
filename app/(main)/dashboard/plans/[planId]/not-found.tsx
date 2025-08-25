import Link from "next/link"
import { FileX } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <FileX className="h-16 w-16 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Plan not found</h2>
        <p className="text-muted-foreground mt-2">
          The plan you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Link href="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  )
}