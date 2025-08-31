import { Footer } from "@/components/landing/footer"
import { Navbar } from "@/components/landing/navbar"
import { createClient } from "@/lib/supabase/server"

export default async function PrivacyPolicyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: August 31, 2025
              </p>
            </div>

            <div className="prose prose-lg mx-auto max-w-none text-foreground prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              <p>
                Welcome to HandoverPlan (&quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;). Your privacy is critically important to us. This
                Privacy Policy is designed to be as simple and transparent as
                possible, explaining how we handle your information when you use
                our service.
              </p>

              <p>
                <strong>Our Core Privacy Principle:</strong> We collect the
                minimum amount of information necessary to provide our service.
                We do not sell your data to third parties, and we do not use it
                for advertising.
              </p>

              <h2>1. Information We Collect</h2>
              <p>
                We only collect information that is essential for the
                functioning of HandoverPlan:
              </p>
              <ul>
                <li>
                  <strong>Account Information:</strong> When you sign up using
                  an OAuth provider like Google, we receive your name and email
                  address. We use this to create your account, identify you, and
                  allow you to log in. We do not collect your password from
                  these services.
                </li>
                <li>
                  <strong>User-Generated Content:</strong> We store the data you
                  voluntarily provide when creating handover plans. This
                  includes plan titles, dates, tasks, contacts, and collaborator
                  emails. This content is yours, and we only process it to
                  display it back to you and your authorized collaborators.
                </li>
                 <li>
                  <strong>Website Analytics:</strong> We use Vercel Analytics to
                  understand how our website is used and to improve the service.
                  This service collects anonymous usage data, such as the pages
                  you visit and the browser you use. This data is not linked to
                  your personal account information.
                </li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>
                Your information is used strictly to provide and improve the
                Service:
              </p>
              <ul>
                <li>To operate, maintain, and secure our Service.</li>
                <li>To allow you to create, save, and share your plans.</li>
                <li>
                  To enable collaboration features by connecting you with other
                  users you invite.
                </li>
                <li>
                  To analyze anonymous usage data to identify bugs and enhance
                  user experience.
                </li>
              </ul>

              <h2>3. Data Sharing and Third-Party Services</h2>
              <p>
                <strong>We do not sell, rent, or trade your personal information with any third party for marketing purposes.</strong>
              </p>
              <p>
                To provide our Service, we rely on a few essential third-party
                service providers who act as our data processors. We have chosen
                them for their commitment to security and privacy.
              </p>
              <ul>
                <li>
                  <strong>Supabase:</strong> We use Supabase for our database,
                  authentication, and backend infrastructure. All of your
                  account information and plan content is securely stored with
                  Supabase. They do not have the right to use your data for
                  their own purposes.
                </li>
                <li>
                  <strong>Vercel:</strong> We use Vercel to host our application
                  and for privacy-focused analytics.
                </li>
              </ul>
              <p>
                These providers are bound by strict data protection agreements
                and are only permitted to process your data to help us run
                HandoverPlan.
              </p>

              <h2>4. Data Security and Retention</h2>
              <p>
                We take the security of your data seriously and rely on the
                robust, industry-standard security measures of our partners,
                Supabase and Vercel. You retain control over your data. If you
                choose to delete your account, all of your personal information
                and user-generated content will be permanently removed from our
                database.
              </p>

              <h2>5. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your account at
                any time. You can manage your plans directly within the
                application. For account deletion requests, please contact us.
              </p>

              <h2>6. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page. By continuing to use the Service,
                you agree to the revised policy.
              </p>

              <h2>7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at: info@handoverplan.com .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}