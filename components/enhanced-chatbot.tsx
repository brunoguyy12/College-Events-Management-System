"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Users,
  Calendar,
  Settings,
  Shield,
} from "lucide-react";
import Fuse from "fuse.js";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  category?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category:
    | "general"
    | "events"
    | "registration"
    | "technical"
    | "roles"
    | "features";
  keywords: string[];
}

const comprehensiveFAQData: FAQItem[] = [
  // General Questions
  {
    id: "1",
    question: "What is the Intelligent College Event Management System?",
    answer:
      "It's a comprehensive web-based platform designed to simplify planning, promotion, and execution of college events. It uses AI to automate tasks like event scheduling, participant matching, and feedback analysis with features like automated notifications, ticket management, and real-time analytics.",
    category: "general",
    keywords: ["platform", "system", "what is", "about", "overview"],
  },
  {
    id: "2",
    question: "How many events can this platform handle simultaneously?",
    answer:
      "The platform can manage unlimited events simultaneously thanks to its scalable architecture built on Next.js and PostgreSQL. It's designed to handle everything from small workshops to large college festivals.",
    category: "general",
    keywords: ["capacity", "limit", "simultaneous", "scalable", "handle"],
  },
  {
    id: "3",
    question: "Is the platform free to use for students?",
    answer:
      "Yes! The platform is completely free for students to register, browse events, and participate. Only advanced organizer features may have premium options in the future.",
    category: "general",
    keywords: ["free", "cost", "price", "students", "money"],
  },

  // Event Management
  {
    id: "4",
    question: "What types of events can be created?",
    answer:
      "We support 5 main event categories: Academic (workshops, seminars), Cultural (festivals, performances), Sports (tournaments, matches), Technical (hackathons, coding contests), and Social (meetups, networking events). Each category has specialized features.",
    category: "events",
    keywords: [
      "types",
      "categories",
      "academic",
      "cultural",
      "sports",
      "technical",
      "social",
    ],
  },
  {
    id: "5",
    question: "How do I create an event?",
    answer:
      "First, request organizer privileges from an admin. Once approved, go to Events → Create Event, fill in details like title, description, date, venue, and category. You can add images, set registration limits, and configure check-in options.",
    category: "events",
    keywords: ["create", "make", "new event", "organize", "setup"],
  },
  {
    id: "6",
    question: "Can I edit or cancel events after creating them?",
    answer:
      "Yes! As an organizer, you can edit event details anytime before it starts. You can also cancel events, but registered participants will be automatically notified via email about the cancellation.",
    category: "events",
    keywords: ["edit", "modify", "cancel", "change", "update"],
  },
  {
    id: "7",
    question: "How does event scheduling work?",
    answer:
      "Our AI suggests optimal time slots based on participant availability, venue conflicts, and historical data. You can also manually set dates and times. The system prevents double-booking and sends calendar invites.",
    category: "events",
    keywords: ["schedule", "timing", "calendar", "availability", "conflicts"],
  },

  // Registration & Participation
  {
    id: "8",
    question: "How do I register for events?",
    answer:
      "Browse events on the Events page, click on any event you're interested in, and hit 'Register'. You'll receive a confirmation email with event details and a QR code for check-in.",
    category: "registration",
    keywords: ["register", "signup", "join", "participate", "enroll"],
  },
  {
    id: "9",
    question: "When does registration close for events?",
    answer:
      "Registration closes exactly when the event starts (not when it ends). This ensures only committed participants register and helps organizers plan better.",
    category: "registration",
    keywords: ["deadline", "close", "cutoff", "when", "registration end"],
  },
  {
    id: "10",
    question: "Can I cancel my registration?",
    answer:
      "Yes, you can cancel your registration anytime before the event starts. Go to your Dashboard → My Events → Registered Events and click 'Cancel Registration'. The organizer will be notified.",
    category: "registration",
    keywords: ["cancel", "unregister", "withdraw", "leave", "quit"],
  },
  {
    id: "11",
    question: "How does the QR code check-in system work?",
    answer:
      "After registration, you receive a unique QR code via email. At the event, organizers scan your QR code or you can click the check-in link. The system supports early check-ins and tracks attendance automatically.",
    category: "registration",
    keywords: ["qr code", "check-in", "attendance", "scan", "entry"],
  },

  // User Roles & Permissions
  {
    id: "12",
    question: "How do I become an event organizer?",
    answer:
      "Go to Settings → Role Management and request organizer privileges. Provide details about your experience and intended events. An admin will review and approve your request, usually within 24-48 hours.",
    category: "roles",
    keywords: ["organizer", "privileges", "permissions", "become", "request"],
  },
  {
    id: "13",
    question:
      "What's the difference between Admin, Organizer, and Student roles?",
    answer:
      "Students can register and attend events. Organizers can create and manage their own events, view participant lists, and access analytics. Admins have full platform control, can manage all events, approve organizer requests, and access system-wide analytics.",
    category: "roles",
    keywords: [
      "roles",
      "permissions",
      "admin",
      "organizer",
      "student",
      "difference",
    ],
  },
  {
    id: "14",
    question: "Can organizers see who registered for their events?",
    answer:
      "Yes! Organizers can view complete participant lists, check-in status, contact information, and export attendee data. They also get real-time notifications when someone registers or cancels.",
    category: "roles",
    keywords: [
      "participant list",
      "attendees",
      "who registered",
      "organizer view",
    ],
  },

  // Technical Features
  {
    id: "15",
    question: "Does the platform send automated notifications?",
    answer:
      "Yes! We send automated email notifications for registration confirmations, event reminders (24 hours before), check-in confirmations, event updates, and cancellations. All emails include QR codes and calendar attachments.",
    category: "technical",
    keywords: ["notifications", "email", "automated", "reminders", "alerts"],
  },
  {
    id: "16",
    question: "How does participant matching work?",
    answer:
      "Our AI analyzes participant profiles, skills, interests, and past event attendance to suggest relevant events and potential team members. This helps create better networking opportunities and team formations.",
    category: "technical",
    keywords: ["matching", "ai", "recommendations", "skills", "networking"],
  },
  {
    id: "17",
    question: "What analytics are available?",
    answer:
      "Students see their participation history and attendance rates. Organizers get event performance metrics, attendance analytics, and feedback summaries. Admins access platform-wide statistics, user growth, and category performance data.",
    category: "technical",
    keywords: ["analytics", "statistics", "metrics", "data", "insights"],
  },
  {
    id: "18",
    question: "Is my data secure on this platform?",
    answer:
      "We use industry-standard security with Clerk authentication, encrypted data storage, secure API endpoints, and GDPR-compliant data handling. Your personal information is never shared without consent.",
    category: "technical",
    keywords: ["security", "privacy", "data protection", "safe", "secure"],
  },

  // Advanced Features
  {
    id: "19",
    question: "How does the feedback system work?",
    answer:
      "After attending events, you'll get a feedback popup when you next login. You can rate events with stars and leave comments. This helps organizers improve future events and helps other students choose events.",
    category: "features",
    keywords: ["feedback", "rating", "review", "comments", "evaluation"],
  },
  {
    id: "20",
    question: "Can I see events on a calendar view?",
    answer:
      "Yes! The Calendar page shows all events in a monthly view with color-coding by category. You can filter by your registered events, event types, and export to your personal calendar app.",
    category: "features",
    keywords: ["calendar", "schedule", "monthly view", "timeline", "dates"],
  },
  {
    id: "21",
    question: "How do event statuses work?",
    answer:
      "Events progress through statuses: Draft (being created) → Published (open for registration) → Ongoing (currently happening) → Completed (finished). Status changes happen automatically based on event timing.",
    category: "features",
    keywords: [
      "status",
      "draft",
      "published",
      "ongoing",
      "completed",
      "lifecycle",
    ],
  },
  {
    id: "22",
    question: "Can I upload images for events?",
    answer:
      "Yes! Organizers can upload event banners and multiple images using our ImageKit integration. Images are automatically optimized for web and mobile viewing. Students can also upload profile pictures.",
    category: "features",
    keywords: ["images", "upload", "photos", "banner", "pictures"],
  },

  // Troubleshooting
  {
    id: "23",
    question: "What if I can't scan the QR code at an event?",
    answer:
      "No problem! You can click the backup check-in link in your email, or ask the organizer to manually check you in using your name or email. The system supports multiple check-in methods.",
    category: "technical",
    keywords: ["qr code problems", "can't scan", "backup", "manual check-in"],
  },
  {
    id: "24",
    question: "I'm not receiving email notifications. What should I do?",
    answer:
      "Check your spam folder first. If still not receiving emails, verify your email address in your profile settings. Contact support if the issue persists - we use Resend for reliable email delivery.",
    category: "technical",
    keywords: [
      "email problems",
      "not receiving",
      "spam",
      "notifications missing",
    ],
  },
  {
    id: "25",
    question: "How do I contact support?",
    answer:
      "For technical issues, use the feedback form in your profile. For urgent matters, contact your college's event management team. You can also report bugs through the Settings page.",
    category: "general",
    keywords: ["support", "help", "contact", "problems", "assistance"],
  },
];

