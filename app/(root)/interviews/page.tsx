"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Interview {
  id: string;
  config: {
    role: string;
    type: string;
    level: string;
  };
  createdAt: any;
  duration: number;
  report?: any;
}

export default function InterviewHistory() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/interviews/list");
      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews);
      }
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading interviews...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Interviews</h1>
        <button
          onClick={() => router.push("/interview")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          New Interview
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No interviews yet</p>
          <button
            onClick={() => router.push("/interview")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start Your First Interview
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {interview.config.role}
                  </h3>
                  <p className="text-gray-600">
                    {interview.config.type} • {interview.config.level} level
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      interview.createdAt.toDate()
                    ).toLocaleDateString()}{" "}
                    •{Math.floor(interview.duration / 1000 / 60)} minutes
                  </p>
                </div>
                <button
                  onClick={() =>
                    router.push(`/interviews/${interview.id}/report`)
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
