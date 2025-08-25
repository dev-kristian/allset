import { cn } from "@/lib/utils"

/**
 * A reusable component for the app logo.
 * It uses a standard <img> tag, perfect for SVGs.
 * Assumes `logo.svg` is in the `public` folder.
 * @param {string} className - Classes to control the size of the logo.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="HandoverPlan Logo"
      className={cn(className)}
      // Eager loading is often best for a logo in the main viewport
      loading="eager"
      // Provide dimensions to prevent layout shift, even if CSS overrides them
      width="32" 
      height="32"
    />
  )
}