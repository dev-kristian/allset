import { Cta } from "@/components/landing/cta"
import { Faq } from "@/components/landing/faq"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"
import { Hero } from "@/components/landing/hero"
import { Navbar } from "@/components/landing/navbar"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <Hero
          badge="Now in Public Beta ✨"
          heading="Ensure a Seamless Handover, Every Time."
          description="HandoverPlan helps you create clear, comprehensive, and shareable handover plans, so you can take time off with peace of mind and your team can stay productive."
          buttons={{
            primary: {
              text: "Create Your First Plan",
              url: "/login",
            },
            secondary: {
              text: "Learn More",
              url: "#features",
            },
          }}
          image={{
            src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
            alt: "Screenshot of the HandoverPlan application dashboard showing handover plans.",
          }}
        />
        <Features />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}