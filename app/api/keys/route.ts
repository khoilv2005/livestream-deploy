import { NextRequest, NextResponse } from "next/server";
import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";

export async function GET() {
  try {
    const self = await getSelf();
    const stream = await getStreamByUserId(self.id);
    
    if (!stream) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      serverUrl: stream.serverUrl,
      streamKey: stream.streamKey,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const self = await getSelf();
    const stream = await getStreamByUserId(self.id);
    
    if (!stream) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }

    // Xử lý POST request logic ở đây
    return NextResponse.json({
      message: "Keys updated successfully",
      serverUrl: stream.serverUrl,
      streamKey: stream.streamKey,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 