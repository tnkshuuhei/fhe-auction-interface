"use client";
import { useEthersProvider } from "@/hooks/useEthers";
import { FhevmInstance, initFhevm } from "fhevmjs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { createInstance } from "fhevmjs/web";

const stateContext = createContext<any>(null);

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [instance, setInstance] = useState<FhevmInstance>();
  const { address } = useAccount();
  const chainId = 8009;
  const provider = useEthersProvider({ chainId });
  // const chainId = useChainId();

  useMemo(async () => {
    await initFhevm();
    createFhevmInstance();
    console.log("fhevm initialized");
  }, [provider, address]);
  const createFhevmInstance = async () => {
    const publicKey = await provider?.call({
      from: null,
      to: "0x0000000000000000000000000000000000000044",
    });
    console.log("publicKey", publicKey);
    const instance = await createInstance({ chainId, publicKey } as {
      chainId: number;
      publicKey: string;
    });
    console.log("instance", instance);
    setInstance(instance);
  };
  const getTokenSignature = async (
    contractAddress: string,
    userAddress: string
  ) => {
    if (instance!.hasKeypair(contractAddress)) {
      return instance!.getTokenSignature(contractAddress)!;
    } else {
      const { publicKey, token } = instance!.generateToken({
        verifyingContract: contractAddress,
      });
      const params = [userAddress, JSON.stringify(token)];
      const signature: string = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params,
      });
      instance!.setTokenSignature(contractAddress, signature);
      return { signature, publicKey };
    }
  };

  return (
    <stateContext.Provider
      value={{
        getTokenSignature,
        createFhevmInstance,
        instance,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export const StateContext = () => useContext(stateContext);
