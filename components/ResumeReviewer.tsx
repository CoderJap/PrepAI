"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Award,
  Target,
  ArrowRight,
  Zap,
  Brain,
  Eye,
} from "lucide-react";

interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  atsCompatibility: number;
  keywordAnalysis: {
    missing: string[];
    present: string[];
  };
  sections: {
    name: string;
    score: number;
    feedback: string;
  }[];
}

interface ResumeReviewerProps {
  userId?: string | null;
}

export default function ResumeReviewer({ userId }: ResumeReviewerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (
      selectedFile.type === "application/pdf" ||
      selectedFile.type === "application/msword" ||
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF or Word document");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const analyzeResume = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    try {
      console.log("Starting resume analysis...", file.name);

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("userId", userId || "anonymous");

      console.log("Calling API...");
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("API response data:", result);

      if (!result.analysis) {
        throw new Error("No analysis data received from API");
      }

      setAnalysis(result.analysis);
      console.log("Analysis set successfully");
    } catch (err) {
      console.error("Resume analysis failed:", err);
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 55) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85)
      return "bg-gradient-to-br from-emerald-500/20 to-green-500/10";
    if (score >= 70) return "bg-gradient-to-br from-blue-500/20 to-cyan-500/10";
    if (score >= 55)
      return "bg-gradient-to-br from-amber-500/20 to-orange-500/10";
    return "bg-gradient-to-br from-red-500/20 to-pink-500/10";
  };

  const getProgressWidth = (score: number) => `${score}%`;

  if (!analysis) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Modern Header */}
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-6xl font-bold bg-gradient-to-r  from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Resume AI Reviewer
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Get instant AI-powered feedback and optimization suggestions for
              your resume
            </p>
          </div>
        </div>

        {/* Modern Upload Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            <div
              className={`
                relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-500 group
                ${
                  file
                    ? "border-emerald-500/50 bg-gradient-to-r from-emerald-500/5 to-green-500/5"
                    : "border-gray-600/50 hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5"
                }
              `}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="space-y-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-emerald-400">
                      {file.name}
                    </h3>
                    <p className="text-lg text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI
                      analysis
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-400 hover:text-blue-300 underline text-lg transition-colors"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-700/30 rounded-2xl group-hover:bg-purple-500/10 transition-all duration-300">
                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-3">
                        Drop your resume here
                      </h3>
                      <p className="text-lg text-gray-400">
                        Or click to browse files
                      </p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                    >
                      <Upload className="w-6 h-6 mr-3" />
                      Select Resume
                    </button>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, DOCX • Max 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-lg">{error}</span>
              </div>
            )}

            {file && (
              <div className="mt-8">
                <button
                  onClick={analyzeResume}
                  disabled={analyzing}
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-5 px-8 rounded-xl hover:from-emerald-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 font-bold text-xl flex items-center justify-center space-x-3 shadow-lg hover:shadow-emerald-500/25"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-7 h-7 animate-spin" />
                      <span>AI is analyzing your resume...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-7 h-7" />
                      <span>Analyze with AI</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header with Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            AI Analysis Complete
          </h1>
          <p className="text-xl text-gray-400">
            Your resume has been analyzed by our AI
          </p>
        </div>
        <button
          onClick={() => {
            setAnalysis(null);
            setFile(null);
            setError(null);
          }}
          className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
        >
          Analyze New Resume
        </button>
      </div>

      {/* Score Hero Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div
            className={`relative ${getScoreBg(
              analysis.overallScore
            )} backdrop-blur-sm border border-gray-700/50 rounded-3xl p-10 shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Overall Score
                </h3>
                <p className="text-gray-400 text-lg">AI Resume Rating</p>
              </div>
              <Award
                className={`w-16 h-16 ${getScoreColor(analysis.overallScore)}`}
              />
            </div>
            <div className="space-y-4">
              <div
                className={`text-7xl font-black ${getScoreColor(
                  analysis.overallScore
                )}`}
              >
                {analysis.overallScore}
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${
                    analysis.overallScore >= 85
                      ? "from-emerald-500 to-green-400"
                      : analysis.overallScore >= 70
                      ? "from-blue-500 to-cyan-400"
                      : analysis.overallScore >= 55
                      ? "from-amber-500 to-orange-400"
                      : "from-red-500 to-pink-400"
                  } transition-all duration-1000 ease-out`}
                  style={{ width: getProgressWidth(analysis.overallScore) }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div
            className={`relative ${getScoreBg(
              analysis.atsCompatibility
            )} backdrop-blur-sm border border-gray-700/50 rounded-3xl p-10 shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  ATS Score
                </h3>
                <p className="text-gray-400 text-lg">System Compatibility</p>
              </div>
              <Eye
                className={`w-16 h-16 ${getScoreColor(
                  analysis.atsCompatibility
                )}`}
              />
            </div>
            <div className="space-y-4">
              <div
                className={`text-7xl font-black ${getScoreColor(
                  analysis.atsCompatibility
                )}`}
              >
                {analysis.atsCompatibility}
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${
                    analysis.atsCompatibility >= 85
                      ? "from-emerald-500 to-green-400"
                      : analysis.atsCompatibility >= 70
                      ? "from-blue-500 to-cyan-400"
                      : analysis.atsCompatibility >= 55
                      ? "from-amber-500 to-orange-400"
                      : "from-red-500 to-pink-400"
                  } transition-all duration-1000 ease-out`}
                  style={{ width: getProgressWidth(analysis.atsCompatibility) }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Analysis */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center mb-8">
            <TrendingUp className="w-8 h-8 mr-4 text-blue-400" />
            <h3 className="text-3xl font-bold text-white">Section Breakdown</h3>
          </div>
          <div className="grid gap-6">
            {analysis.sections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-800/30 border border-gray-600/30 rounded-2xl p-6 hover:bg-gray-700/30 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-2xl font-bold text-white">
                    {section.name}
                  </h4>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-4xl font-black ${getScoreColor(
                        section.score
                      )}`}
                    >
                      {section.score}
                    </span>
                    <span className="text-gray-400 text-lg">/100</span>
                  </div>
                </div>
                <div className="mb-4 w-full bg-gray-700/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      section.score >= 85
                        ? "from-emerald-500 to-green-400"
                        : section.score >= 70
                        ? "from-blue-500 to-cyan-400"
                        : section.score >= 55
                        ? "from-amber-500 to-orange-400"
                        : "from-red-500 to-pink-400"
                    } transition-all duration-1000 ease-out`}
                    style={{ width: getProgressWidth(section.score) }}
                  ></div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {section.feedback}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-8 h-8 mr-4 text-emerald-400" />
              <h3 className="text-3xl font-bold text-emerald-400">
                Key Strengths
              </h3>
            </div>
            <div className="space-y-4">
              {analysis.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10"
                >
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {strength}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Improvements */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-amber-500/5 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 mr-4 text-amber-400" />
              <h3 className="text-3xl font-bold text-amber-400">
                Improvement Areas
              </h3>
            </div>
            <div className="space-y-4">
              {analysis.weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10"
                >
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {weakness}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-8">
            Keyword Analysis
          </h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-bold text-emerald-400 mb-6">
                Found Keywords
              </h4>
              <div className="flex flex-wrap gap-3">
                {analysis.keywordAnalysis.present.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full font-medium text-lg"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-2xl font-bold text-amber-400 mb-6">
                Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-3">
                {analysis.keywordAnalysis.missing.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-full font-medium text-lg"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-blue-500/5 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center mb-8">
            <Zap className="w-8 h-8 mr-4 text-blue-400" />
            <h3 className="text-3xl font-bold text-blue-400">
              AI Recommendations
            </h3>
          </div>
          <div className="grid gap-4">
            {analysis.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-blue-500/5 rounded-xl border border-blue-500/10 hover:bg-blue-500/10 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-200 text-lg leading-relaxed">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
