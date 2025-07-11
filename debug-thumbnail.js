const { PrismaClient } = require('./lib/generated/prisma');

const prisma = new PrismaClient();

async function debugThumbnail() {
  try {
    // Lấy tất cả streams
    const streams = await prisma.stream.findMany({
      select: {
        id: true,
        name: true,
        thumbnailUrl: true,
        userId: true,
        user: {
          select: {
            username: true
          }
        }
      }
    });

    console.log('=== THUMBNAIL DEBUG ===');
    streams.forEach(stream => {
      console.log(`\nStream: ${stream.name} (${stream.user?.username})`);
      console.log(`ID: ${stream.id}`);
      console.log(`Thumbnail URL: ${stream.thumbnailUrl}`);
      console.log(`URL length: ${stream.thumbnailUrl?.length || 0}`);
      console.log(`Is empty: ${!stream.thumbnailUrl || stream.thumbnailUrl === ''}`);
    });

    // Test URL accessibility
    for (const stream of streams) {
      if (stream.thumbnailUrl && stream.thumbnailUrl !== '') {
        console.log(`\nTesting URL: ${stream.thumbnailUrl}`);
        try {
          const response = await fetch(stream.thumbnailUrl);
          console.log(`Status: ${response.status}`);
          console.log(`OK: ${response.ok}`);
        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugThumbnail(); 