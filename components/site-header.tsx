"use client";

import Link from "next/link";
import { Calendar, Menu, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function SiteHeader() {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as string) || "STUDENT";
  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="hidden font-bold sm:inline-block">EventHub</span>
          </Link>
          <div className="hidden md:block">
            <MainNav userRole={userRole} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isOrganizer && (
            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="/events/create" className="items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline-block">Create Event</span>
              </Link>
            </Button>
          )}
          <div className="hidden md:block">
            <UserNav />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border py-3 px-4">
          <div className="flex flex-col space-y-3">
            <MainNav userRole={userRole} />
            {isOrganizer && (
              <Button asChild size="sm" className="w-full justify-start">
                <Link href="/events/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </Link>
              </Button>
            )}
            <div className="pt-2">
              <UserNav />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// "use client";

// import Link from "next/link";
// import { Calendar, Menu, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { ThemeToggle } from "@/components/theme-toggle";

// interface LandingHeaderProps {
//   userId: string | null;
// }

// export function LandingHeader({ userId }: LandingHeaderProps) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const navigation = [
//     { name: "Features", href: "#features" },
//     { name: "About", href: "#about" },
//     { name: "Testimonials", href: "#testimonials" },
//     { name: "Contact", href: "#contact" },
//   ];

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           <div className="flex items-center gap-8">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-white">
//                 <Calendar className="h-4 w-4" />
//               </div>
//               <span className="hidden font-bold text-xl sm:inline-block">
//                 EventHub
//               </span>
//             </Link>

//             <nav className="hidden md:flex items-center gap-6">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="text-sm font-medium text-muted-foreground hover:text-primary-500 transition-colors"
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </nav>
//           </div>

//           <div className="flex items-center gap-4">
//             <ThemeToggle />

//             {userId ? (
//               <Button asChild className="bg-gradient-primary">
//                 <Link href="/dashboard">Dashboard</Link>
//               </Button>
//             ) : (
//               <div className="hidden sm:flex items-center gap-2">
//                 <Button variant="outline" asChild>
//                   <Link href="/sign-in">Sign In</Link>
//                 </Button>
//                 <Button asChild className="bg-gradient-primary">
//                   <Link href="/sign-up">Get Started</Link>
//                 </Button>
//               </div>
//             )}

//             <Button
//               variant="ghost"
//               size="sm"
//               className="md:hidden"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? (
//                 <X className="h-4 w-4" />
//               ) : (
//                 <Menu className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t border-border">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary-500 transition-colors"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//               {!userId && (
//                 <div className="flex flex-col gap-2 px-3 pt-4">
//                   <Button variant="outline" asChild>
//                     <Link href="/sign-in">Sign In</Link>
//                   </Button>
//                   <Button asChild>
//                     <Link href="/sign-up">Get Started</Link>
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
