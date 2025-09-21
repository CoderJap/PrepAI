// app/api/interviews/save/route.ts
import { db } from "@/lib/firebase-admin";
import { generateInterviewReport } from "@/lib/report-generator";

export async function POST(req: Request) {
  try {
    const interviewData = await req.json();

    // Save interview to Firestore
    const interviewRef = await db.collection("interviews").add({
      ...interviewData,
      createdAt: new Date(),
      status: "completed",
    });

    // Generate AI analysis report
    const report = await generateInterviewReport(interviewData);

    // Save report
    await db.collection("interviews").doc(interviewRef.id).update({
      report,
    });

    return Response.json({
      success: true,
      interviewId: interviewRef.id,
    });
  } catch (error) {
    console.error("Failed to save interview:", error);
    return Response.json(
      { error: "Failed to save interview" },
      { status: 500 }
    );
  }
}
