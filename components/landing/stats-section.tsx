import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, Star } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Students",
      description: "Across multiple campuses",
    },
    {
      icon: Calendar,
      value: "2,500+",
      label: "Events Organized",
      description: "Successfully managed",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Success Rate",
      description: "Event completion rate",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "User Rating",
      description: "Average satisfaction score",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Thousands of Students
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Join the growing community of colleges and universities using
            EventHub to create memorable experiences.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-primary-100">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
