import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { isBlockedByUser } from "@/lib/block-service";
import { StreamPlayer } from "@/components/stream-player";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

const UserPage = async ({ params }: UserPageProps) => {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user || !user.stream) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user.id);
  const isBlocked = await isBlockedByUser(user.id);

  console.log("[UserPage] User data:", {
    id: user.id,
    username: user.username,
    bio: user.bio,
    followers: user._count?.followers,
    stream: user.stream
  });

  if (isBlocked) {
    notFound();
  }

  // Tạo user object phù hợp với CustomUser type
  const customUser = {
    id: user.id,
    username: user.username || "",
    bio: user.bio,
    imageUrl: user.imageUrl,
    stream: null,
    _count: {
      followedBy: user._count?.followers || 0
    }
  };

  // Tạo stream object phù hợp với CustomStream type
  const customStream = {
    id: user.stream!.id,
    isChatEnabled: user.stream!.isChatEnabled,
    isChatDelayed: user.stream!.isChatDelayed,
    isChatFollowersOnly: user.stream!.isChatFollowersOnly,
    isLive: user.stream!.isLive,
    thumbnail: user.stream!.thumbnailUrl,
    title: user.stream!.name
  };

  return (
    <StreamPlayer user={customUser} stream={customStream} isFollowing={isFollowing} />
  );
};

export default UserPage;