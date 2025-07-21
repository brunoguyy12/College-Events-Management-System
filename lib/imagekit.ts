import ImageKit from "imagekit"

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
})

export { imagekit }

// Helper function to upload buffer to ImageKit
export async function uploadToImageKit(
  file: Buffer | string,
  fileName: string ,
  folder?: string,
): Promise<{ url: string; fileId: string }> {
  try {
    const result = await imagekit.upload({
      file,
      fileName,
      folder : folder || "uploads",
      // useUniqueFileName: true,
    })

    return {
      url: result.url,
      fileId: result.fileId,
    }
  } catch (error) {
    console.error("ImageKit upload error:", error)
    throw new Error("Failed to upload image")
  }
}

// Helper function to delete image from ImageKit
export async function deleteFromImageKit(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId)
  } catch (error) {
    console.error("ImageKit delete error:", error)
    throw new Error("Failed to delete image")
  }
}

// Generate ImageKit authentication parameters for client-side uploads
export function getImageKitAuthParams() {
  const token = imagekit.getAuthenticationParameters()
  return token
}
