import { Suspense } from "react";
import { Results, ResultsSkeleton } from "./_components/result";
import { redirect } from "next/navigation";

export default async function Page(props: any) {
  const term = props?.searchParams?.term;

  if (!term) {
    redirect("/");
  }

  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      <Suspense fallback={<ResultsSkeleton />}>
        <Results term={term} />
      </Suspense>
    </div>
  );
}