import { Suspense } from "react";
import { BehavioralAIMock } from "~/app/_components/behavioral";

export default function BehavioralPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b bg-white">
      <div className="container flex flex-col items-center gap-12 px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-black">
          Behavioral Mock Interview
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <BehavioralAIMock />
        </Suspense>
      </div>
    </main>
  );
} 