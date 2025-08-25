"use client"

import { useState } from "react"
import { Share2, Copy, Check, Mail, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShareSectionProps {
  publicUrl: string
}

export function ShareSection({ publicUrl }: ShareSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const emailSubject = encodeURIComponent("Handover Plan")
  const emailBody = encodeURIComponent(
    `I've shared my handover plan with you. You can view it here:\n\n${publicUrl}\n\nThis plan contains all the necessary information for my absence period.`
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this plan</DialogTitle>
          <DialogDescription>
            Anyone with this link can view your published handover plan.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Copy Link</TabsTrigger>
            <TabsTrigger value="share">Share Via</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue={publicUrl}
                  readOnly
                  className="text-sm"
                />
              </div>
              <Button 
                type="button" 
                size="sm" 
                className="px-3"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This link will remain active as long as the plan is published.
            </p>
          </TabsContent>
          
          <TabsContent value="share" className="space-y-3">
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start"
                asChild
              >
                <a
                  href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Share via Email
                </a>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start"
                asChild
              >
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my handover plan: ${publicUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Share via WhatsApp
                </a>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start"
                asChild
              >
                <a
                  href={`https://teams.microsoft.com/share?href=${encodeURIComponent(publicUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Share via Teams
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}