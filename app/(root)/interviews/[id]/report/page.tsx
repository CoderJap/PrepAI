// app/interviews/[id]/report/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function InterviewReport() {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInterviewReport(params.id as string);
    }
  }, [params.id]);

  const fetchInterviewReport = async (interviewId: string) => {
    try {
      const response = await fetch(`/api/interviews/${interviewId}`);
      if (response.ok) {
        const data = await response.json();
        setInterview(data.interview);
      }
    } catch (error) {
      console.error("Failed to fetch interview report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading report...</div>;
  }

  if (!interview) {
    return <div className="text-center p-8">Interview not found</div>;
  }

  const report = interview.report;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => router.push("/interviews")}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Interviews
        </button>
        <h1 className="text-3xl font-bold mt-2">Interview Report</h1>
        <p className="text-gray-600">
          {interview.config.role} • {interview.config.type} •
          {new Date(interview.createdAt.toDate()).toLocaleDateString()}
        </p>
      </div>

      {report && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Overall Score</h2>
            <div className="text-4xl font-bold text-blue-600">
              {report.overallScore}/100
            </div>
          </div>

          {/* Scores Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold">Communication</h3>
              <div className="text-2xl font-bold text-green-600">
                {report.communicationScore}/100
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold">Technical</h3>
              <div className="text-2xl font-bold text-purple-600">
                {report.technicalScore}/100
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold">Confidence</h3>
              <div className="text-2xl font-bold text-orange-600">
                {report.confidenceScore}/100
              </div>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Detailed Feedback</h2>
            <p className="text-gray-700 leading-relaxed">
              {report.detailedFeedback}
            </p>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                Strengths
              </h3>
              <ul className="space-y-2">
                {report.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {report.areasForImprovement.map(
                  (area: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{area}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Recommendations
            </h3>
            <ul className="space-y-2">
              {report.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
            <p className="text-gray-700">{report.nextSteps}</p>
          </div>
        </div>
      )}
    </div>
  );
}
