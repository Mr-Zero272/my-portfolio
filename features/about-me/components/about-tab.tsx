'use client';

import CopyToClipBoardButton from '@/components/ui/copy-to-clipboard-button';
import { IProfileResponse } from '@/models/Profile';
import Link from 'next/link';

interface AboutTabProps {
  profile: IProfileResponse;
}

const AboutTab = ({ profile: profileInfo }: AboutTabProps) => {
  const { profile } = profileInfo;

  return (
    <div>
      <>
        <h1 className="mb-3 text-2xl font-bold tracking-wider">A little bit about me</h1>
        <p className="mb-7 text-muted-foreground">{profile?.description}</p>
        <ul>
          <li className="mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Name</p>
            <p className="text-base font-semibold md:text-xl">{profile?.name}</p>
          </li>
          <li className="mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Nationality</p>
            <p className="text-base font-semibold md:text-xl">{profile?.nationality}</p>
          </li>
          <li className="group mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Phone</p>
            <p className="text-base font-semibold md:text-xl">{profile?.phone}</p>
            <CopyToClipBoardButton text={profile?.phone || 'Phone number'} />
          </li>
          <li className="group mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Email</p>
            <p className="overflow-hidden text-base font-semibold text-ellipsis md:text-xl">{profile?.userId?.email}</p>
            <CopyToClipBoardButton text={profile?.userId?.email} />
          </li>
          <li className="mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Freelance</p>
            <p className="text-base font-semibold md:text-xl">
              {profile?.freelanceAvailable ? 'Available' : 'Not available'}
            </p>
          </li>
          <li className="group mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">LinkedIn</p>
            <Link
              href="https://www.linkedin.com/in/mr-zero272/"
              className="text-base font-semibold text-primary hover:underline md:text-xl"
            >
              Go to my LinkedIn
            </Link>
            <CopyToClipBoardButton text="https://www.linkedin.com/in/mr-zero272/" />
          </li>
          <li className="mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Language</p>
            <p className="text-base font-semibold md:text-xl">
              {profile?.languages?.length === 0 ? 'English, Vietnamese' : profile?.languages?.join(', ')}
            </p>
          </li>
        </ul>
      </>
    </div>
  );
};

export default AboutTab;
