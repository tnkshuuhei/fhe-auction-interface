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
import { useVickreyAuction } from "@/hooks/useVIckreyAuction";
import { convertUnixToUTC } from "@/utils/converter";
import { useEncryptedERC20 } from "@/hooks/useEncryptedERC20";
import { vickreyAuction } from "@/constants/vickreyAuction";
import { toHexString } from "@/utils/toHexString";

export default function Home() {
  const { getInstance, isInitialized } = StateContext();
  const [amount, setAmount] = useState<string>("");
  const { endTime } = useVickreyAuction();
  const {
    name,
    symbol,
    totalSupply,
    balanceOf,
    allowance,
    mintToken,
    approveSpender,
    isLoadingMint,
    isLoadingApproval,
  } = useEncryptedERC20();

  const instance: FhevmInstance = getInstance();

  console.log("totalSupply", totalSupply?.data);

  function encryptEuint32(amount: number): Uint8Array {
    if (!isInitialized || !instance) alert("Fhevm instance not initialized");
    return instance.encrypt32(amount);
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
              <Label className="text-gray-400">
                End: {convertUnixToUTC(endTime?.data as bigint)}
              </Label>
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
              <Button
                className="w-full mt-4"
                onClick={async () => {
                  // await mintToken(100);
                  await approveSpender(
                    vickreyAuction.address,
                    toHexString(encryptEuint32(100)) as `0x${string}`
                  );
                }}
              >
                Place Bid
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
