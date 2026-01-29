import connectDB from '@/lib/mongodb';
import { Post, Project, User } from '@/models';

export class DashboardService {
  /**
   * Get overall statistics
   */
  static async getStats() {
    try {
      await connectDB();

      const [totalProjects, totalPosts, totalUsers, totalViews, totalLikes] = await Promise.all([
        Project.countDocuments(),
        Post.countDocuments(),
        User.countDocuments(),
        Post.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]).then(
          (res) => res[0]?.totalViews || 0,
        ),
        Post.aggregate([{ $group: { _id: null, totalLikes: { $sum: '$likes' } } }]).then(
          (res) => res[0]?.totalLikes || 0,
        ),
      ]);

      return {
        totalProjects,
        totalPosts,
        totalUsers,
        totalViews,
        totalLikes,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new Error('Failed to get dashboard stats');
    }
  }

  /**
   * Get activity data (Views & Likes) for the last 6 months
   */
  static async getActivityData() {
    try {
      await connectDB();

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1); // Start of the month
      sixMonthsAgo.setHours(0, 0, 0, 0);

      const activity = await Post.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            views: { $sum: '$views' },
            likes: { $sum: '$likes' },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]);

      // Format data over the last 6 months, filling in missing months with 0
      const result = [];
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - 5 + i);
        const monthIndex = d.getMonth();
        const year = d.getFullYear();

        const found = activity.find((item) => item._id.month === monthIndex + 1 && item._id.year === year);

        result.push({
          month: monthNames[monthIndex],
          views: found ? found.views : 0,
          likes: found ? found.likes : 0,
        });
      }

      return result;
    } catch (error) {
      console.error('Error getting activity data:', error);
      return []; // Return empty array on error to prevent crashing UI
    }
  }

  /**
   * Get project status distribution
   */
  static async getProjectStatusDistribution() {
    try {
      await connectDB();

      const distribution = await Project.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Define colors/mapping if strictly needed or just return raw data
      // For now, let's map it to the format compatible with the PieChart
      // We'll generate colors dynamically or assign them on the frontend
      return distribution.map((item) => ({
        name: item._id, // status name
        value: item.count,
      }));
    } catch (error) {
      console.error('Error getting project status distribution:', error);
      return [];
    }
  }
}
