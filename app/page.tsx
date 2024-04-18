"use client";
import { Button } from "@/components/ui/button";
import { StateContext } from "@/contexts";
import { FhevmInstance } from "fhevmjs";

export default function Home() {
  const { getInstance, isInitialized } = StateContext();

  const instance: FhevmInstance = getInstance();

  function encryptEuint32() {
    if (!isInitialized || !instance)
      return console.error("Instance not initialized");
    const euint32 = instance.encrypt32(1234);
    console.log("euint32: ", euint32);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={() => encryptEuint32()}>Click me</Button>
    </main>
  );
}
