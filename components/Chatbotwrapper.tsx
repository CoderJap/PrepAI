// components/ChatbotWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import ChatbotAssistant from "./ChatbotAssistant";

export default function ChatbotWrapper() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from your auth system
    const getUserData = async () => {
      try {
        // You might need to adjust this based on your auth implementation
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const user = await response.json();
          setUserId(user?.id || null);
        }
      } catch (error) {
        console.log("User not authenticated");
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, []);

  if (isLoading) {
    return null; // Don't render chatbot while loading
  }

  return <ChatbotAssistant userId={userId} />;
}
