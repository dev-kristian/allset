import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Cta() {
  return (
    <section id="cta" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="rounded-lg border bg-background p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready for a Stress-Free Handover?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Stop worrying about leaving work behind. Create your first handover
            plan today and ensure your team is all set for success.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg">Get Started for Free</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}