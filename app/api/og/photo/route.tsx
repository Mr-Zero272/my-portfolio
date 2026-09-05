import { ImageResponse } from "next/og";

import { Photo } from "@/components/og/photo";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const image = searchParams.get("image") || "";
  const label = searchParams.get("label") || "Label";
  const title = searchParams.get("title") || "Title";
  const brand = searchParams.get("brand") || "Brand";
  const logo = searchParams.get("logo") || "";

  return new ImageResponse(
    <Photo
      image={image}
      label={label}
      title={title}
      brand={brand}
      logo={logo}
    />,
    { width: 1200, height: 630 }
  );
}