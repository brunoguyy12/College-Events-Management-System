"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const faqData = [
  {
    question: "How many events can this platform handle?",
    answer:
      "The platform can manage unlimited events simultaneously, thanks to its scalable architecture.",
  },
  {
    question:
      "Can users automatically switch to Organizer without admin intervention?",
    answer:
      "No, for security and quality purposes, organizer privileges must be approved by an administrator.",
  },
  {
    question: "How many types of events are there and what are they?",
    answer:
      "We currently support Academic, Cultural, Sports, Technical, and Social events.",
  },
  {
    question: "Does the platform send automated notifications?",
    answer:
      "Yes, it sends real-time email and SMS notifications for updates, ticketing, and reminders.",
  },
  {
    question: "Can participants be matched based on their skills?",
    answer:
      "Yes, our AI-based matching feature pairs participants with relevant teams or roles based on skill data.",
  },
];

export default function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi! You can ask me anything about the Event Management System or choose a question below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const fuse = new Fuse(faqData, { keys: ["question"], threshold: 0.4 });

  const handleSend = (questionText?: string) => {
    const text = questionText || input.trim();
    if (!text) return;

    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const result = fuse.search(text);
      const botMessage: Message = {
        sender: "bot",
        text:
          result.length > 0
            ? result[0].item.answer
            : "Sorry, I don't have an answer for that. Please contact support.",
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[hsl(var(--primary-500))] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[hsl(var(--primary-600))] transition"
      >
        💬 Chat
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white dark:bg-[hsl(var(--secondary-800))] rounded-2xl shadow-lg flex flex-col overflow-hidden border border-[hsl(var(--border))]"
          >
            {/* Header */}
            <div className="bg-[hsl(var(--primary-500))] text-[hsl(var(--primary-foreground))] px-4 py-3 font-semibold flex justify-between">
              Event System Chatbot
              <button onClick={() => setIsOpen(false)} className="text-white">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-96">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-[hsl(var(--primary-500))] text-white"
                        : "bg-[hsl(var(--secondary-200))] text-gray-900 dark:bg-[hsl(var(--secondary-700))] dark:text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="text-gray-500 text-xs italic">
                  Bot is typing...
                </div>
              )}
            </div>

            {/* Suggested Questions */}
            <div className="px-3 py-2 bg-[hsl(var(--secondary-100))] dark:bg-[hsl(var(--secondary-700))] flex flex-wrap gap-2">
              {faqData.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(faq.question)}
                  className="text-xs px-2 py-1 bg-[hsl(var(--accent-500))] text-white rounded hover:bg-[hsl(var(--accent-600))] transition"
                >
                  {faq.question}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex border-t border-[hsl(var(--border))]">
              <input
                type="text"
                className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={() => handleSend()}
                className="bg-[hsl(var(--primary-500))] text-white px-4 py-2 text-sm hover:bg-[hsl(var(--primary-600))]"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
