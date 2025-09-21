import { useEffect, useState } from 'react';

interface TagWithCount {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TagStats {
  totalTags: number;
  totalPosts: number;
  tagsWithMostPosts: Array<{
    name: string;
    slug: string;
    postCount: number;
  }>;
}

export const TagStatistics = () => {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [stats, setStats] = useState<TagStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tags with post count
        const tagsResponse = await fetch('/api/tags/with-count?limit=20');
        const tagsData = await tagsResponse.json();

        // Fetch tag statistics
        const statsResponse = await fetch('/api/tags/stats');
        const statsData = await statsResponse.json();

        if (tagsData.status === 'success') {
          setTags(tagsData.data);
        }

        if (statsData.status === 'success') {
          setStats(statsData.data);
        }
      } catch (err) {
        setError('Failed to fetch tag data');
        console.error('Error fetching tag data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading tag statistics...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Overview Stats */}
      {stats && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Tags</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTags}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Posts</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalPosts}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-700">Avg Posts/Tag</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalTags > 0 ? (stats.totalPosts / stats.totalTags).toFixed(1) : 0}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Tags */}
        {stats && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">Top 5 Tags by Post Count</h2>
            <div className="space-y-3">
              {stats.tagsWithMostPosts.map((tag, index) => (
                <div key={tag.slug} className="flex items-center justify-between rounded bg-gray-50 p-3">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="font-medium">{tag.name}</span>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                    {tag.postCount} posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Tags List */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">All Tags</h2>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {tags.map((tag) => (
              <div key={tag._id} className="flex items-center justify-between rounded p-2 hover:bg-gray-50">
                <div>
                  <span className="font-medium">{tag.name}</span>
                  <span className="ml-2 text-sm text-gray-500">({tag.slug})</span>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    tag.postCount > 5
                      ? 'bg-green-100 text-green-800'
                      : tag.postCount > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tag.postCount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tag Filter Buttons (Example usage) */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Filter by Tag</h2>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white">All (20)</button>
          {tags.slice(0, 6).map((tag) => (
            <button
              key={tag._id}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
            >
              {tag.name} ({tag.postCount.toString().padStart(2, '0')})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagStatistics;
