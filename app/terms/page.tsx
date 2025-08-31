import { Footer } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function TermsOfServicePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-lg px-4 py-16 sm:py-24">
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: August 31, 2025
              </p>
            </div>

            <div className="prose prose-lg mx-auto max-w-none text-foreground prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              <p>
                Please read these Terms of Service (&quot;Terms&quot;)
                carefully before using the HandoverPlan website and services
                (the &quot;Service&quot;) operated by HandoverPlan (&quot;us&quot;,
                &quot;we&quot;, or &quot;our&quot;). Your access to and use
                of the Service is conditioned on your acceptance of and
                compliance with these Terms.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Service, you agree to be bound by
                these Terms. If you disagree with any part of the terms, then
                you may not access the Service.
              </p>

              <h2>2. Accounts</h2>
              <p>
                To use our Service, you must create an account. You are
                responsible for all activities that occur under your account
                and for keeping your login credentials secure. You must notify
                us immediately of any unauthorized use of your account.
              </p>

              <h2>3. User Content</h2>
              <p>
                You own all of the content and information you post on the
                Service (&quot;User Content&quot;). You are solely responsible
                for your User Content, including its legality, reliability, and
                appropriateness. By using the Service, you grant us a limited
                license to host, store, and display your User Content solely for
                the purpose of providing and improving the Service. We will not
                view, access, or use your User Content for any other purpose
                without your explicit permission.
              </p>

              <h2>4. Acceptable Use</h2>
              <p>
                You agree not to use the Service for any unlawful purpose or to
                engage in any conduct that is harmful, fraudulent, or
                infringing on the rights of others. You may not interfere with
                the normal operation of the Service.
              </p>

              <h2>5. Third-Party Services</h2>
              <p>
                Our Service is built using third-party infrastructure providers
                such as Supabase (for database and authentication) and Vercel
                (for hosting). Your use of our Service constitutes your
                agreement to the acceptable use policies of these providers. For
                more information on how we use these services, please see our{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>

              <h2>6. Termination</h2>
              <p>
                We may terminate or suspend your account at our discretion,
                without prior notice, for conduct that violates these Terms or
                is otherwise harmful to other users or the Service. You can
                terminate your account at any time by contacting us.
              </p>

              <h2>7. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS
                AVAILABLE&quot; basis. We make no warranties, express or
                implied, that the Service will be uninterrupted, error-free, or
                completely secure.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, in no event will
                HandoverPlan be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or in
                connection with your use of the Service.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will
                notify you of any changes by posting the new Terms on this page.
                By continuing to use the Service after changes are made, you
                agree to be bound by the revised terms.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at: info@handoverplan.com .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}