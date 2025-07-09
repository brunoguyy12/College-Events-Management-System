import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Users,
  Bell,
  QrCode,
  BarChart3,
  Calendar,
  Zap,
  Shield,
  Globe,
  Heart,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Scheduling",
      description:
        "Smart suggestions for optimal event timing and venue selection based on comprehensive data analysis and student behavior patterns.",
      badge: "AI-Driven",
      color: "primary",
    },
    {
      icon: Users,
      title: "Intelligent Participant Matching",
      description:
        "Advanced ML algorithms create balanced teams for hackathons and group events, ensuring diverse skill sets and compatibility.",
      badge: "Smart Matching",
      color: "secondary",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Automated, personalized reminders and updates that keep everyone informed and engaged throughout the event lifecycle.",
      badge: "Automated",
      color: "accent",
    },
    {
      icon: QrCode,
      title: "QR Code Ticketing",
      description:
        "Seamless check-in process with secure QR code-based ticket management and real-time attendance tracking.",
      badge: "Contactless",
      color: "primary",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Comprehensive insights and feedback analysis to improve future events with actionable data and performance metrics.",
      badge: "Data-Driven",
      color: "secondary",
    },
    {
      icon: Calendar,
      title: "Complete Event Lifecycle",
      description:
        "End-to-end event management from initial planning and promotion to execution and post-event analysis.",
      badge: "Full-Stack",
      color: "accent",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description:
        "Secure, hierarchical permission system ensuring appropriate access levels for students, organizers, and administrators.",
      badge: "Secure",
      color: "primary",
    },
    {
      icon: Globe,
      title: "Multi-Campus Support",
      description:
        "Scalable architecture supporting multiple campuses and institutions with centralized management capabilities.",
      badge: "Scalable",
      color: "secondary",
    },
    {
      icon: Heart,
      title: "Community Building",
      description:
        "Foster connections and engagement within your college community through shared interests and collaborative events.",
      badge: "Social",
      color: "accent",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-100 text-primary-700 border-primary-200";
      case "secondary":
        return "bg-secondary-100 text-secondary-700 border-secondary-200";
      case "accent":
        return "bg-accent-100 text-accent-700 border-accent-200";
      default:
        return "bg-primary-100 text-primary-700 border-primary-200";
    }
  };

  return (
    <section
      id="features"
      className="py-20 lg:py-32 bg-background-50/50 dark:bg-background-950/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Powerful Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need for
            <span className="text-gradient block">Perfect Events</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge AI technology with
            intuitive design to deliver an unparalleled event management
            experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <Badge
                    variant="outline"
                    className={getColorClasses(feature.color)}
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
