import { ImageResponse } from "next/og";

import { Blog } from "@/components/og/blog";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "Engineering";
  const title = searchParams.get("title") || "How we generate social images at the edge";
  const excerpt = searchParams.get("excerpt") || "A deep dive into Satori, the next/og runtime, and shipping fast cards.";
  const author = searchParams.get("author") || "Ada Lovelace";
  const meta = searchParams.get("meta") || "Jun 5, 2026 · 6 min read";
  const avatar = searchParams.get("avatar") || "https://example.com/avatar.png";
  const brand = searchParams.get("brand") || "ogimagecn";
  const logo = searchParams.get("logo") || "https://example.com/logo.png";

  return new ImageResponse(
    <Blog
      author={author}
      category={category}
      excerpt={excerpt}
      meta={meta}
      title={title}
      brand={brand}
      avatar={avatar}
      logo={logo}
    />,
    { width: 1200, height: 630 }
  );
}