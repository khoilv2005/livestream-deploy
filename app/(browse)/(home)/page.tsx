import { Suspense } from "react";
import { Metadata } from "next";

import { Results, ResultsSkeleton } from "./_components/results";

export const metadata: Metadata = {
  title: "Kitten Stream - Discover Live Streams",
  description: "Discover and watch amazing live streams from creators around the world",
};

export default function Page() {
  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      <Suspense fallback={<ResultsSkeleton />}>
        <Results />
      </Suspense>
    </div>
  );
}