"use client";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div>
      <nav className=" border-gray-200 px-4 lg:px-6 py-5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              width={100}
              height={24}
              priority
            />
          </Link>

          <div className="flex items-center lg:order-2 gap-4">
            <ConnectButton />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
