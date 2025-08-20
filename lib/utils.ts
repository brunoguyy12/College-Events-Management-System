import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default banners for each event category
export const getDefaultBanner = (category: string): string => {
  const banners = {
    SEMINAR: "/placeholder.svg?height=400&width=800",
    WORKSHOP: "/placeholder.svg?height=400&width=800",
    HACKATHON: "/placeholder.svg?height=400&width=800",
    FEST: "/placeholder.svg?height=400&width=800",
    CONFERENCE: "/placeholder.svg?height=400&width=800",
    SPORTS: "/placeholder.svg?height=400&width=800",
    CULTURAL: "/placeholder.svg?height=400&width=800",
    ACADEMIC: "/placeholder.svg?height=400&width=800",
    OTHER: "/placeholder.svg?height=400&width=800",
  };
  return banners[category as keyof typeof banners] || banners.OTHER;
};
