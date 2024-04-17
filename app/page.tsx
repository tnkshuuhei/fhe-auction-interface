"use client";
import { Button } from "@/components/ui/button";
import { init, getInstance } from "@/lib/fhevm";
import { useEffect, useState } from "react";
export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button>Click me</Button>
    </main>
  );
}
