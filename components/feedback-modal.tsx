"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PendingFeedback } from "@/lib/feedback-manager";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: PendingFeedback;
  onSubmit: (eventId: string) => void;
}

export function FeedbackModal({
  isOpen,
  onClose,
  feedback,
  onSubmit,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: feedback.eventId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback!",
        });
        onSubmit(feedback.eventId);
        onClose();
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSubmit(feedback.eventId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            How was your experience?
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-lg">{feedback.eventTitle}</h3>
            <p className="text-sm text-muted-foreground">
              Organized by {feedback.organizerName}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                />
                <span className="sr-only">{star} Star</span>
              </button>
            ))}
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium">
              Additional Comments (Optional)
            </label>
            <Textarea
              placeholder="Share your thoughts about the event..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 bg-transparent"
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
