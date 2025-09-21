// app/api/interviews/list/route.ts
import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching interviews for user:", user.id);

    const interviews = await db
      .collection("interviews")
      .where("userId", "==", user.id)
      .orderBy("createdAt", "desc")
      .get();

    const interviewData = interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Found interviews:", interviewData.length);

    return NextResponse.json({ interviews: interviewData });
  } catch (error) {
    console.error("Failed to fetch interviews:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch interviews",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
