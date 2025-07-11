import Link from "next/link";
import { User, Stream } from "@/lib/generated/prisma";
import moment from "moment";

import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { Skeleton } from "@/components/ui/skeleton";
import { VerifiedMark } from "@/components/verified-mark";

interface ResultCardProps {
  result: {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    isLive: boolean;
    user: {
      username: string | null;
      imageUrl: string;
    };
  };
}

export const ResultCard = ({ result }: ResultCardProps) => {
  return (
    <Link href={`/${result.user.username}`}>
      <div className="w-full flex gap-x-4">
        <div className="relative h-[9rem] w-[16rem]">
          <Thumbnail
            src={result.thumbnailUrl}
            fallback={result.user.imageUrl || ""}
            isLive={result.isLive}
            username={result.user.username || ""}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold text-lg cursor-pointer hover:text-blue-500">
              {result.user.username}
            </p>
            <VerifiedMark />
          </div>
          <p className="text-sm text-muted-foreground">{result.name}</p>
        </div>
      </div>
    </Link>
  );
};

export const ResultCardSkeleton = () => {
  return (
    <div className="w-full flex gap-x-4">
      <div className="relative h-[9rem] w-[16rem]">
        <ThumbnailSkeleton />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
};