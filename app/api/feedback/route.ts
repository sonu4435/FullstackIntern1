// backend/api/feedback.ts

import { NextResponse } from "next/server";

let feedbackEntries: { name: string; feedback: string }[] = [];
const rateLimitMap = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const { name, feedback } = await req.json();

    if (!name || !feedback) {
      return NextResponse.json(
        { message: "Name and feedback are required" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for") ||
      req.headers.get("cf-connecting-ip");

    if (!ip) {
      return NextResponse.json(
        { message: "IP address not found" },
        { status: 400 }
      );
    }

    if (rateLimitMap.get(ip) && Date.now() - rateLimitMap.get(ip)! < 10000) {
      return NextResponse.json(
        { message: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const newEntry = { name, feedback };
    feedbackEntries.push(newEntry);
    console.log("Feedback received:", newEntry);
    rateLimitMap.set(ip, Date.now());

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(feedbackEntries, { status: 200 });
  } catch (error) {
    console.error("Error fetching feedback entries:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}