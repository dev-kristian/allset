import { Suspense } from "react"
import Link from "next/link"

import { Logo } from "@/components/logo"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo className="size-6" />
          HandoverPlan
        </Link>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}