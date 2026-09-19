import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { contentTypeForFile, resolveUploadPath } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, context: RouteContext) {
  const { path: segments } = await context.params;
  const filePath = resolveUploadPath(segments);
  if (!filePath) {
    return new NextResponse("Not found", { status: 404 });
  }

  const base = segments[segments.length - 1] || "";
  if (base.startsWith(".")) {
    return new NextResponse("Not found", { status: 404 });
  }

  let fileStat;
  try {
    fileStat = await stat(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!fileStat.isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const stream = createReadStream(filePath);
  const body = Readable.toWeb(stream) as ReadableStream;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentTypeForFile(filePath),
      "Content-Length": String(fileStat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
