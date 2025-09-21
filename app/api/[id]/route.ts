// app/api/interviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await db.collection("interviews").doc(params.id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      interview: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error("Failed to fetch interview:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch interview",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
