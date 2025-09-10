import { generateSitemap } from "@/lib/sitemap-generator";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Sử dụng function chung thay vì fetch nội bộ
    const sitemapXml = await generateSitemap();

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "X-Robots-Tag": "all",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        // Cache trong production
        ...(process.env.NODE_ENV === "production"
          ? { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" }
          : { "Cache-Control": "no-cache" }),
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return error response instead of redirect
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
