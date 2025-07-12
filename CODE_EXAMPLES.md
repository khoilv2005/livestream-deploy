# CODE EXAMPLES - CHỨC NĂNG TƯƠNG ỨNG

## 1. Database Schema (Prisma) - Cơ sở dữ liệu

### Bảng User
```prisma
model User{
  id String @id @default(uuid())
  username String? @unique
  imageUrl String @db.Text
  externalUserId String @unique
  bio String? @db.Text

  following Follow[] @relation("Following")
  followers Follow[] @relation("FollowedBy")
  blocking Block[] @relation("Blocking")
  blocked Block[] @relation("BlockedBy")

  stream Stream?
}
```

### Bảng Follow
```prisma
model Follow{
  id String @id @default(uuid())
  followerId String
  followingId String

  follower User @relation(name: "Following", fields: [followerId], references: [id], onDelete: Cascade)
  following User @relation(name: "FollowedBy", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId])
}
```

### Bảng Stream
```prisma
model Stream{
  id String @id @default(uuid())
  name String @db.Text
  thumbnailUrl String @db.Text
  ingressId String? @unique
  serverUrl String @db.Text
  streamKey String @db.Text
  isLive Boolean @default(false)
  isChatEnabled Boolean @default(true)
  isChatDelayed Boolean @default(false)
  isChatFollowersOnly Boolean @default(false)
  
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 2. Authentication với Clerk

### Layout.tsx - Setup Clerk Provider
```tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### Auth Service - Lấy thông tin user hiện tại
```typescript
// lib/auth-service.ts
import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const getSelf = async () => {
  const self = await currentUser();
  
  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      externalUserId: self.id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
```

## 3. Video Streaming với LiveKit

### Live Video Component
```tsx
// components/stream-player/live-video.tsx
import { Participant, RemoteVideoTrack } from "livekit-client";
import { useTracks } from "@livekit/components-react";

export const LiveVideo = ({ participant }: { participant: Participant }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTrackRef = useRef<RemoteVideoTrack | null>(null);
  
  const videoTracks = useTracks([
    { kind: Track.Kind.Video, participant },
  ]);

  useEffect(() => {
    const pub = videoTracks[0]?.publication as RemoteTrackPublication | undefined;
    const track = pub?.track;

    if (videoRef.current && track && track.kind === "video") {
      const remoteTrack = track as RemoteVideoTrack;
      remoteTrack.attach(videoRef.current);
      videoTrackRef.current = remoteTrack;
    }

    return () => {
      const currentVideoRef = videoRef.current;
      const currentTrackRef = videoTrackRef.current;
      if (currentVideoRef && currentTrackRef) {
        currentTrackRef.detach(currentVideoRef);
      }
    };
  }, [videoTracks]);

  return (
    <video
      ref={videoRef}
      className="w-full h-auto object-contain"
      autoPlay
      playsInline
    />
  );
};
```

## 4. Chat Real-time với WebSocket

### Chat Component
```tsx
// components/stream-player/chat.tsx
import { useRoomContext, useRemoteParticipant } from "@livekit/components-react";

export const Chat = ({ hostIdentity }: { hostIdentity: string }) => {
  const [messages, setMessages] = useState<{
    id: string; 
    user: string; 
    content: string; 
    timestamp?: number;
  }[]>([]);
  
  const room = useRoomContext();

  // Lắng nghe tin nhắn từ LiveKit Room
  useEffect(() => {
    if (!room) return;
    
    const handleData = (payload: Uint8Array, participant?: RemoteParticipant) => {
      if (!participant) return;
      
      const msg = JSON.parse(new TextDecoder().decode(payload));
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          user: participant.name || participant.identity,
          content: msg.content,
          timestamp: Date.now(),
        },
      ]);
    };

    room.on("dataReceived", handleData);
    return () => { room.off("dataReceived", handleData); };
  }, [room]);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.user}:</strong> {message.content}
        </div>
      ))}
    </div>
  );
};
```

### Gửi tin nhắn
```tsx
const onSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  if (!room || !value.trim()) return;

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify({
    content: value,
    senderName: viewerName,
  }));

  try {
    await room.localParticipant.publishData(data, { reliable: true });
    setValue("");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
```

## 5. Follow/Unfollow System

### Follow Actions
```typescript
// actions/follow.ts
import { followUser, unfollowUser } from "@/lib/follow-service";

export const onFollow = async (id: string) => {
  try {
    const followedUser = await followUser(id);
    revalidatePath("/");
    return followedUser;
  } catch (error) {
    throw new Error("Internal Error");
  }
};

export const onUnfollow = async (id: string) => {
  try {
    const unfollowedUser = await unfollowUser(id);
    revalidatePath("/");
    return unfollowedUser;
  } catch (error) {
    throw new Error("Internal Error");
  }
};
```

### Follow Service
```typescript
// lib/follow-service.ts
import { db } from "./db";
import { getSelf } from "./auth-service";

export const followUser = async (id: string) => {
  const self = await getSelf();
  
  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser.id === self.id) {
    throw new Error("Cannot follow yourself");
  }

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });

  if (existingFollow) {
    throw new Error("Already following");
  }

  const follow = await db.follow.create({
    data: {
      followerId: self.id,
      followingId: otherUser.id,
    },
    include: {
      following: true,
      follower: true,
    },
  });

  return follow;
};
```

## 6. API Routes

### Stream Keys API
```typescript
// app/api/keys/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";

export async function GET() {
  try {
    const self = await getSelf();
    const stream = await getStreamByUserId(self.id);
    
    if (!stream) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      serverUrl: stream.serverUrl,
      streamKey: stream.streamKey,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## 7. Stream Management

### Stream Service
```typescript
// lib/stream-service.ts
import { db } from "./db";

export const getStreamByUserId = async (userId: string) => {
  const stream = await db.stream.findUnique({
    where: { userId },
  });

  return stream;
};

export const getStreams = async () => {
  let streams = [];

  const data = await db.stream.findMany({
    where: {
      user: {
        NOT: {
          blocking: {
            some: {
              blockedId: userId,
            },
          },
        },
      },
    },
    select: {
      id: true,
      user: true,
      isLive: true,
      name: true,
      thumbnailUrl: true,
    },
    orderBy: [
      {
        isLive: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });

  return data;
};
```

## 8. Middleware Protection

### Route Protection
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/u(.*)',
  '/api/keys(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

## 9. State Management với Zustand

### Chat Sidebar Store
```typescript
// store/use-chat-sidebar.ts
import { create } from "zustand";

export enum ChatVariant {
  CHAT = "CHAT",
  COMMUNITY = "COMMUNITY",
}

interface ChatSidebarStore {
  collapsed: boolean;
  variant: ChatVariant;
  onExpand: () => void;
  onCollapse: () => void;
  onChangeVariant: (variant: ChatVariant) => void;
}

export const useChatSidebar = create<ChatSidebarStore>((set) => ({
  collapsed: false,
  variant: ChatVariant.CHAT,
  onExpand: () => set(() => ({ collapsed: false })),
  onCollapse: () => set(() => ({ collapsed: true })),
  onChangeVariant: (variant: ChatVariant) => set(() => ({ variant })),
}));
```

---

**Tổng kết:**
Các đoạn code trên đây thể hiện các chức năng chính của ứng dụng livestream:
- Database với Prisma ORM
- Authentication với Clerk
- Video streaming với LiveKit
- Real-time chat với WebSocket
- Follow/unfollow system
- API routes và middleware
- State management

Mỗi phần code đều có comment giải thích và tương ứng trực tiếp với các chức năng đã mô tả trong báo cáo lý thuyết.
