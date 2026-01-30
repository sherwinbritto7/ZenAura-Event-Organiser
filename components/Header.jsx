"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";
import { Building, Crown, Plus, Ticket } from "lucide-react";
import { OnboardingModal } from "./onboarding-modal";
import { useOnboarding } from "@/hooks/use-onboarding";
import SearchLocationBar from "./search-location-bar";
import { Badge } from "./ui/badge";
import UpgradeModal from "./upgrade-modal";

const Header = () => {
  const { isLoading } = useStoreUser();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { showOnboaring, handleOnboardingComplete, handleOnboardingSkip } =
    useOnboarding();

  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });
  return (
    <>
      <nav
        className="fixed top-0 left-0
       right-0 bg-background/80 backdrop-blur-xl z-20 border-b"
      >
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
            {hasPro && (
              <Badge className="bg-linear-to-r from-pink-500 to-orange-500 gap-1 text-white ml-3">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
            )}
          </Link>

          {/* Search & Location - Desktop only */}
          <div className="hidden md:flex flex-1 justify-center">
            <SearchLocationBar />
          </div>

          {/* Ride Side Actions  */}
          <div className="flex items-center ">
            {!hasPro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpgradeModal(true)}
              >
                Pricing
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild className={"mr-2"}>
              <Link href="/explore">Explore</Link>
            </Button>

            <Authenticated>
              <Button size="sm" asChild className="flex gap-2 mr-4">
                <Link href="/create-event">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Event</span>
                </Link>
              </Button>

              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={15} />}
                    href="/my-tickets"
                  />

                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Building size={15} />}
                    href="/my-events"
                  />

                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </Authenticated>

            <Unauthenticated>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>

        {/* Mobile Search & Location - Below Header */}
        <div className="md:hidden border-t px-3 py-3">
          <SearchLocationBar />
        </div>

        {/* Lodaing */}
        {isLoading && (
          <div className="bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#B153D7" />
          </div>
        )}
      </nav>

      {/* Modals  */}
      <OnboardingModal
        isOpen={showOnboaring}
        onClose={handleOnboardingSkip}
        onComplete={handleOnboardingComplete}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="header"
      />
    </>
  );
};

export default Header;
