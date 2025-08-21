import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default banners for each event category
export const getDefaultBanner = (category: string): string => {
  const banners = {
    SEMINAR:
      "https://www.shutterstock.com/image-vector/cyber-big-data-flow-particles-600nw-2481879519.jpg",
    WORKSHOP:
      "https://t3.ftcdn.net/jpg/05/77/52/72/360_F_577527293_pXgLe4ve8IeTnuJmjSXwOGIYJst4yPCA.jpg",
    HACKATHON:
      "https://t3.ftcdn.net/jpg/02/45/56/24/360_F_245562410_PmIEyr1I3WkcwMVC6vBwrXctULQ4sA28.jpg",
    FEST: "https://us.123rf.com/450wm/wowdesignstudio/wowdesignstudio2302/wowdesignstudio230200101/198193106-golden-blue-red-award-background-jubilee-night-decorative-invitation-stage-platform-elegant.jpg?ver=6",
    CONFERENCE:
      "https://www.shutterstock.com/image-vector/cyber-big-data-flow-particles-600nw-2481879519.jpg",
    SPORTS: "/placeholder.svg?height=400&width=800",
    CULTURAL: "/placeholder.svg?height=400&width=800",
    ACADEMIC: "/placeholder.svg?height=400&width=800",
    OTHER:
      "https://i.pinimg.com/736x/0f/e1/aa/0fe1aae7a760f79a6ee30ae101de7a9f.jpg",
  };
  return banners[category as keyof typeof banners] || banners.OTHER;
};
