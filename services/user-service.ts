import connectDB from '@/lib/mongodb';
import { User, type IUser } from '@/models';
import bcrypt from 'bcryptjs';

export class UserService {
  static async findUserByCredentials(email: string, password: string): Promise<IUser | null> {
    try {
      await connectDB();

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error finding user by credentials:', error);
      return null;
    }
  }

  static async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      await connectDB();
      return await User.findOne({ email });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async createUser(userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    role?: string;
    avatar?: string;
  }): Promise<IUser | null> {
    try {
      await connectDB();

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const user = new User({
        ...userData,
        password: hashedPassword,
        role: userData.role || 'admin',
      });

      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      await connectDB();

      const user = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true },
      );

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  static async getAllUsers({
    limit = 10,
    page = 1,
    role,
  }: {
    limit?: number;
    page?: number;
    role?: string;
  } = {}) {
    try {
      await connectDB();

      const skip = (page - 1) * limit;
      const filter: Record<string, unknown> = {};

      if (role) {
        filter.role = role;
      }

      const [users, total] = await Promise.all([
        User.find(filter)
          .select('-password') // Exclude password from results
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        User.countDocuments(filter),
      ]);

      return {
        success: true,
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      console.error('Error getting users:', error);
      return {
        success: false,
        message: 'Failed to get users',
        data: [],
      };
    }
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      await connectDB();
      return await User.findById(userId).select('-password');
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await User.findByIdAndDelete(userId);
      return !!result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  static async findOrCreateGoogleUser(userData: {
    email: string;
    name: string;
    image?: string;
  }): Promise<IUser | null> {
    try {
      await connectDB();

      // Tìm user theo email
      let user = await User.findOne({ email: userData.email });

      if (!user) {
        // Tạo username unique từ email
        const baseUsername = userData.email.split('@')[0];
        let username = baseUsername;
        let counter = 1;

        // Kiểm tra xem username đã tồn tại chưa, nếu có thì thêm số
        while (await User.findOne({ username })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        // Tạo user mới với thông tin từ Google
        user = new User({
          username,
          email: userData.email,
          password: 'google_oauth', // Placeholder password for Google users
          name: userData.name,
          role: 'admin',
          avatar: userData.image || null,
        });

        user = await user.save();
      } else {
        // Cập nhật thông tin nếu có thay đổi
        let hasChanges = false;

        if (userData.image && user.avatar !== userData.image) {
          user.avatar = userData.image;
          hasChanges = true;
        }

        if (userData.name && user.name !== userData.name) {
          user.name = userData.name;
          hasChanges = true;
        }

        if (hasChanges) {
          await user.save();
        }
      }

      return user;
    } catch (error) {
      console.error('Error finding or creating Google user:', error);
      return null;
    }
  }
}
