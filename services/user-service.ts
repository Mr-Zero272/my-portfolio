import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcryptjs';

export class UserService {
  static async findUserByCredentials(username: string, password: string): Promise<IUser | null> {
    try {
      await connectDB();

      const user = await User.findOne({ username }).select('+password');
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
        role: 'admin',
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
}
