// // "use client"

// import type React from "react";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ThemeProvider } from "@/components/theme-provider";

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <ClerkProvider>
//       <ThemeProvider
//         attribute="class"
//         defaultTheme="system"
//         enableSystem
//         disableTransitionOnChange
//       >
//         {children}
//       </ThemeProvider>
//     </ClerkProvider>
//   );
// }

// providers.tsx
"use client";

import type React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ClientThemeWrapper } from "@/components/providers/ClientThemeProviders";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ClientThemeWrapper>{children}</ClientThemeWrapper>
    </ClerkProvider>
  );
}
