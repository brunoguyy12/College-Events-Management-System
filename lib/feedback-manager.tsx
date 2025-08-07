"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export interface PendingFeedback {
  eventId: string;
  eventTitle: string;
  completedAt: Date;
  organizerName: string;
}

// Hook to check for pending feedback when user logs in
export function useFeedbackManager() {
  const { user, isLoaded } = useUser();
  const [pendingFeedback, setPendingFeedback] = useState<PendingFeedback[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      checkForPendingFeedback();
    }
  }, [isLoaded, user]);

  const checkForPendingFeedback = async () => {
    try {
      const response = await fetch("/api/feedback/pending");
      if (response.ok) {
        const data = await response.json();
        if (data.pendingFeedback && data.pendingFeedback.length > 0) {
          setPendingFeedback(data.pendingFeedback);
          // Show modal after 2 seconds (better UX)
          setTimeout(() => setShowFeedbackModal(true), 2000);
        }
      }
    } catch (error) {
      console.error("Failed to check pending feedback:", error);
    }
  };

  const markFeedbackShown = async (eventId: string) => {
    try {
      await fetch("/api/feedback/mark-shown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      setPendingFeedback((prev) => prev.filter((f) => f.eventId !== eventId));

      if (pendingFeedback.length <= 1) {
        setShowFeedbackModal(false);
      }
    } catch (error) {
      console.error("Failed to mark feedback as shown:", error);
    }
  };

  return {
    pendingFeedback,
    showFeedbackModal,
    setShowFeedbackModal,
    markFeedbackShown,
  };
}
