"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  userId: string | null;
}

export function HeroSection({ userId }: HeroSectionProps) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8">
          <div className="animate-fade-in">
            <Badge
              variant="secondary"
              className="mb-4 bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-200"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Event Management Platform
            </Badge>
          </div>

          <div className="space-y-6 animate-fade-in delay-200">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Transform Your
              <span className="text-gradient block">College Events</span>
              with Intelligence
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Revolutionize event planning with AI-driven insights, smart
              scheduling, and seamless participant management. Make every
              college event unforgettable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-400">
            {userId ? (
              <>
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white shadow-lg"
                  asChild
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/events">Browse Events</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white shadow-lg"
                  asChild
                >
                  <Link href="/sign-up" className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/events" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    View Demo
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="pt-8 animate-fade-in delay-600">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by students and organizers at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["University A", "College B", "Institute C", "Academy D"].map(
                (name, index) => (
                  <div
                    key={name}
                    className="text-lg font-semibold text-muted-foreground"
                  >
                    {name}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
