// app/api/resume/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    console.log("Resume analysis started");
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("File received:", file.name, file.type);

    // For now, let's create a mock analysis to test the UI
    // You can replace this with actual file parsing later
    const mockAnalysis = {
      overallScore: 82,
      atsCompatibility: 75,
      strengths: [
        "Clear and professional formatting",
        "Strong technical skills section",
        "Relevant work experience listed",
        "Good use of action verbs",
        "Contact information is complete",
      ],
      weaknesses: [
        "Missing quantifiable achievements",
        "No professional summary section",
        "Could benefit from more industry keywords",
        "Skills section could be better organized",
        "Missing education details",
      ],
      suggestions: [
        "Add a professional summary at the top",
        "Include quantifiable metrics in your achievements",
        "Optimize for ATS with better keyword usage",
        "Reorganize skills by relevance and proficiency",
        "Add more specific technical certifications",
        "Include links to portfolio or LinkedIn profile",
        "Use consistent formatting throughout",
      ],
      keywordAnalysis: {
        present: [
          "JavaScript",
          "React",
          "Node.js",
          "Project Management",
          "Team Leadership",
        ],
        missing: ["API", "Database", "Cloud", "Testing", "Agile", "DevOps"],
      },
      sections: [
        {
          name: "Contact Information",
          score: 90,
          feedback:
            "Complete contact information with professional email address",
        },
        {
          name: "Professional Summary",
          score: 40,
          feedback:
            "Missing professional summary - add a 2-3 line overview of your experience",
        },
        {
          name: "Work Experience",
          score: 85,
          feedback:
            "Good work experience section but add more quantifiable achievements",
        },
        {
          name: "Skills",
          score: 75,
          feedback:
            "Good technical skills listed but could be better organized by category",
        },
        {
          name: "Education",
          score: 70,
          feedback:
            "Education section present but could include more relevant coursework or certifications",
        },
      ],
    };

    console.log("Sending mock analysis");
    return NextResponse.json({ analysis: mockAnalysis });
  } catch (error) {
    console.error("Resume analysis failed:", error);
    return NextResponse.json(
      {
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
