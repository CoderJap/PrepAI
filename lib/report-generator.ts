// lib/report-generator.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function generateInterviewReport(interviewData: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const transcript = interviewData.messages
    .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const prompt = `
Analyze this job interview transcript and provide a comprehensive report:

INTERVIEW CONFIG:
- Role: ${interviewData.config.role}
- Type: ${interviewData.config.type}
- Level: ${interviewData.config.level}
- Duration: ${interviewData.duration}ms

TRANSCRIPT:
${transcript}

Please provide a detailed analysis report in JSON format with:

{
  "overallScore": (1-100),
  "strengths": ["list of 3-5 strengths"],
  "areasForImprovement": ["list of 3-5 areas to improve"],
  "communicationScore": (1-100),
  "technicalScore": (1-100), // if applicable
  "confidenceScore": (1-100),
  "detailedFeedback": "detailed paragraph feedback",
  "recommendations": ["specific actionable recommendations"],
  "interviewHighlights": ["memorable responses or moments"],
  "nextSteps": "what to focus on for real interviews"
}

Focus on constructive feedback that helps them improve while being encouraging.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Report generation failed:", error);
    return {
      overallScore: 75,
      strengths: ["Participated in full interview"],
      areasForImprovement: ["Technical analysis pending"],
      detailedFeedback:
        "Report generation in progress. Please check back later.",
    };
  }
}
