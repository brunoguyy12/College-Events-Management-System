"use client";

import type React from "react";

import { useAutoComplete } from "@/lib/auto-complete";
import { useFeedbackManager } from "@/lib/feedback-manager";
import { FeedbackModal } from "@/components/feedback-modal";

interface DashboardClientProps {
  children: React.ReactNode;
}

export function DashboardClient({ children }: DashboardClientProps) {
  // Auto-complete events when user visits dashboard
  useAutoComplete();

  // Check for pending feedback
  const {
    pendingFeedback,
    showFeedbackModal,
    setShowFeedbackModal,
    markFeedbackShown,
  } = useFeedbackManager();

  return (
    <>
      {children}

      {/* Feedback Modal */}
      {pendingFeedback.length > 0 && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          feedback={pendingFeedback[0]}
          onSubmit={markFeedbackShown}
        />
      )}
    </>
  );
}
