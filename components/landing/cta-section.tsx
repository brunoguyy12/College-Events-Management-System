import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface CTASectionProps {
  userId: string | null;
}

export function CTASection({ userId }: CTASectionProps) {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Transform Your
              <span className="block">College Events?</span>
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of students and organizers who are already creating
              unforgettable experiences with EventHub's intelligent platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {userId ? (
              <>
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50 shadow-lg"
                  asChild
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  asChild
                >
                  <Link href="/events">Browse Events</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50 shadow-lg"
                  asChild
                >
                  <Link href="/sign-up" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Start Free Today
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          <div className="pt-8">
            <p className="text-sm text-primary-100">
              No credit card required • Free forever for students • Premium
              features available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
