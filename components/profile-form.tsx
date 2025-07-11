"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Edit, Save, X, Upload, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: {
    id: string
    email: string
    name: string
    role: string
    image?: string
  }
  dbUser: {
    bio?: string | null
    skills: string[]
    interests: string[]
  }
}

export function ProfileForm({ user, dbUser }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(!user.name || user.name.trim() === "")
  const [isLoading, setIsLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user: clerkUser } = useUser()

  // Parse name into first and last name
  const nameParts = user.name ? user.name.split(" ") : ["", ""]
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName,
      lastName,
      bio: dbUser.bio || "",
      skills: dbUser.skills.join(", "),
      interests: dbUser.interests.join(", "),
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      // Update Clerk user
      const fullName = `${data.firstName} ${data.lastName}`.trim()

      if (clerkUser) {
        await clerkUser.update({
          firstName: data.firstName,
          lastName: data.lastName,
        })
      }

      // Update database
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          bio: data.bio,
          skills: data.skills
            ? data.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          interests: data.interests
            ? data.interests
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        }),
      })

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
        setIsEditing(false)
        router.refresh()
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !clerkUser) return

    setImageUploading(true)
    try {
      await clerkUser.setProfileImage({ file })
      toast({
        title: "Profile Image Updated",
        description: "Your profile image has been updated successfully.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setImageUploading(false)
    }
  }

  const needsProfileCompletion = !user.name || user.name.trim() === ""

  return (
    <div className="space-y-6">
      {needsProfileCompletion && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            Please complete your profile by adding your name and other details.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "User"} />
                <AvatarFallback className="text-xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {imageUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-1" />
                    Change Photo
                  </span>
                </Button>
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageUploading}
              />
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 10MB.</p>
            </div>
          </div>

          <Separator />

          {isEditing ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" {...form.register("firstName")} placeholder="Enter your first name" />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" {...form.register("lastName")} placeholder="Enter your last name" />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" {...form.register("bio")} placeholder="Tell us about yourself..." rows={4} />
                <p className="text-xs text-muted-foreground">{form.watch("bio")?.length || 0}/500 characters</p>
                {form.formState.errors.bio && (
                  <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  {...form.register("skills")}
                  placeholder="e.g., JavaScript, Python, Design, Marketing"
                />
                <p className="text-xs text-muted-foreground">Separate skills with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests</Label>
                <Input
                  id="interests"
                  {...form.register("interests")}
                  placeholder="e.g., Technology, Sports, Music, Art"
                />
                <p className="text-xs text-muted-foreground">Separate interests with commas</p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    form.reset()
                  }}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                  <p className="text-sm font-medium">{firstName || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                  <p className="text-sm font-medium">{lastName || "Not provided"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                <p className="text-sm">{dbUser.bio || "No bio provided yet. Click edit to add one!"}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Skills</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dbUser.skills.length > 0 ? (
                    dbUser.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills added yet</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Interests</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dbUser.interests.length > 0 ? (
                    dbUser.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No interests added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{user.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Role</Label>
              <div className="flex items-center gap-2">
                <Badge variant="default">{user.role}</Badge>
                {user.role === "STUDENT" && (
                  <Button variant="link" size="sm" className="h-auto p-0" asChild>
                    <a href="/settings">Request role upgrade</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
