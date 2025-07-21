"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUpload } from "@/components/image-upload"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit, Save, X, Upload, User, Info, AlertCircle } from "lucide-react";

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  skills: z.string().max(200, "Skills must be less than 200 characters").optional(),
  interests: z.string().max(200, "Interests must be less than 200 characters").optional(),
  avatar: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    role: string;
  };
  dbUser: {
    id: string;
    email: string;
    name: string | null;
    bio: string | null;
    skills: string | null;
    avatar: string | null;
    interests: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function ProfileForm({ user, dbUser }: ProfileFormProps) {
  const { user: clerkUser } = useUser();
  const [isEditing, setIsEditing] = useState(!user.firstName || !user.lastName);
  const [isPending, startTransition] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState(dbUser.avatar || user.avatar || "")


  const isProfileIncomplete = !user.firstName || !user.lastName;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      bio: dbUser.bio || "",
      skills: dbUser.skills || "",
      interests: dbUser.interests || "",
      avatar: avatarUrl,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    startTransition(async () => {
      try {
        // Update Clerk user
        if (clerkUser) {
          await clerkUser.update({
            firstName: data.firstName,
            lastName: data.lastName,
          });

          // Update Clerk profile image if changed
            if (avatarUrl && avatarUrl !== user.avatar) {
              await clerkUser.setProfileImage({ file: avatarUrl })
            }
        }



        // Update database
        const response = await fetch("/api/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            bio: data.bio,
            skills: data.skills || null,
            interests: data.interests || null,
            avatar: avatarUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        toast.success("Profile updated successfully!");
        setIsEditing(false);

        // Refresh the page to show updated data
        window.location.reload();
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    });
  };

  // const handleImageUpload = () => {
  //   if (clerkUser) {
  //     // This will open Clerk's image upload modal
  //     clerkUser.setProfileImage({ file: null });
  //   }
  // };

  const bioLength = form.watch("bio")?.length || 0;
  const skillsLength = form.watch("skills")?.length || 0;
  const interestsLength = form.watch("interests")?.length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          {!isProfileIncomplete && (
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => {
                if (isEditing) {
                  form.reset();
                  setAvatarUrl(dbUser.avatar || user.avatar || "");
                }
                setIsEditing(!isEditing);
              }}
              disabled={isPending}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isProfileIncomplete && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please complete your profile by adding your first and last name to
              get the full experience.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Profile Image */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">Profile Image</h3>
              </div>

              <ImageUpload currentImage={avatarUrl} onImageChange={setAvatarUrl} />
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isPending}
                          placeholder="Enter your first name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isPending}
                          placeholder="Enter your last name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        placeholder="Your email address"
                      />
                    </FormControl>
                    <FormDescription>
                      Email cannot be changed here. Contact support if needed.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>


            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">Additional Information</h3>
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={!isEditing || isPending}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between">
                      <span>Share a brief description about yourself</span>
                      <span
                        className={
                          bioLength > 450
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {bioLength}/500
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills & Expertise</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing || isPending}
                        placeholder="e.g., Event Planning, Marketing, Design"
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between">
                      <span>Separate skills with commas</span>
                      <span
                        className={
                          skillsLength > 180
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {skillsLength}/200
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing || isPending}
                        placeholder="e.g., Technology, Sports, Music, Art"
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between">
                      <span>What are you interested in?</span>
                      <span
                        className={
                          interestsLength > 180
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {interestsLength}/200
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Skills and Interests Display */}
            {(dbUser.skills || dbUser.interests) && !isEditing && (
              <div className="space-y-4">
                {dbUser.skills && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      
                      {dbUser.skills.split(",").map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill.trim()}
                        </Badge>
                      ))}


                    </div>
                  </div>
                )}

                {dbUser.interests && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {dbUser.interests.split(",").map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                {!isProfileIncomplete && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setIsEditing(false);
                    }}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
