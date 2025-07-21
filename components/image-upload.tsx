// "use client"

// import type React from "react"

// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Upload, X, Loader2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface ImageUploadProps {
//   currentImage?: string | null
//   onImageChange: (imageUrl: string) => void
//   className?: string
//   size?: "sm" | "md" | "lg"
// }

// export function ImageUpload({ currentImage, onImageChange , className, size = "md" }: ImageUploadProps) {
//   const [isUploading, setIsUploading] = useState(false)
//   const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const { toast } = useToast()

//   const sizeClasses = {
//     sm: "h-16 w-16",
//     md: "h-24 w-24",
//     lg: "h-32 w-32",
//   }

//   const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       toast({
//         title: "Invalid File",
//         description: "Please select an image file.",
//         variant: "destructive",
//       })
//       return
//     }

//     // Validate file size (5MB max)
//     if (file.size > 5 * 1024 * 1024) {
//       toast({
//         title: "File Too Large",
//         description: "Please select an image smaller than 5MB.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsUploading(true)

//     try {
//       // Create preview
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setPreviewUrl(e.target?.result as string)
//       }
//       reader.readAsDataURL(file)

//       // Upload to server
//       const formData = new FormData()
//       formData.append("file", file)
//       formData.append("folder", "profile-images")

//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error("Upload failed")
//       }

//       const result = await response.json()
//       onImageChange(result.url)

//       toast({
//         title: "Image Uploaded",
//         description: "Your image has been uploaded successfully.",
//       })
//     } catch (error) {
//       console.error("Upload error:", error)
//       toast({
//         title: "Upload Failed",
//         description: "Failed to upload image. Please try again.",
//         variant: "destructive",
//       })
//       setPreviewUrl(currentImage || null)
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const handleRemoveImage = () => {
//     setPreviewUrl(null)
//     onImageChange("")
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   return (
//     <div className={`flex items-center gap-4 ${className}`}>
//       <div className="relative">
//         <Avatar className={sizeClasses[size]}>
//           <AvatarImage src={previewUrl || "/placeholder.svg"} alt="Profile" />
//           <AvatarFallback>
//             <Upload className="h-6 w-6 text-muted-foreground" />
//           </AvatarFallback>
//         </Avatar>

//         {previewUrl && (
//           <Button
//             type="button"
//             variant="destructive"
//             size="sm"
//             className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
//             onClick={handleRemoveImage}
//             disabled={isUploading}
//           >
//             <X className="h-3 w-3" />
//           </Button>
//         )}
//       </div>

//       <div className="space-y-2">
//         <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           onClick={() => fileInputRef.current?.click()}
//           disabled={isUploading}
//         >
//           {isUploading ? (
//             <>
//               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               Uploading...
//             </>
//           ) : (
//             <>
//               <Upload className="h-4 w-4 mr-2" />
//               Upload Image
//             </>
//           )}
//         </Button>

//         <p className="text-xs text-muted-foreground">Max 5MB. JPG, PNG, GIF supported.</p>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ currentImage, onImageChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      toast({
        title: "No file provided",
        variant: "destructive"
      })
      return; 
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "profile-images")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onImageChange(data.url)

      toast({
        title: "Upload successful",
        description: "Your profile image has been updated.",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onImageChange("")
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentImage || "/placeholder.svg"} className="object-cover" />
        <AvatarFallback>
          <Upload className="h-8 w-8 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>

        {currentImage && (
          <Button type="button" variant="outline" size="sm" onClick={handleRemove} disabled={disabled || isUploading}>
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
