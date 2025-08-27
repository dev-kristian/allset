import { cn } from "@/lib/utils"

/**
 * A reusable component for the app logo.
 * It uses a standard <img> tag, perfect for SVGs.
 * @param {string} className
 */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="HandoverPlan Logo"
      className={cn(className)}
      loading="eager"
      width="32" 
      height="32"
    />
  )
}