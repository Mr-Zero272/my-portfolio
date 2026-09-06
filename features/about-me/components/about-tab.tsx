import { CopyButton } from '@/components/shared/copy-button';
import type { ProfileWithAllRelations } from '@/features/profile/types';
import Link from 'next/link';

type AboutTabProps = {
  profile: ProfileWithAllRelations | null;
};

/**
 * About details. Data is fetched server-side (public API) and passed as props.
 */
export const AboutTab = ({ profile }: AboutTabProps) => {
  return (
    <div>
      <h1 className="mb-3 text-2xl font-bold tracking-wider">A little bit more about me</h1>
      <p className="text-muted-foreground mb-7">
        {profile?.description ?? 'Update your profile from the dashboard to tell your story.'}
      </p>
      {!profile ? (
        <p className="text-muted-foreground">No profile yet — update it from the dashboard.</p>
      ) : (
        <ul>
          <li className="mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Name</p>
            <p className="text-base font-semibold md:text-xl">{profile.name}</p>
          </li>
          <li className="mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Nationality</p>
            <p className="text-base font-semibold md:text-xl">{profile.nationality}</p>
          </li>
          <li className="group mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Phone</p>
            <p className="text-base font-semibold md:text-xl">{profile.phone}</p>
            <CopyButton
              variant="ghost"
              size="icon-sm"
              className="ml-1"
              text={profile.phone || 'Phone number'}
            />
          </li>
          <li className="group mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Email</p>
            <p className="overflow-hidden text-base font-semibold text-ellipsis md:text-xl">
              pitithuong@gmail.com
            </p>
            <CopyButton
              variant="ghost"
              size="icon-sm"
              className="ml-1"
              text={'pitithuong@gmail.com'}
            />
          </li>
          <li className="mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Freelance</p>
            <p className="text-base font-semibold md:text-xl">
              {profile.freelanceAvailable ? 'Available' : 'Not available'}
            </p>
          </li>
          <li className="group mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">LinkedIn</p>
            <Link
              href="https://www.linkedin.com/in/mr-zero272/"
              className="text-primary text-base font-semibold hover:underline md:text-xl"
            >
              Go to my LinkedIn
            </Link>
            <CopyButton
              variant="ghost"
              size="icon-sm"
              className="ml-1"
              text="https://www.linkedin.com/in/mr-zero272/"
            />
          </li>
          <li className="mb-2 flex">
            <p className="w-28 text-gray-600 md:w-40">Language</p>
            <p className="text-base font-semibold md:text-xl">
              {profile.languages && profile.languages.length > 0
                ? profile.languages.join(', ')
                : 'English, Vietnamese'}
            </p>
          </li>
        </ul>
      )}
    </div>
  );
};
