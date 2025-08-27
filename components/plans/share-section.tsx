// File: components/plans/share-section.tsx

"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import {
  Copy,
  Globe,
  Link as LinkIcon,
  Loader2,
  Lock,
  Plus,
  Send,
  User,
  X,
} from "lucide-react"

import {
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
  updatePlanAccessLevel,
} from "@/app/(main)/plans/sharing-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Collaborator } from "@/lib/types"

interface ShareDialogProps {
  planId: string
  planTitle: string
  publicUrl: string | null
  accessLevel: "restricted" | "public"
  collaborators: Collaborator[]
  currentUserId: string
  owner: {
    id: string
    name: string | null
    email: string | null
    avatar: string | null
  }
}

const initialState = { message: "", error: "" }

export function ShareDialog({
  planId,
  planTitle,
  publicUrl,
  accessLevel,
  collaborators,
  currentUserId,
  owner,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const addCollaboratorFormRef = useRef<HTMLFormElement>(null)
  const isCurrentUserOwner = currentUserId === owner.id

  const [addState, addCollaboratorAction, isAddPending] = useActionState(
    addCollaborator.bind(null, planId),
    initialState
  )

  useEffect(() => {
    if (addState.message) {
      toast.success(addState.message)
      addCollaboratorFormRef.current?.reset()
    }
    if (addState.error) toast.error(addState.error)
  }, [addState])

  const handleCopy = () => {
    if (!publicUrl) return
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleAccessLevelChange = (value: "restricted" | "public") => {
    toast.promise(updatePlanAccessLevel(planId, value), {
        loading: "Updating access level...",
        success: (res) => res.message || "Access level updated!",
        error: (err) => (err as Error).message || "Failed to update.",
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share "{planTitle}"</DialogTitle>
          <DialogDescription>
            Manage collaborators or change the general access level.
          </DialogDescription>
        </DialogHeader>

        {isCurrentUserOwner && (
          <div className="space-y-2 pt-2">
            <Label>Add people and groups</Label>
            <form
              ref={addCollaboratorFormRef}
              action={addCollaboratorAction}
              className="flex items-center gap-2"
            >
              <Input name="email" type="email" placeholder="Enter email address" required />
              <Select name="role" defaultValue="viewer" required>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="commenter">Commenter</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" size="icon" disabled={isAddPending}>
                {isAddPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-medium">People with access</h3>
          <div className="max-h-48 space-y-3 overflow-y-auto">
            <CollaboratorRow
              avatar={owner.avatar}
              name={owner.name}
              email={owner.email}
              role="Owner"
            />
            {collaborators.map((c) => (
              <CollaboratorRow
                key={c.user_id}
                planId={planId}
                userId={c.user_id}
                avatar={c.profile?.avatar_url}
                name={c.profile?.full_name}
                email={c.profile?.email}
                role={c.role}
                canManage={isCurrentUserOwner}
              />
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className={`rounded-full border p-2 ${accessLevel === "public" ? "bg-blue-100 dark:bg-blue-900" : "bg-muted"}`}>
              {accessLevel === "public" ? <Globe className="h-6 w-6 text-blue-600 dark:text-blue-300" /> : <Lock className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="flex-1">
              <Label className="font-semibold">General access</Label>
              <Select 
                value={accessLevel} 
                onValueChange={handleAccessLevelChange}
                disabled={!isCurrentUserOwner}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="public">Anyone with the link</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                {accessLevel === "public" ? "Anyone on the internet with the link can view." : "Only people with access can open with the link."}
                {!isCurrentUserOwner && " Only the owner can change this."}
              </p>
            </div>
          </div>
          
          {publicUrl && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={copied}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CollaboratorRow({
  planId,
  userId,
  avatar,
  name,
  email,
  role,
  canManage,
}: {
  planId?: string
  userId?: string
  avatar: string | null | undefined
  name: string | null | undefined
  email: string | null | undefined
  role: string
  canManage?: boolean
}) {
  const [isRemoving, setIsRemoving] = useState(false)
  const isOwner = role === "Owner"

  const handleRoleChange = (newRole: "viewer" | "commenter" | "editor") => {
    if (!planId || !userId) return
    toast.promise(updateCollaboratorRole(planId, userId, newRole), {
      loading: "Updating role...",
      success: (res) => res.message || "Role updated!",
      error: (err) => (err as Error).message || "Failed to update role.",
    })
  }

  const handleRemove = async () => {
    if (!planId || !userId) return
    setIsRemoving(true)
    const result = await removeCollaborator(planId, userId)
    if (result.error) toast.error(result.error)
    if (result.message) toast.success(result.message)
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar ?? ""} alt={name ?? ""} />
        <AvatarFallback>{name?.[0] ?? email?.[0] ?? "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium">{name ?? email}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
      {isOwner ? (
        <span className="text-sm text-muted-foreground">Owner</span>
      ) : canManage ? (
        <div className="flex items-center gap-2">
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[120px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="commenter">Commenter</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemove} disabled={isRemoving}>
            {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground capitalize">{role}</span>
      )}
    </div>
  )
}