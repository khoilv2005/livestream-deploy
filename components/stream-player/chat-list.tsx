"use client";

import { useEffect, useRef } from "react";
import { ReceivedChatMessage } from "@livekit/components-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "./chat-message";

interface ChatListProps {
  messages: ReceivedChatMessage[];
  isHidden: boolean;
}

export const ChatList = ({ messages, isHidden }: ChatListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isHidden || !messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-sm text-muted-foreground">
          {isHidden ? "Chat is disabled" : "Welcome to the chat!"}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-col overflow-y-auto h-[500px] p-3 space-y-2"
    >
      {messages.map((message) => (
        <ChatMessage key={message.timestamp} data={message} />
      ))}
    </div>
  );
};

export const ChatListSkeleton = () => {
  return (
    <div className="flex h-[500px] items-center justify-center">
      <Skeleton className="w-1/2 h-6" />
    </div>
  );
};
