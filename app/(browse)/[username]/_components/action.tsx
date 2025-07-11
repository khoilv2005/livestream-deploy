"use client";

import { onFollow, onUnfollow } from "@/actions/follower";
import { onBlock, onUnblock } from "@/actions/block"
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionProps { 
  isFollowing: boolean;
  isBlocked: boolean;
  userId: string;
}

export const Action = ({ isFollowing, userId, isBlocked }: ActionProps) => {
  const [isPending, startTransition] = useTransition();

  const HandelFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) => {
          toast.success("Bạn đã theo dõi thành công!");
        })
        .catch(() => {
          toast.error("Failed to follow.");
        });
    });
  };

  const HandelUnFollow = () => {
    startTransition(() => {
        onUnfollow(userId)
        .then((data) => {
          toast.success("Bạn đã bỏ theo dõi thành công!");
        })
        .catch(() => {
          toast.error("Failed to unfollow.");
        });
    });
  };
   const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) => {
          // Server action onBlock trả về data có chứa data.blocked.username
          toast.success(`Bạn đã chặn ${data.blocked.username}`);
        })
        .catch((error) => {
          // Sử dụng error.message từ server action nếu có, hoặc một thông báo chung
          toast.error(error?.message || "Không thể chặn người dùng này.");
        });
    });
  };

  const handleUnblock = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((data) => {
          // Server action onUnblock trả về data có chứa data.blocked.username
          toast.success(`Bạn đã bỏ chặn ${data.blocked.username}`);
        })
        .catch((error) => {
          toast.error(error?.message || "Không thể bỏ chặn người dùng này.");
        });
    });
  };

  const onClick = ()=>
  {
    if (isFollowing)
    {
        HandelUnFollow();
    }
    else {
        HandelFollow();
    }
  }

  const onClickBlock = () => {
    if (isBlocked) {
      handleUnblock();
    } else {
      handleBlock();
    }
  };
  return (
    <>
    <Button disabled={isPending} onClick={onClick} variant="primary">
     {isFollowing ? "Unfollow" : "Follow"}
    </Button>

    <Button
        disabled={isPending}
        onClick={onClickBlock}
        variant={isBlocked ? "outline" : "destructive"} // Ví dụ: "destructive" (màu đỏ) cho Block, "outline" cho Unblock
        className="ml-2" // Thêm chút khoảng cách giữa các nút
      >
        {isBlocked ? "Unblock" : "Block"}
      </Button>
    </>
  );
};

