import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Sparkles, BarChart3, Bell, QrCode } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"

export default async function HomePage() {
  const { userId } = await auth()

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Scheduling",
      description: "Smart suggestions for optimal event timing and venue selection based on data analysis.",
    },
    {
      icon: Users,
      title: "Participant Matching",
      description: "Intelligent team formation for hackathons and group events using ML algorithms.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automated reminders and updates to keep everyone informed and engaged.",
    },
    {
      icon: QrCode,
      title: "QR Code Ticketing",
      description: "Seamless check-in process with QR code-based ticket management.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Comprehensive insights and feedback analysis to improve future events.",
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Complete event lifecycle management from planning to execution.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
        <div className="max-w-4xl mx-auto space-y-6">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Event Management
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Intelligent College
            <span className="text-primary"> Event Management</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revolutionize your college events with AI-driven insights, smart scheduling, and seamless participant
            management. Make every event unforgettable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {userId ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href="/sign-in">Get Started</Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Events</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to create, manage, and analyze successful college events.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Events?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of students and organizers who are already using our platform.
          </p>
          {!userId && (
            <Button asChild size="lg">
              <Link href="/sign-in">Start Your Journey</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
