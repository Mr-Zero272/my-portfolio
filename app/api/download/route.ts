// app/api/file-download/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Lấy URL từ query parameter
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "Missing URL parameter" },
        { status: 400 },
      );
    }

    // Kiểm tra URL hợp lệ
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch (error) {
      console.error("Invalid URL:", error);
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch file từ URL gốc
    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status} ${response.statusText}` },
        { status: response.status },
      );
    }

    // Lấy content type từ response gốc
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentLength = response.headers.get("content-length");

    // Tạo response mới với CORS headers
    const data = await response.arrayBuffer();

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    // Thêm cache control nếu cần
    headers.set("Cache-Control", "public, max-age=3600");

    return new NextResponse(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
