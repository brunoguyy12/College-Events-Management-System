"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

const categories = [
  { value: "SEMINAR", label: "Seminar" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "HACKATHON", label: "Hackathon" },
  { value: "FEST", label: "Fest" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "SPORTS", label: "Sports" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "ACADEMIC", label: "Academic" },
  { value: "OTHER", label: "Other" },
]

export function EventsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "ALL_CATEGORIES")

  const updateFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "ALL_CATEGORIES") params.set("category", category)

    const queryString = params.toString()
    router.push(`/events${queryString ? `?${queryString}` : ""}`)
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("ALL_CATEGORIES")
    router.push("/events")
  }

  const hasActiveFilters = search || category !== "ALL_CATEGORIES"

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && updateFilters()}
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL_CATEGORIES">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button onClick={updateFilters} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Apply
          </Button>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSearch("")
                  updateFilters()
                }}
              />
            </Badge>
          )}
          {category !== "ALL_CATEGORIES" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find((c) => c.value === category)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setCategory("ALL_CATEGORIES")
                  updateFilters()
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
