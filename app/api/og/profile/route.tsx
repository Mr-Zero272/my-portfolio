import { ImageResponse } from "next/og";

import { Profile } from "@/components/og/profile";

export function GET(reqest: Request) {
  const { searchParams } = new URL(reqest.url);
  const name = searchParams.get("name") || "Ada Lovelace";
  const role = searchParams.get("role") || "Founder & Engineer";
  const bio = searchParams.get("bio") || "Building tools for the open web.";
  const website = searchParams.get("website") || "ada.dev";
  const avatar = searchParams.get("avatar") || "https://example.com/avatar.png";

  return new ImageResponse(
    <Profile
      name={name}
      role={role}
      bio={bio}
      website={website}
      avatar={avatar}
    />,
    { width: 1200, height: 630 }
  );
}