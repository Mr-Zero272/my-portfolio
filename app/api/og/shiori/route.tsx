import { ImageResponse } from "next/og";

import { Shiori } from "@/components/og/shiori";
import { env } from "process";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "A beautifully personal portfolio app";
  const background = searchParams.get("background") || "#faf6f1";
  const titleColor = searchParams.get("titleColor") || "#8b7e74";
  const logo = searchParams.get("logo") || `${env.NEXT_PUBLIC_SITE_URL}/piti.svg`
  const brand = searchParams.get("brand") || "Piti";
  const brandColor = searchParams.get("brandColor") || "#1a1a1a";

  return new ImageResponse(
    <Shiori
      title={title}
      background={background}
      titleColor={titleColor}
      logo={logo}
      brand={brand}
      brandColor={brandColor}
    />,
    { width: 1200, height: 630 }
  );
}