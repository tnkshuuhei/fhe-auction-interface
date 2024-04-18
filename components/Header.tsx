"use client";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div>
      <nav className=" border-gray-200 px-4 lg:px-6 py-5">
        <div className="flex md:flex-row flex-col justify-between items-center mx-auto max-w-screen-xl">
          <h2 className="font-bold text-2xl">FHE Vickrey Auction</h2>
          <ConnectButton />
        </div>
      </nav>
    </div>
  );
};

export default Header;
