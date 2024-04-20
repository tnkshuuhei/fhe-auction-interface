"use client";
import LoadingButton from "@/components/LoadingButton";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { getInstance, isInitialized } = StateContext();
  const [amount, setAmount] = useState<string>("");
  const { endTime, placeBid, isLoadingBid, claimBid, isLoadingClaim } =
    useVickreyAuction();
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

              <Tabs defaultValue="mint">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="mint">Mint</TabsTrigger>
                  <TabsTrigger value="approve">Approve</TabsTrigger>
                  <TabsTrigger value="bid">Bid</TabsTrigger>
                  <TabsTrigger value="claim">Claim</TabsTrigger>
                </TabsList>
                <TabsContent value="mint">
                  <Label>Enter amount</Label>
                  <Input
                    type="text"
                    placeholder="Enter amount"
                    className="w-full"
                    value={amount}
                    pattern="^[0-9]*[.,]?[0-9]*$" // only allow numbers
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInput(e)
                    }
                  />
                  {isLoadingMint ? (
                    <LoadingButton message="Minting Token" />
                  ) : (
                    <Button
                      className="w-full mt-4"
                      onClick={async () => {
                        await mintToken(Number(amount));
                      }}
                    >
                      Mint Token
                    </Button>
                  )}
                </TabsContent>
                <TabsContent value="approve">
                  <Label>Enter amount</Label>
                  <Input
                    type="text"
                    placeholder="Enter amount"
                    className="w-full"
                    value={amount}
                    pattern="^[0-9]*[.,]?[0-9]*$" // only allow numbers
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInput(e)
                    }
                  />
                  {isLoadingApproval ? (
                    <LoadingButton message="Approving" />
                  ) : (
                    <Button
                      className="w-full mt-4"
                      onClick={async () => {
                        // await mintToken(Number(amount);
                        await approveSpender(
                          vickreyAuction.address,
                          toHexString(encryptEuint32(Number(amount)))
                        );
                      }}
                    >
                      Approve
                    </Button>
                  )}
                </TabsContent>
                <TabsContent value="bid">
                  <Label>Enter amount</Label>
                  <Input
                    type="text"
                    placeholder="Enter amount"
                    className="w-full"
                    value={amount}
                    pattern="^[0-9]*[.,]?[0-9]*$" // only allow numbers
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInput(e)
                    }
                  />
                  {isLoadingBid ? (
                    <LoadingButton message="Bidding..." />
                  ) : (
                    <Button
                      className="w-full mt-4"
                      onClick={async () => {
                        await placeBid(
                          toHexString(encryptEuint32(Number(amount)))
                        );
                      }}
                    >
                      Place Bid
                    </Button>
                  )}
                </TabsContent>
                <TabsContent value="claim">
                  <Label>Enter amount</Label>
                  <Input
                    type="text"
                    placeholder="Enter amount"
                    className="w-full"
                    value={amount}
                    pattern="^[0-9]*[.,]?[0-9]*$" // only allow numbers
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInput(e)
                    }
                  />
                  {isLoadingClaim ? (
                    <LoadingButton message="Approving" />
                  ) : (
                    <Button
                      className="w-full mt-4"
                      onClick={async () => {
                        // await mintToken(Number(amount);
                        await approveSpender(
                          vickreyAuction.address,
                          toHexString(encryptEuint32(Number(amount)))
                        );
                      }}
                    >
                      Claim
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
