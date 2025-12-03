import Follow from '@/models/Follow';

export const followUser = async (followerId: string, followingId: string) => {
  try {
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    const existingFollow = await Follow.findOne({ followerId, followingId });
    if (existingFollow) {
      return { success: false, message: 'Already following' };
    }

    const newFollow = await Follow.create({ followerId, followingId });
    return { success: true, data: newFollow };
  } catch (error: any) {
    throw new Error(`Error following user: ${error.message}`);
  }
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  try {
    const deletedFollow = await Follow.findOneAndDelete({ followerId, followingId });
    if (!deletedFollow) {
      return { success: false, message: 'Not following' };
    }
    return { success: true, message: 'Unfollowed successfully' };
  } catch (error: any) {
    throw new Error(`Error unfollowing user: ${error.message}`);
  }
};

export const checkIsFollowing = async (followerId: string, followingId: string) => {
  try {
    const follow = await Follow.findOne({ followerId, followingId });
    return !!follow;
  } catch (error: any) {
    throw new Error(`Error checking follow status: ${error.message}`);
  }
};

export const getFollowers = async (userId: string, page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;
    const followers = await Follow.find({ followingId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('followerId', 'name username avatar email');

    const total = await Follow.countDocuments({ followingId: userId });

    return {
      data: followers.map((f) => f.followerId),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    throw new Error(`Error getting followers: ${error.message}`);
  }
};

export const getFollowing = async (userId: string, page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;
    const following = await Follow.find({ followerId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('followingId', 'name username avatar email');

    const total = await Follow.countDocuments({ followerId: userId });

    return {
      data: following.map((f) => f.followingId),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    throw new Error(`Error getting following: ${error.message}`);
  }
};

export const getFollowCounts = async (userId: string) => {
  try {
    const followersCount = await Follow.countDocuments({ followingId: userId });
    const followingCount = await Follow.countDocuments({ followerId: userId });
    return { followersCount, followingCount };
  } catch (error: any) {
    throw new Error(`Error getting follow counts: ${error.message}`);
  }
};
