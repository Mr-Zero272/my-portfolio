/**
 * Script để seed test comments vào database
 * Chạy: npx ts-node scripts/comment.ts
 */

import dotenv from 'dotenv';
import { Types } from 'mongoose';
import connectDB from '../lib/mongodb';
import Comment from '../models/Comment';
import { UserService } from '../services/user-service';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Mảng comment mẫu để test
const testComments = [
  {
    content: 'Great article! Thanks for sharing this valuable information.',
    images: ['https://i.pinimg.com/736x/fa/6d/29/fa6d295415edaa3f049b227ec2aada8f.jpg'],
  },
  {
    content: 'This is exactly what I was looking for. Very helpful tutorial!',
    images: [],
  },
  {
    content: 'Amazing work! Could you please explain more about the implementation details?',
    images: [
      'https://i.pinimg.com/1200x/30/db/f4/30dbf44158dfbd98353a1db80626a819.jpg',
      'https://i.pinimg.com/1200x/bf/19/18/bf1918e593839917a7c0eb25715d7a39.jpg',
    ],
  },
  {
    content: 'I had the same issue before. This solution worked perfectly for me.',
    images: [],
  },
  {
    content: 'Excellent post! Bookmarked for future reference. 📚',
    images: ['https://i.pinimg.com/1200x/b0/7e/7e/b07e7e42a712a58bdb1ee1670cb6881a.jpg'],
  },
  {
    content: 'Thank you for the detailed explanation. Very clear and easy to follow.',
    images: [],
  },
  {
    content: 'This approach is much better than what I was using before. Thanks!',
    images: [],
  },
  {
    content: 'Great examples! Could you add more use cases in the next post?',
    images: ['https://i.pinimg.com/1200x/89/03/a3/8903a37ff6e95699dcf68133e5fe2aab.jpg'],
  },
  {
    content: 'Perfect timing! I was just working on something similar.',
    images: [],
  },
  {
    content: 'Love the visual examples you provided. Makes it much easier to understand! 👏',
    images: [
      'https://i.pinimg.com/1200x/aa/5f/68/aa5f68f28abc046a273e1252f354e8c9.jpg',
      'https://i.pinimg.com/1200x/c8/bb/8e/c8bb8e9433cbca068591acc5b0b95e9d.jpg',
      'https://i.pinimg.com/736x/12/18/e4/1218e4d21008e6567585f43a8dac39b0.jpg',
    ],
  },
];

// Mảng reply comments (nested comments)
const testReplies = [
  {
    content: 'Thanks for the feedback! Glad it was helpful.',
    images: [],
  },
  {
    content: "You're welcome! Let me know if you have any other questions.",
    images: [],
  },
  {
    content: 'I agree! This method has saved me a lot of time.',
    images: [],
  },
  {
    content: "Great suggestion! I'll definitely consider adding more examples.",
    images: ['https://i.pinimg.com/736x/fa/6d/29/fa6d295415edaa3f049b227ec2aada8f.jpg'],
  },
  {
    content: 'Feel free to reach out if you need any clarification! 😊',
    images: [],
  },
];

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

async function getAdminUser() {
  console.log('\n👤 Finding admin user...');

  try {
    const result = await UserService.getAllUsers({ page: 1, limit: 1 });

    if (result.status === 'success' && result.data.length > 0) {
      const adminUser = result.data[0];
      console.log(`✅ Found admin user: ${adminUser.name} (${adminUser.email})`);
      return adminUser._id;
    } else {
      console.log('❌ No admin user found. Please run seed-admin.ts first');
      return null;
    }
  } catch (error) {
    console.error('❌ Error finding admin user:', (error as Error).message);
    return null;
  }
}

async function seedComments(userId: string) {
  console.log('\n💬 Seeding test comments...');

  let successCount = 0;
  let errorCount = 0;
  const createdCommentIds: string[] = [];

  // Temporary ObjectIds cho postId và authorId (bạn sẽ thay đổi sau)
  const tempPostId = new Types.ObjectId('68ea574e91711ee64f196e50');
  const tempAuthorId = new Types.ObjectId(userId);

  // Seed main comments (parent comments)
  for (const [index, commentData] of testComments.entries()) {
    try {
      const commentPayload = {
        postId: tempPostId,
        parentId: null, // null cho comment gốc
        content: commentData.content,
        images: commentData.images,
        author: tempAuthorId,
        likes: [],
        dislikes: [],
      };

      const newComment = new Comment(commentPayload);
      const savedComment = await newComment.save();

      if (savedComment) {
        successCount++;
        createdCommentIds.push(savedComment._id.toString());
      } else {
        console.log(`❌ Failed to create comment ${index + 1}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating comment ${index + 1}:`, (error as Error).message);
      errorCount++;
    }
  }

  // Seed reply comments (nested comments)
  console.log('\n💬 Seeding reply comments...');

  for (const [index, replyData] of testReplies.entries()) {
    try {
      // Random chọn một parent comment
      const randomParentId = createdCommentIds[Math.floor(Math.random() * createdCommentIds.length)];

      const replyPayload = {
        postId: tempPostId,
        parentId: new Types.ObjectId(randomParentId), // reply cho comment có sẵn
        content: replyData.content,
        images: replyData.images,
        author: tempAuthorId,
        likes: [],
        dislikes: [],
      };

      const newReply = new Comment(replyPayload);
      const savedReply = await newReply.save();

      if (savedReply) {
        console.log(`✅ Created reply ${index + 1}/${testReplies.length}: "${replyData.content.substring(0, 50)}..."`);
        successCount++;
      } else {
        console.log(`❌ Failed to create reply ${index + 1}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating reply ${index + 1}:`, (error as Error).message);
      errorCount++;
    }
  }

  console.log('\n📊 Seeding completed!');
  console.log(`✅ Successfully created: ${successCount} comments`);
  console.log(`❌ Failed: ${errorCount} comments`);

  console.log('\n📝 Note: Remember to update the following in your database:');
  console.log(`🔹 postId: ${tempPostId} (replace with actual post IDs)`);
  console.log(`🔹 author: ${tempAuthorId} (replace with actual user IDs)`);
}

async function checkExistingComments() {
  console.log('\n🔍 Checking existing comments...');

  try {
    const count = await Comment.countDocuments();
    console.log(`📊 Found ${count} existing comments in database`);
    return count;
  } catch (error) {
    console.error('❌ Error checking existing comments:', (error as Error).message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Starting comment seeding script...\n');

  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    process.exit(1);
  }

  // Check existing comments
  const existingCount = await checkExistingComments();

  if (existingCount > 0) {
    console.log('⚠️  Warning: Database already contains comments.');
    console.log('This script will add more test comments.');
    // Uncomment next line if you want to prevent duplicate seeding
    // process.exit(0);
  }

  // Get admin user
  const adminUserId = await getAdminUser();
  if (!adminUserId) {
    console.log('\n❌ Cannot proceed without admin user. Please run seed-admin.ts first.');
    process.exit(1);
  }

  // Seed comments
  await seedComments(adminUserId.toString());

  // Final check
  await checkExistingComments();

  console.log('\n🎉 Comment seeding script completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update postId fields with actual post IDs from your posts collection');
  console.log('2. Update author fields with actual user IDs if needed');
  console.log('3. You can use MongoDB Compass or CLI to update these fields');

  process.exit(0);
}

// Chạy script
main().catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
