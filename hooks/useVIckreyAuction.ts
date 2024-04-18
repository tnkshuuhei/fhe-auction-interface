import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { vickreyAuction } from "@/constants/vickreyAuction";

export const useVickreyAuction = () => {
  const { toast } = useToast();

  const beneficiary = useReadContract({
    ...vickreyAuction,
    functionName: "beneficiary",
    chainId: 8009,
  });

  const endTime = useReadContract({
    ...vickreyAuction,
    functionName: "endTime",
    chainId: 8009,
  });

  const isHighestBidder = useReadContract({
    ...vickreyAuction,
    functionName: "doIHaveHighestBid",
    args: ["0x", "0x"], // publickey, signature
    chainId: 8009,
  });

  const bidData = useReadContract({
    ...vickreyAuction,
    functionName: "getBid",
    args: ["0x", "0x"], // publickey, signature
    chainId: 8009,
    query: {
      refetchInterval: 30000,
    },
  });

  const { data: bidHash, writeContract: bid } = useWriteContract();
  const { writeContract: auctionEnd } = useWriteContract();
  const { data: claimHash, writeContract: claim } = useWriteContract();

  const { isLoading: isLoadingBid, isSuccess: isSuccessBid } =
    useWaitForTransactionReceipt({ hash: bidHash });

  const { isLoading: isLoadingClaim, isSuccess: isSuccessClaim } =
    useWaitForTransactionReceipt({ hash: claimHash });

  function placeBid(encryptedValue: `0x${string}`) {
    bid(
      {
        ...vickreyAuction,
        functionName: "bid",
        args: [encryptedValue],
        chainId: 8009,
      },
      {
        onSuccess: () => toast({ description: "Tx sent" }),
        onError: () => toast({ description: "Tx failed" }),
      }
    );
  }

  function endAuction() {
    auctionEnd(
      {
        ...vickreyAuction,
        functionName: "auctionEnd",
        chainId: 8009,
      },
      {
        onSuccess: () => toast({ description: "Tx sent" }),
        onError: () => toast({ description: "Tx failed" }),
      }
    );
  }

  function claimBid() {
    claim(
      {
        ...vickreyAuction,
        functionName: "claim",
        chainId: 8009,
      },
      {
        onSuccess: () => toast({ description: "Tx sent" }),
        onError: () => toast({ description: "Tx failed" }),
      }
    );
  }

  useEffect(() => {
    if (isSuccessClaim) {
      toast({ description: "Claim successful!" });
    }
  }, [isSuccessClaim]);

  useEffect(() => {
    if (isSuccessBid) {
      toast({ description: "Bid successful!" });
    }
  }, [isSuccessBid]);

  return {
    beneficiary,
    endTime,
    bidData,
    isHighestBidder,
    placeBid,
    claimBid,
    endAuction,
    isLoadingBid,
    isLoadingClaim,
  };
};