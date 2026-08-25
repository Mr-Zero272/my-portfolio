import { CopyButton } from '@/components/shared/copy-button';
import StateWrapper from '@/components/shared/state-wrapper';
import { useProfileMe } from '@/features/profile/hooks';
import Link from 'next/link';

export const AboutTab = () => {
  const { data, isLoading, error } = useProfileMe({ isPublic: true });
  // const { data: session, isPending } = useSession();

  return (
    <div>
      <h1 className="mb-3 text-2xl font-bold tracking-wider">A little bit more about me</h1>
      <p className="text-muted-foreground mb-7">{isLoading ? 'Loading...' : data?.description}</p>
      <StateWrapper data={data} isLoading={isLoading} error={error}>
        {(profile) => {
          return (
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
                <CopyButton
                  variant="ghost"
                  size="icon-sm"
                  className="ml-1"
                  text={profile?.phone || 'Phone number'}
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
                  {profile?.freelanceAvailable ? 'Available' : 'Not available'}
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
                  {profile?.languages?.length === 0
                    ? 'English, Vietnamese'
                    : profile?.languages?.join(', ')}
                </p>
              </li>
            </ul>
          );
        }}
      </StateWrapper>
    </div>
  );
};
