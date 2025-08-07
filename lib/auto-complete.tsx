"use client";

// Client-side auto-completion that runs when users visit the app
export async function checkAndCompleteEvents() {
  try {
    const response = await fetch("/api/events/auto-complete", {
      method: "POST",
    });

    if (response.ok) {
      const result = await response.json();
      console.log(
        "Auto-completed events:",
        result.completedEvents?.length || 0
      );
      console.log("Started events:", result.startedEvents?.length || 0);
    }
  } catch (error) {
    console.error("Auto-completion failed:", error);
  }
}

// Call this in your main layout or dashboard
export function useAutoComplete() {
  const { useEffect } = require("react");

  useEffect(() => {
    // Run on app load
    checkAndCompleteEvents();

    // Run every 5 minutes while app is open (more frequent for better UX)
    const interval = setInterval(checkAndCompleteEvents, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
