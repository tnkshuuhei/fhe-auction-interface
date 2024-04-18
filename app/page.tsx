"use client";
import { Button } from "@/components/ui/button";
import { StateContext } from "@/contexts";
import { FhevmInstance } from "fhevmjs";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";

export default function Home() {
  const { getInstance, isInitialized } = StateContext();
  const [amount, setAmount] = useState<string>("");

  const instance: FhevmInstance = getInstance();

  function encryptEuint32() {
    if (!isInitialized || !instance)
      return console.error("Instance not initialized");
    const euint32 = instance.encrypt32(1234);
    console.log("euint32: ", euint32);
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[0-9]*[.,]?[0-9]*$/;
    if (regex.test(value) || value === "") {
      setAmount(value);
    }
  };

  return (
    <main>
      {/* <Button onClick={() => encryptEuint32()}>Click me</Button> */}
      <Card className="lg:w-[1000px] w-[350px] mx-auto my-12">
        <CardHeader>
          <CardTitle>Vickrey Auction</CardTitle>
          <CardDescription>
            This auction is fully homomorphic encrypted using Fhevm by zama.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="lg:grid lg:grid-cols-2 gap-10">
            <div className="mx-auto">
              <Image
                src="https://picsum.photos/300/300"
                width={300}
                height={300}
                alt="auction content"
              />
            </div>
            <div className="flex flex-col gap-4 ">
              <Label className=" font-semibold text-xl">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              </Label>
              <Label className="text-gray-400">End: </Label>
              <Label>Place your bid</Label>
              <Input
                type="text"
                placeholder="Enter your bid"
                className="w-full"
                value={amount}
                pattern="^[0-9]*[.,]?[0-9]*$" // only allow numbers
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInput(e)
                }
              />
              <Button className="w-full mt-4">Place Bid</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
