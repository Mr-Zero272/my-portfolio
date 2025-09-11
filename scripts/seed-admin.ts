/**
 * Script để seed admin user và test kết nối MongoDB
 * Chạy: npx ts-node scripts/seed-admin.ts
 * Sau khi chạy xong, có thể xóa file này
 */

import dotenv from 'dotenv';
import connectDB from '../lib/mongodb';
import { UserService } from '../services/user-service';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection(): Promise<boolean> {
  console.log('🔗 Testing MongoDB connection...');

  try {
    const connection = await connectDB();
    console.log('✅ MongoDB connected successfully!');
    console.log(`📍 Connected to: ${connection.connection.host}`);
    console.log(`🗄️  Database: ${connection.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', (error as Error).message);
    return false;
  }
}

async function seedAdminUser() {
  console.log('\n👤 Creating admin user...');

  const adminData = {
    username: 'admin',
    email: process.env.ADMIN_EMAIL || 'pitithuong@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    name: 'Administrator',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4', // Default GitHub avatar
  };

  try {
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await UserService.findUserByEmail(adminData.email);

    if (existingUser) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Username:', existingUser.username);
      console.log('📝 Name:', existingUser.name);
      console.log('🎭 Avatar:', existingUser.avatar || 'No avatar');
      return existingUser;
    }

    // Tạo user mới
    const user = await UserService.createUser(adminData);

    if (user) {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', user.email);
      console.log('👤 Username:', user.username);
      console.log('📝 Name:', user.name);
      console.log('🔐 Password:', adminData.password);
      console.log('🎭 Avatar:', user.avatar || 'No avatar');
      console.log('🆔 User ID:', user._id.toString());
      return user;
    } else {
      console.error('❌ Failed to create admin user');
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', (error as Error).message);
    return null;
  }
}

async function main(): Promise<void> {
  console.log('🚀 Starting MongoDB seed script...\n');

  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('\n❌ Cannot proceed without database connection');
    process.exit(1);
  }

  // Seed admin user
  await seedAdminUser();

  console.log('\n🎉 Seed script completed!');
  console.log('💡 You can now delete this file: scripts/seed-admin.ts');

  process.exit(0);
}

// Handle errors
process.on('unhandledRejection', (error: unknown) => {
  console.error('❌ Unhandled Promise Rejection:', error);
  process.exit(1);
});

// Run the script
main().catch((error: unknown) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
