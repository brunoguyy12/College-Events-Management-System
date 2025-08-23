import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default banners for each event category
export const getDefaultBanner = (category: string): string => {
  const banners = {
    SEMINAR: "/banners/seminar.webp",
    WORKSHOP: "/banners/workshop.jpg",
    HACKATHON: "/banners/hackathon.jpg",
    FEST: "/banners/fest.jpg",
    CONFERENCE: "/banners/conference.jpg",
    SPORTS: "/banners/sports.jpg",
    CULTURAL: "/banners/cultural.jpg",
    ACADEMIC: "/banners/academic.jpg",
    OTHER:
      "https://i.pinimg.com/736x/0f/e1/aa/0fe1aae7a760f79a6ee30ae101de7a9f.jpg",
  };
  return banners[category as keyof typeof banners] || banners.OTHER;
};
