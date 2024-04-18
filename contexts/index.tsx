"use client";
import { useEthersProvider } from "@/hooks/useEthers";
import { FhevmInstance, initFhevm } from "fhevmjs";
import { createContext, useContext, useMemo, useState } from "react";
import { createInstance } from "fhevmjs/web";
import { ethers } from "ethers";

const stateContext = createContext<any>(null);

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [publicKey, setPublicKey] = useState<`0x${string}`>();
  const chainId = 8009;
  const provider = useEthersProvider({ chainId });

  useMemo(async () => {
    await initFhevm();
    await createFhevmInstance();
  }, []);

  const createFhevmInstance = async () => {
    if (!provider) return;
    const ret = await provider.call({
      // fhe lib address, may need to be changed depending on network
      to: "0x000000000000000000000000000000000000005d",
      // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
      data: "0xd9d47bb001",
    });

    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
    const publicKey = decoded[0];

    const instance = await createInstance({ chainId, publicKey } as {
      chainId: number;
      publicKey: `0x${string}`;
    });
    setInstance(instance);
    setIsInitialized(true);
    setPublicKey(publicKey);
    console.log("fhevm initialized");
  };
  const getTokenSignature = async (
    contractAddress: string,
    userAddress: string
  ) => {
    if (instance?.hasKeypair(contractAddress)) {
      return instance.getTokenSignature(contractAddress)!;
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
  const getInstance = () => {
    if (!instance) return;
    return instance;
  };

  return (
    <stateContext.Provider
      value={{
        getTokenSignature,
        createFhevmInstance,
        getInstance,
        isInitialized,
        publicKey,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export const StateContext = () => useContext(stateContext);
