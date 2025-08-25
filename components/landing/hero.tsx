import Image from "next/image"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ButtonConfig {
  text: string
  url: string
  icon?: React.ReactNode
}

interface HeroProps {
  badge?: string
  heading: string
  description: string
  buttons?: {
    primary?: ButtonConfig
    secondary?: ButtonConfig
  }
  image: {
    src: string
    alt: string
  }
}

const Hero = ({
  badge = "Now in Public Beta ✨",
  heading = "Ensure a Seamless Handover, Every Time.",
  description = "HandoverPlan helps you create clear, comprehensive, and shareable handover plans, so you can take time off with peace of mind and your team can stay productive.",
  buttons = {
    primary: {
      text: "Create Your First Plan",
      url: "/login",
    },
    secondary: {
      text: "Learn More",
      url: "#features",
      icon: <ArrowRight className="ml-2 size-4" />,
    },
  },
  image = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "Screenshot of the HandoverPlan application dashboard.",
  },
}: HeroProps) => {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <a href="#features" className="group">
                <Badge variant="outline">
                  {badge}
                  <ArrowUpRight className="ml-2 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Badge>
              </a>
            )}
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {heading}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url} className="inline-flex items-center">
                    {buttons.primary.text}
                    {buttons.primary.icon}
                  </a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url} className="inline-flex items-center">
                    {buttons.secondary.text}
                    {buttons.secondary.icon}
                  </a>
                </Button>
              )}
            </div>
          </div>
          <Image
            src={image.src}
            alt={image.alt}
            width={1024}
            height={576}
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export { Hero }