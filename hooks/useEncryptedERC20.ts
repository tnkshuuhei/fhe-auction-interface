import { useToast } from "@/components/ui/use-toast";
import { encryptedErc20 } from "@/constants/encryptedErc20";
import { useEffect } from "react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export const useEncryptedERC20 = () => {
  const { toast } = useToast();

  const { data: approvalHash, writeContract: approve } = useWriteContract();
  const { isLoading: isLoadingApproval, isSuccess: isSuccessApproval } =
    useWaitForTransactionReceipt({ hash: approvalHash });

  const { data: mintHash, writeContract: mint } = useWriteContract();
  const { isLoading: isLoadingMint, isSuccess: isSuccessMint } =
    useWaitForTransactionReceipt({ hash: mintHash });

  async function mintToken(amount: number) {
    mint(
      {
        ...encryptedErc20,
        functionName: "mint",
        args: [amount],
        chainId: 8009,
      },
      {
        onSuccess: () => toast({ description: "Tx sent" }),
        onError: (e) => toast({ title: "Tx failed", description: e.message }),
      }
    );
  }

  async function approveSpender(
    spender: `0x${string}`,
    encryptedAmount: string
  ) {
    approve(
      {
        ...encryptedErc20,
        functionName: "approve",
        args: [spender, `0x${encryptedAmount}`],
        chainId: 8009,
      },
      {
        onSuccess: () => toast({ description: "Tx sent" }),
        onError: (e) => {
          toast({ title: "Tx failed", description: e.message });
          console.log("error", e.message);
        },
      }
    );
  }

  useEffect(() => {
    if (isSuccessApproval) {
      toast({ description: "Approval successful!" });
    }
  }, [isSuccessApproval]);

  useEffect(() => {
    if (isSuccessMint) {
      toast({ description: "Mint successful!" });
    }
  }, [isSuccessMint]);

  const name = useReadContract({
    ...encryptedErc20,
    functionName: "name",
    chainId: 8009,
  });
  const symbol = useReadContract({
    ...encryptedErc20,
    functionName: "symbol",
    chainId: 8009,
  });

  const totalSupply = useReadContract({
    ...encryptedErc20,
    functionName: "totalSupply",
    chainId: 8009,
  });

  const balanceOf = useReadContract({
    ...encryptedErc20,
    functionName: "balanceOf",
    chainId: 8009,
    args: [`0x`, `0x`, `0x`], // address, publickey, signature
    query: {
      refetchInterval: 1000,
    },
  });

  const allowance = useReadContract({
    ...encryptedErc20,
    functionName: "allowance",
    chainId: 8009,
    args: [`0x`, `0x`, `0x`, `0x`], // owner, spender, publickey, signature
    query: {
      refetchInterval: 1000,
    },
  });

  return {
    name,
    symbol,
    totalSupply,
    balanceOf,
    allowance,
    mintToken,
    approveSpender,
    isLoadingMint,
    isLoadingApproval,
  };
};