const categoryIcons = {
  general: Sparkles,
  events: Calendar,
  registration: Users,
  technical: Settings,
  roles: Shield,
  features: Bot,
};

const categoryColors = {
  general:
    "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300",
  events:
    "bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300",
  registration:
    "bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300",
  technical:
    "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  roles:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  features: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export default function EnhancedChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "👋 Hi! I'm your Event Management Assistant. I can help you with questions about creating events, registering for activities, user roles, technical features, and more. What would you like to know?",
      timestamp: new Date(),
      category: "general",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fuse = new Fuse(comprehensiveFAQData, {
    keys: ["question", "answer", "keywords"],
    threshold: 0.3,
    includeScore: true,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (questionText?: string, category?: string) => {
    const text = questionText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
      category,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(
      () => {
        const results = fuse.search(text);
        let botResponse: string;
        let responseCategory = "general";

        if (results.length > 0 && results[0].score! < 0.6) {
          const bestMatch = results[0].item;
          botResponse = bestMatch.answer;
          responseCategory = bestMatch.category;
        } else {
          botResponse =
            "I'm not sure about that specific question. Here are some things I can help you with:\n\n• Event creation and management\n• Registration and check-in process\n• User roles and permissions\n• Platform features and analytics\n• Technical troubleshooting\n\nTry asking about any of these topics, or contact support for personalized help!";
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botResponse,
          timestamp: new Date(),
          category: responseCategory,
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000
    ); // Variable delay for more natural feel
  };

  const getQuestionsByCategory = (category: string) => {
    return comprehensiveFAQData
      .filter((faq) => faq.category === category)
      .slice(0, 3);
  };

  const categories = Object.keys(categoryIcons) as Array<
    keyof typeof categoryIcons
  >;

  return (
    <>
      {/* Enhanced Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-2 right-2 md:bottom-3 md:right-3  xl:bottom-6 xl:right-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            !
          </motion.div>
        )}
      </motion.button>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-14 md:bottom-20 xl:bottom-24 right-2 md:right-4 xl:right-6 w-96 h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100]"
          >
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-primary-foreground px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Event Assistant</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Category Filter */}
            <div className="p-3 border-b border-border bg-muted/30">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="h-7 text-xs"
                >
                  All
                </Button>
                {categories.map((category) => {
                  const Icon = categoryIcons[category];
                  return (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="h-7 text-xs flex items-center gap-1"
                    >
                      <Icon className="w-3 h-3" />
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === "user"
                          ? "bg-primary-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.sender === "user"
                          ? "bg-primary-500 text-white rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p
                          className={`text-xs ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {msg.category && msg.sender === "bot" && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${categoryColors[msg.category as keyof typeof categoryColors]}`}
                          >
                            {msg.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="p-3 border-t border-border bg-muted/30 max-h-32 overflow-y-auto">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Quick Questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {(selectedCategory
                  ? getQuestionsByCategory(selectedCategory)
                  : comprehensiveFAQData.slice(0, 6)
                ).map((faq) => {
                  const Icon = categoryIcons[faq.category];
                  return (
                    <Button
                      key={faq.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSend(faq.question, faq.category)}
                      className="h-auto p-2 text-xs text-left justify-start whitespace-normal"
                    >
                      <Icon className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{faq.question}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask me anything about events..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by AI • {comprehensiveFAQData.length} topics covered
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
