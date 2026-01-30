import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <div className="text-center sm:text-left">
            <span className="text-gray-500 font-light tracking-wide mb-6">
              <span className="text-purple-400">Z</span>enAura
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight">
              Discover &<br />
              Create amazing
              <br />
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                event.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-lg font-light">
              Whether it&apos;s your event or someone else&apos;s, ZenAura turns
              every gathering into a memorable experience. Join our community
              today.
            </p>

            <Link href="/explore">
              <Button size="xl" className={"rounded-full"}>
                Get Started
              </Button>
            </Link>
          </div>
          {/* Right */}
          <Image
            src="/hero.png"
            alt="hero meetup"
            height={700}
            width={700}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>
    </div>
  );
}
