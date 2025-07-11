"use client";

import moment from "moment"
import { ReceivedChatMessage } from "@livekit/components-react";
import { format } from "date-fns";
import { stringToColor } from "@/lib/utils";

interface ChatMessageProps {
  data: { user: string; content: string; timestamp?: number };
}

export const ChatMessage = ({ data }: ChatMessageProps) => {
  const color = stringToColor(data.user || "");

  return (
    <div className="flex gap-2 p-2 rounded-md hover:bg-white/5">
      <p className="text-sm text-muted-foreground">
        {data.timestamp ? moment(data.timestamp).format("HH:mm") : ""}
      </p>
      <div className="flex flex-wrap items-baseline gap-1 grow">
        <p className="text-sm font-semibold whitespace-nowrap">
          <span className="truncate" style={{ color: color }}>
            {data.user}
          </span>
          :
        </p>
        <p className="text-sm break-all">{data.content}</p>
      </div>
    </div>
  );
};