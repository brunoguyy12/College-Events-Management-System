import type React from "react"
import { SiteHeader } from "@/components/site-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto py-8">{children}</main>
    </div>
  )
}
