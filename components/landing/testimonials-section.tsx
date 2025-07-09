import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Coordinator",
      institution: "Tech University",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "EventHub transformed how we organize hackathons. The AI scheduling suggestions saved us hours of planning, and the participant matching feature created the most diverse teams we've ever had.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Student Body President",
      institution: "State College",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The analytics dashboard gives us incredible insights into student engagement. We've increased event attendance by 40% since implementing EventHub's smart notification system.",
      rating: 5,
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Dean of Student Affairs",
      institution: "Metropolitan Institute",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "As an administrator, I appreciate the role-based access and comprehensive reporting. EventHub has streamlined our entire event approval and management process.",
      rating: 5,
    },
    {
      name: "Alex Thompson",
      role: "Club President",
      institution: "Community College",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The QR code ticketing system is a game-changer. Check-ins are now seamless, and we can track attendance in real-time. Our events run so much smoother now.",
      rating: 5,
    },
    {
      name: "Jessica Park",
      role: "Event Manager",
      institution: "Liberal Arts College",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "I love how EventHub handles everything from planning to post-event analysis. The feedback collection and sentiment analysis help us continuously improve our events.",
      rating: 5,
    },
    {
      name: "David Kumar",
      role: "Student Organizer",
      institution: "Engineering School",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The participant matching for our coding competitions is incredible. Teams are more balanced, and collaboration has improved significantly. Highly recommend EventHub!",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 lg:py-32 bg-background-50/30 dark:bg-background-950/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What Our Community
            <span className="text-gradient block">Says About Us</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from students, organizers, and administrators who have
            transformed their event management experience with EventHub.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary-200 dark:text-primary-800" />
                  <p className="text-muted-foreground leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-primary-600">
                      {testimonial.institution}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
