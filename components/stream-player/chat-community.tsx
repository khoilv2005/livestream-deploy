"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useParticipants } from "@livekit/components-react";
import { LocalParticipant, RemoteParticipant } from "livekit-client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CommunityItem } from "./community-item";

interface ChatCommunityProps {
  hostName: string;
  viewerName: string;
  isHidden: boolean;
}

export const ChatCommunity = ({
  hostName,
  viewerName,
  isHidden,
}: ChatCommunityProps) => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce<string>(value, 500);

  const participants = useParticipants();

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  // Deduplicate participants by identity
  const filteredParticipants = useMemo(() => {
    const uniqueMap = new Map<string, RemoteParticipant | LocalParticipant>();
    for (const participant of participants) {
      if (!uniqueMap.has(participant.identity)) {
        uniqueMap.set(participant.identity, participant);
      }
    }

    return Array.from(uniqueMap.values()).filter((participant) => {
      const name = participant.name || participant.identity;
      return name.toLowerCase().includes(debouncedValue.toLowerCase());
    });
  }, [participants, debouncedValue]);

  if (isHidden) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Community is disabled</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Input
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search community"
        className="border-white/10"
      />
      <ScrollArea className="gap-y-2 mt-4">
        {filteredParticipants.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground p-2">
            No results
          </p>
        ) : (
          filteredParticipants.map((participant) => (
            <CommunityItem
              key={participant.identity}
              hostName={hostName}
              viewerName={viewerName}
              participantName={participant.name || participant.identity}
              participantIdentity={participant.identity}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
};
