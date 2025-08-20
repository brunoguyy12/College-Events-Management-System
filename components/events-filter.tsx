"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { getDepartmentsByCategory } from "@/lib/departments";

const EVENT_CATEGORIES = [
  "SEMINAR",
  "WORKSHOP",
  "HACKATHON",
  "FEST",
  "CONFERENCE",
  "SPORTS",
  "CULTURAL",
  "ACADEMIC",
  "OTHER",
];

export function EventsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [department, setDepartment] = useState(
    searchParams.get("department") || "all"
  );
  const [date, setDate] = useState(searchParams.get("date") || "");

  const departmentsByCategory = getDepartmentsByCategory();

  const updateFilters = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (department !== "all") params.set("department", department);
    if (date) params.set("date", date);

    router.push(`/events?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setDepartment("all");
    setDate("");
    router.push("/events");
  };

  const hasActiveFilters =
    search || category !== "all" || department !== "all" || date;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && updateFilters()}
          />
        </div>

        {/* Category Filter */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EVENT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Department Filter */}
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {Object.entries(departmentsByCategory).map(
              ([categoryName, depts]) => (
                <div key={categoryName}>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    {categoryName}
                  </div>
                  {depts.map((dept) => (
                    <SelectItem key={dept.name} value={dept.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: dept.color }}
                        />
                        {dept.name}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              )
            )}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full md:w-48"
        />

        {/* Apply Filters */}
        <Button onClick={updateFilters} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Apply
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2 bg-transparent"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {search}
              <button
                onClick={() => {
                  setSearch("");
                  updateFilters();
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {category}
              <button
                onClick={() => {
                  setCategory("all");
                  updateFilters();
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {department !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Department: {department}
              <button
                onClick={() => {
                  setDepartment("all");
                  updateFilters();
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {date && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {new Date(date).toLocaleDateString()}
              <button
                onClick={() => {
                  setDate("");
                  updateFilters();
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
