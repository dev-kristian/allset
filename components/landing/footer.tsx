import Link from "next/link"
import { Logo } from "@/components/logo"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Logo and description */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="size-8" />
              <span className="text-lg font-bold">HandoverPlan</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Create and share clear handover plans to ensure smooth transitions
              while you&apos;re away.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-start-4">
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-3 text-sm">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 HandoverPlan. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}