// app/api/interviews/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { generateInterviewReport } from "@/lib/report-generator";

export async function POST(req: NextRequest) {
  try {
    const interviewData = await req.json();

    console.log("Received interview data:", {
      userId: interviewData.userId,
      userName: interviewData.userName,
      messagesCount: interviewData.messages?.length,
      config: interviewData.config,
    });

    // Validate required data
    if (!interviewData.userId || !interviewData.config) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Save interview to Firestore
    const interviewDoc = {
      userId: interviewData.userId,
      userName: interviewData.userName,
      config: interviewData.config,
      messages: interviewData.messages || [],
      startTime: new Date(interviewData.startTime || Date.now()),
      endTime: new Date(interviewData.endTime || Date.now()),
      duration: interviewData.duration || 0,
      createdAt: new Date(),
      status: "completed",
    };

    const interviewRef = await db.collection("interviews").add(interviewDoc);
    console.log("Interview saved with ID:", interviewRef.id);

    // Generate AI analysis report in background
    try {
      const report = await generateInterviewReport(interviewData);
      await db.collection("interviews").doc(interviewRef.id).update({ report });
      console.log("Report generated and saved");
    } catch (reportError) {
      console.error("Failed to generate report:", reportError);
      // Continue anyway, report can be generated later
    }

    return NextResponse.json({
      success: true,
      interviewId: interviewRef.id,
    });
  } catch (error) {
    console.error("Failed to save interview:", error);
    return NextResponse.json(
      {
        error: "Failed to save interview",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
