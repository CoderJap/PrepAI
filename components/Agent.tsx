"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatus {
  SETUP = "SETUP",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
  timestamp: number;
}

interface InterviewConfig {
  role: string;
  type: "technical" | "behavioral" | "mixed";
  level: "entry" | "mid" | "senior";
  techStack: string[];
  duration: number;
}

interface AgentProps {
  userName?: string;
  userId?: string;
  type: string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.SETUP);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [interviewConfig, setInterviewConfig] =
    useState<InterviewConfig | null>(null);
  const [showConfig, setShowConfig] = useState(true);
  const [interviewStartTime, setInterviewStartTime] = useState<number | null>(
    null
  );

  // Form state for interview configuration
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState<
    "technical" | "behavioral" | "mixed"
  >("mixed");
  const [level, setLevel] = useState<"entry" | "mid" | "senior">("mid");
  const [techStack, setTechStack] = useState("");
  const [duration, setDuration] = useState(15);

  // Check microphone permissions
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      // eslint-disable-next-line no-console
      console.log("Microphone permission granted");
      return true;
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Microphone permission denied:", err);
      setError(`Microphone access denied: ${err.message}`);
      return false;
    }
  };

  useEffect(() => {
    const onCallStart = () => {
      // eslint-disable-next-line no-console
      console.log("Interview started");
      setCallStatus(CallStatus.ACTIVE);
      setError(null);
      setInterviewStartTime(Date.now());
    };

    const onCallEnd = () => {
      // eslint-disable-next-line no-console
      console.log("Interview ended");
      setCallStatus(CallStatus.FINISHED);
      handleInterviewEnd();
    };

    const onMessage = (message: any) => {
      // eslint-disable-next-line no-console
      console.log("Message received:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: SavedMessage = {
          role: message.role as "user" | "system" | "assistant",
          content: message.transcript,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      // eslint-disable-next-line no-console
      console.error("VAPI Error Details:", error);
      setError(`Interview error: ${error.message || "Unknown error"}`);
      setCallStatus(CallStatus.SETUP);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleInterviewEnd = async () => {
    if (!interviewConfig || !interviewStartTime) return;

    try {
      const interviewData = {
        userId,
        userName,
        config: interviewConfig,
        messages,
        startTime: interviewStartTime,
        endTime: Date.now(),
        duration: Date.now() - interviewStartTime,
      };

      // Save interview and generate report
      const response = await fetch("/api/interviews/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewData),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to interview report
        router.push(`/interviews/${result.interviewId}/report`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save interview:", error);
    }
  };

  const handleStartInterview = async () => {
    try {
      setError(null);

      // Validate configuration
      if (!role.trim()) {
        setError("Please enter the role you're interviewing for");
        return;
      }

      // Check microphone permission
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) return;

      const config: InterviewConfig = {
        role: role.trim(),
        type: interviewType,
        level,
        techStack: techStack ? techStack.split(",").map((s) => s.trim()) : [],
        duration,
      };

      setInterviewConfig(config);
      setShowConfig(false);
      setCallStatus(CallStatus.CONNECTING);

      // Create comprehensive interview prompt
      const systemPrompt = `You are an experienced HR interviewer conducting a ${duration}-minute mock ${interviewType} interview for a ${level}-level ${role} position.

INTERVIEW STRUCTURE:
1. Warm greeting and brief introduction (1 min)
2. Background and experience questions (${Math.floor(duration * 0.3)} min)
${
  interviewType === "technical" || interviewType === "mixed"
    ? `3. Technical questions about ${
        config.techStack.join(", ") || "relevant technologies"
      } (${Math.floor(duration * 0.4)} min)`
    : ""
}
${
  interviewType === "behavioral" || interviewType === "mixed"
    ? `${
        interviewType === "mixed" ? "4" : "3"
      }. Behavioral questions using STAR method (${Math.floor(
        duration * 0.3
      )} min)`
    : ""
}
${interviewType === "mixed" ? "5" : "4"}. Candidate's questions (2-3 min)
${interviewType === "mixed" ? "6" : "5"}. Closing and next steps (1 min)

BEHAVIORAL GUIDELINES:
- Be professional but warm and encouraging
- Ask one question at a time and wait for complete answers
- Follow up with clarifying questions when appropriate
- Take notes mentally for realistic pauses
- Give subtle positive reinforcement ("I see", "That's interesting", "Good point")
- Keep track of time and transition naturally between sections
- If candidate struggles, offer gentle guidance without giving away answers

ASSESSMENT FOCUS:
- Communication clarity and confidence
- Relevant experience and skills
- Problem-solving approach
- Cultural fit and motivation
- Technical competency (if applicable)

Start with a warm, professional greeting and set expectations for the interview.`;

      // Start VAPI interview
      await vapi.start({
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [{ role: "system", content: systemPrompt }],
        },
        voice: {
          provider: "openai",
          voiceId: "alloy",
        },
        firstMessage: `Hello ${userName}! I'm Sarah, and I'll be conducting your interview today for the ${role} position. I'm excited to learn more about your background and experience. This will be a ${duration}-minute ${interviewType} interview, and I encourage you to ask questions along the way. Are you ready to begin?`,
      });

      // eslint-disable-next-line no-console
      console.log("Interview started with config:", config);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Failed to start interview:", error);
      setError(`Failed to start interview: ${error.message}`);
      setCallStatus(CallStatus.SETUP);
    }
  };

  const handleDisconnect = async () => {
    try {
      vapi.stop();
      setCallStatus(CallStatus.FINISHED);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Error ending interview:", error);
    }
  };

  const latestMessage = messages[messages.length - 1]?.content;

  if (showConfig && callStatus === CallStatus.SETUP) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">Interview Setup</h2>

        {error && (
          <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Role/Position *
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Frontend Developer, Data Scientist, Product Manager"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Interview Type
            </label>
            <select
              value={interviewType}
              onChange={(e) =>
                setInterviewType(
                  e.target.value as "technical" | "behavioral" | "mixed"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mixed">Mixed (Technical + Behavioral)</option>
              <option value="technical">Technical Only</option>
              <option value="behavioral">Behavioral Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Experience Level
            </label>
            <select
              value={level}
              onChange={(e) =>
                setLevel(e.target.value as "entry" | "mid" | "senior")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (2-5 years)</option>
              <option value="senior">Senior Level (5+ years)</option>
            </select>
          </div>

          {(interviewType === "technical" || interviewType === "mixed") && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g., React, Node.js, PostgreSQL, AWS"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Interview Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 minutes (Quick)</option>
              <option value={15}>15 minutes (Standard)</option>
              <option value={20}>20 minutes (Detailed)</option>
              <option value={30}>30 minutes (Comprehensive)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleStartInterview}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          disabled={callStatus === CallStatus.CONNECTING}
        >
          {callStatus === CallStatus.CONNECTING
            ? "Starting Interview..."
            : "Start Interview"}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="AI Interviewer"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer - Sarah</h3>
          <p className="text-sm text-gray-600">
            {interviewConfig?.type} Interview • {interviewConfig?.duration} min
          </p>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
            <p className="text-sm text-gray-600">{interviewConfig?.role}</p>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <div className="status-display mb-4 text-center">
        <p className="text-sm text-gray-600">
          Status: <span className="font-semibold">{callStatus}</span>
          {callStatus === CallStatus.ACTIVE && interviewStartTime && (
            <span className="ml-2">
              • {Math.floor((Date.now() - interviewStartTime) / 1000 / 60)}m
              elapsed
            </span>
          )}
        </p>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className="relative btn-call"
            onClick={handleStartInterview}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />
            <span>
              {callStatus === CallStatus.CONNECTING
                ? "Connecting..."
                : callStatus === CallStatus.FINISHED
                ? "Interview Complete"
                : "Start Interview"}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End Interview
          </button>
        )}
      </div>

      {callStatus === CallStatus.FINISHED && (
        <div className="mt-4 text-center">
          <p className="text-green-600 font-medium">
            Interview completed! Generating your report...
          </p>
        </div>
      )}
    </>
  );
};

export default Agent;
