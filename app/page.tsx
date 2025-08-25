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
          heading="Welcome to Allset"
          description="Allset is a comprehensive platform designed to streamline your workflow and boost productivity."
          image={{
            src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
            alt: "Allset landing page image",
          }}
        />
      </main>
      <Footer />
    </div>
  )
}