/**
 * Script để seed test images vào database
 * Chạy: npx ts-node scripts/image.ts
 */

import dotenv from 'dotenv';
import connectDB from '../lib/mongodb';
import { ImageService } from '../services/image-service';
import { UserService } from '../services/user-service';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Mảng link image để test
const testImages = [
  {
    url: 'https://i.pinimg.com/1200x/ea/d4/73/ead473d50511f45a85c1dc3a278ff8f8.jpg',
    name: 'pinterest-img-11.jpg',
    caption: 'Beautiful mountain landscape at sunset',
  },
  {
    url: 'https://i.pinimg.com/736x/fa/6d/29/fa6d295415edaa3f049b227ec2aada8f.jpg',
    name: 'pinterest-img-12.jpg',
    caption: 'Peaceful forest path in autumn',
  },
  {
    url: 'https://i.pinimg.com/736x/7e/b1/1c/7eb11c7432f1bc17c0b57a7146be174d.jpg',
    name: 'pinterest-img-13.jpg',
    caption: 'Crystal clear lake with mountain reflections',
  },
  {
    url: 'https://i.pinimg.com/1200x/30/db/f4/30dbf44158dfbd98353a1db80626a819.jpg',
    name: 'pinterest-img-14.jpg',
    caption: 'Modern city skyline at night',
  },
  {
    url: 'https://i.pinimg.com/1200x/bf/19/18/bf1918e593839917a7c0eb25715d7a39.jpg',
    name: 'pinterest-img-15.jpg',
    caption: 'Tropical beach sunset with palm trees',
  },
  {
    url: 'https://i.pinimg.com/1200x/b0/7e/7e/b07e7e42a712a58bdb1ee1670cb6881a.jpg',
    name: 'pinterest-img-16.jpg',
    caption: 'Sand dunes in the Sahara desert',
  },
  {
    url: 'https://i.pinimg.com/1200x/89/03/a3/8903a37ff6e95699dcf68133e5fe2aab.jpg',
    name: 'pinterest-img-17.jpg',
    caption: 'Pink cherry blossoms in spring',
  },
  {
    url: 'https://i.pinimg.com/1200x/aa/5f/68/aa5f68f28abc046a273e1252f354e8c9.jpg',
    name: 'pinterest-img-18.jpg',
    caption: 'Aurora borealis dancing in the night sky',
  },
  {
    url: 'https://i.pinimg.com/1200x/c8/bb/8e/c8bb8e9433cbca068591acc5b0b95e9d.jpg',
    name: 'pinterest-img-19.jpg',
    caption: 'Hidden waterfall in tropical rainforest',
  },
  {
    url: 'https://i.pinimg.com/736x/12/18/e4/1218e4d21008e6567585f43a8dac39b0.jpg',
    name: 'pinterest-img-20.jpg',
    caption: 'Snow-capped mountain peaks in winter',
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

// Hàm để tính size ước tính từ URL (giả định)
function estimateImageSize(): number {
  // Ước tính size từ 100KB đến 2MB
  return Math.floor(Math.random() * (2000000 - 100000) + 100000);
}

// Hàm để lấy mimeType từ extension
function getMimeTypeFromUrl(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg'; // default
  }
}

async function seedImages(userId: string) {
  console.log('\n📸 Seeding test images...');

  let successCount = 0;
  let errorCount = 0;

  for (const [index, imageData] of testImages.entries()) {
    try {
      const imagePayload = {
        url: imageData.url,
        name: imageData.name,
        size: estimateImageSize(),
        mineType: getMimeTypeFromUrl(imageData.url),
        caption: imageData.caption,
        userCreated: userId,
      };

      const result = await ImageService.createImage(imagePayload as never);

      if (result.status === 'success') {
        console.log(`✅ Created image ${index + 1}/${testImages.length}: ${imageData.name}`);
        successCount++;
      } else {
        console.log(`❌ Failed to create image ${index + 1}: ${result.message}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating image ${index + 1}:`, (error as Error).message);
      errorCount++;
    }
  }

  console.log('\n📊 Seeding completed!');
  console.log(`✅ Successfully created: ${successCount} images`);
  console.log(`❌ Failed: ${errorCount} images`);
}

async function checkExistingImages() {
  console.log('\n🔍 Checking existing images...');

  try {
    const result = await ImageService.getAllImages({ page: 1, limit: 1 });

    if (result.status === 'success') {
      console.log(`📊 Found ${result.data.total} existing images in database`);
      return result.data.total;
    } else {
      console.log('❌ Error checking existing images:', result.message);
      return 0;
    }
  } catch (error) {
    console.error('❌ Error checking existing images:', (error as Error).message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Starting image seeding script...\n');

  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    process.exit(1);
  }

  // Check existing images
  const existingCount = await checkExistingImages();

  if (existingCount > 0) {
    console.log('⚠️  Warning: Database already contains images.');
    console.log('This script will add more test images.');
    // Uncomment next line if you want to prevent duplicate seeding
    // process.exit(0);
  }

  // Get admin user
  const adminUserId = await getAdminUser();
  if (!adminUserId) {
    console.log('\n❌ Cannot proceed without admin user. Please run seed-admin.ts first.');
    process.exit(1);
  }

  // Seed images
  await seedImages(adminUserId);

  // Final check
  await checkExistingImages();

  console.log('\n🎉 Image seeding script completed successfully!');
  process.exit(0);
}

// Chạy script
main().catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
