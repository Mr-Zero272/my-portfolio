import { PageHeader } from '@/components/shared/page-header';
import { ScrollToTopButton } from '@/components/shared/scroll-to-top-button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Changelog page',
};

const ChangelogPage = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center px-6">
      <div className="w-full max-w-[37em] py-6">
        <PageHeader title="Changelog" description="Latest updates and announcements" />

        <article className="typeset typeset-docs max-w-[37em]">
          <section>
            <h2>September 2026</h2>
            <h3>The update for my-portfolio has officially been deployed to production.</h3>
            <p>
              Hi everyone, i&apos;m excited to announce that the update for my-portfolio has
              officially been deployed to production. Although there are only minor UI changes, the
              project&apos;s core has undergone significant transformation; as you can clearly see,
              even while using the free-tier database service, the application achieves impressively
              fast page load speeds.
            </p>

            <h3>Major Enhancements</h3>
            <ul>
              <li>Optimized the database query for faster page load speeds</li>
              <li>Reduced the app&apos;s overall bundle size through dependency optimization</li>
              <li>Improved server-side rendering for better SEO</li>
              <li>Fixed several bugs and UI issues</li>
              <li>
                In particular, the project structure has also changed significantly compared to the
                previous v1 version.
              </li>
            </ul>

            <h3>Looking Ahead</h3>
            <p>
              Although the current version is stable, I have some exciting plans for future updates.
              I intend to further improve performance, expand the project showcase, and refine the
              user interface. Additionally, I plan to implement a robust testing infrastructure to
              ensure high reliability and maintainability.
            </p>
            <p>
              Thank you for taking the time to check out the new version. I welcome any feedback or
              suggestions you may have!
            </p>
          </section>
        </article>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default ChangelogPage;
