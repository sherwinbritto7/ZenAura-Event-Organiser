import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between   ">
          {/* Logo  */}
          <Link href={"/"} className="flex items-center">
            <Image
              src="/zenauralogo.png"
              alt="ZenAura Logo"
              height={500}
              width={500}
              className="h-11 w-full"
              priority
            />
            {/* Pro Badge */}
          </Link>

          {/* Search & Location - Desktop only */}

          {/* Ride Side Actions  */}
        </div>
        {/* Mobile Search & Location - Below Header */}
      </nav>
      {/* Modals  */}
    </>
  );
};

export default Header;
