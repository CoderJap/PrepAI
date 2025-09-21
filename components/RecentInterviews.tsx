// "use client";

// import { useState, useRef } from 'react';
// import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// interface ResumeAnalysis {
//   overallScore: number;
//   strengths: string[];
//   weaknesses: string[];
//   suggestions: string[];
//   atsCompatibility: number;
//   keywordAnalysis: {
//     missing: string[];
//     present: string[];
//   };
//   sections: {
//     name: string;
//     score: number;
//     feedback: string;
//   }[];
// }

// interface ResumeReviewerProps {
//   userId?: string;
// }

// export default function ResumeReviewer({ userId }: ResumeReviewerProps) {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileSelect = (selectedFile: File) => {
//     if (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/msword' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//       setFile(selectedFile);
//       setError(null);
//     } else {
//       setError('Please upload a PDF or Word document');
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile) {
//       handleFileSelect(droppedFile);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       handleFileSelect(selectedFile);
//     }
//   };

//   const analyzeResume = async () => {
//     if (!file) return;

//     setAnalyzing(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append('resume', file);
//       formData.append('userId', userId || 'anonymous');

//       const response = await fetch('/api/resume/analyze', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to analyze resume');
//       }

//       const result = await response.json();
//       setAnalysis(result.analysis);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Analysis failed');
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 80) return 'text-green-400';
//     if (score >= 60) return 'text-yellow-400';
//     return 'text-red-400';
//   };

//   const getScoreBg = (score: number) => {
//     if (score >= 80) return 'bg-green-400/20';
//     if (score >= 60) return 'bg-yellow-400/20';
//     return 'bg-red-400/20';
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white min-h-screen">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">Resume Reviewer</h1>
//         <p className="text-gray-400">Upload your resume for AI-powered analysis and improvement suggestions</p>
//       </div>

//       {!analysis ? (
//         <div className="space-y-6">
//           {/* File Upload Area */}
//           <div
//             className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//               file ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-gray-500'
//             }`}
//             onDragOver={handleDragOver}
//             onDrop={handleDrop}
//           >
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".pdf,.doc,.docx"
//               onChange={handleFileChange}
//               className="hidden"
//             />

//             {file ? (
//               <div className="flex flex-col items-center space-y-3">
//                 <CheckCircle className="w-12 h-12 text-green-400" />
//                 <div>
//                   <p className="text-lg font-medium text-green-400">{file.name}</p>
//                   <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
//                 </div>
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="text-blue-400 hover:text-blue-300 text-sm underline"
//                 >
//                   Choose a different file
//                 </button>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center space-y-3">
//                 <Upload className="w-12 h-12 text-gray-400" />
//                 <div>
//                   <p className="text-lg font-medium">Drop your resume here</p>
//                   <p className="text-sm text-gray-400">or click to browse</p>
//                 </div>
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Select File
//                 </button>
//                 <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX (max 10MB)</p>
//               </div>
//             )}
//           </div>

//           {error && (
//             <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
//               <AlertCircle className="w-5 h-5 text-red-400" />
//               <span className="text-red-300">{error}</span>
//             </div>
//           )}

//           {file && (
//             <button
//               onClick={analyzeResume}
//               disabled={analyzing}
//               className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
//             >
//               {analyzing ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   <span>Analyzing Resume...</span>
//                 </>
//               ) : (
//                 <>
//                   <FileText className="w-5 h-5" />
//                   <span>Analyze Resume</span>
//                 </>
//               )}
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {/* Overall Score */}
//           <div className="bg-gray-800 rounded-lg p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-2xl font-bold">Overall Analysis</h2>
//               <button
//                 onClick={() => {
//                   setAnalysis(null);
//                   setFile(null);
//                 }}
//                 className="text-gray-400 hover:text-white text-sm"
//               >
//                 Analyze Another Resume
//               </button>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div className={`${getScoreBg(analysis.overallScore)} rounded-lg p-4`}>
//                 <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
//                 <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
//                   {analysis.overallScore}/100
//                 </div>
//               </div>

//               <div className={`${getScoreBg(analysis.atsCompatibility)} rounded-lg p-4`}>
//                 <h3 className="text-lg font-semibold mb-2">ATS Compatibility</h3>
//                 <div className={`text-4xl font-bold ${getScoreColor(analysis.atsCompatibility)}`}>
//                   {analysis.atsCompatibility}/100
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section Scores */}
//           <div className="bg-gray-800 rounded-lg p-6">
//             <h3 className="text-xl font-bold mb-4">Section Analysis</h3>
//             <div className="space-y-4">
//               {analysis.sections.map((section, index) => (
//                 <div key={index} className="bg-gray-700 rounded-lg p-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <h4 className="font-semibold">{section.name}</h4>
//                     <span className={`font-bold ${getScoreColor(section.score)}`}>
//                       {section.score}/100
//                     </span>
//                   </div>
//                   <p className="text-gray-300 text-sm">{section.feedback}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Strengths and Weaknesses */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-gray-800 rounded-lg p-6">
//               <h3 className="text-xl font-bold mb-4 text-green-400">Strengths</h3>
//               <ul className="space-y-2">
//                 {analysis.strengths.map((strength, index) => (
//                   <li key={index} className="flex items-start space-x-2">
//                     <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
//                     <span className="text-gray-300">{strength}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="bg-gray-800 rounded-lg p-6">
//               <h3 className="text-xl font-bold mb-4 text-red-400">Areas for Improvement</h3>
//               <ul className="space-y-2">
//                 {analysis.weaknesses.map((weakness, index) => (
//                   <li key={index} className="flex items-start space-x-2">
//                     <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
//                     <span className="text-gray-300">{weakness}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Keywords Analysis */}
//           <div className="bg-gray-800 rounded-lg p-6">
//             <h3 className="text-xl font-bold mb-4">Keyword Analysis</h3>
//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="font-semibold text-green-400 mb-2">Present Keywords</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {analysis.keywordAnalysis.present.map((keyword, index) => (
//                     <span key={index} className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-sm">
//                       {keyword}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-yellow-400 mb-2">Missing Keywords</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {analysis.keywordAnalysis.missing.map((keyword, index) => (
//                     <span key={index} className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded text-sm">
//                       {keyword}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Suggestions */}
//           <div className="bg-gray-800 rounded-lg p-6">
//             <h3 className="text-xl font-bold mb-4">Improvement Suggestions</h3>
//             <div className="space-y-3">
//               {analysis.suggestions.map((suggestion, index) => (
//                 <div key={index} className="flex items-start space-x-3">
//                   <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
//                     {index + 1}
//                   </div>
//                   <p className="text-gray-300">{suggestion}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
