"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AvatarMark, ArrowRight } from "@/components/art/cast";
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";
import { PullCord } from "@/components/site/pull-cord";
import { Sticker } from "@/components/site/sticker";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

const ROUTES = [
  { href: "/", label: "the desk" },
  { href: "/things", label: "things" },
  { href: "/writings", label: "writings" },
  { href: "/about", label: "about" },
] as const;

/**
 * Stickers on a sheet, not a nav bar. The active route is the ink sticker;
 * hovering the others glides a soft pill between them (beUI SharedLayoutBg)
 * so the row feels like one object.
 *
 * On a desktop the whole thing is one row across the top. On a phone that row
 * used to wrap to two and sit on top of every screen, so below `md` the routes
 * move into a dock at the bottom — thumb reach, and it gets out of the way
 * while you scroll down and comes back when you scroll up. Only the mark and
 * "say hi" stay at the top.
 */
export function SiteNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [tucked, setTucked] = useState(false);

  // the dock hides on the way down and reappears on the way up
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - last;
        if (dy > 6 && y > 160) setTucked(true);
        else if (dy < -6 || y < 80) setTucked(false);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const routes = ROUTES.map((route, i) => {
    const active = pathname === route.href;
    return (
      <div key={route.href}>
        <Link href={route.href} aria-current={active ? "page" : undefined}>
          <Sticker
            tone={active ? "ink" : "white"}
            size="md"
            tilt={active ? 0 : i % 2 ? 1.5 : -1.5}
            className={cn("max-md:px-3.5 max-md:py-2 max-md:text-[14px]", active && "shadow-[var(--shadow-sticker-sm)]")}
          >
            {route.label}
          </Sticker>
        </Link>
      </div>
    );
  });

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-gutter py-4 md:py-6">
        {/* Content scrolls under the nav; this fades the paper up behind it so
            cards never collide with the stickers. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-paper via-paper/80 to-transparent md:h-32"
        />
        <nav className="pointer-events-auto mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          <Link href="/" aria-label="Amartya — home">
            <Sticker tone="white" size="sm" tilt={-2.5} display className="text-[18px] md:text-[19px]">
              <AvatarMark size={26} />
              amartya
            </Sticker>
          </Link>

          <SharedLayoutBg
            as="div"
            className="hidden flex-row items-center gap-3 md:flex"
            inset={6}
            pillClassName="rounded-full bg-ink/[0.05]"
          >
            {routes}
          </SharedLayoutBg>

          <Sticker tone="orange" size="md" tilt={2.5} magnetic href="/about#say-hi" className="max-md:px-4 max-md:py-2 max-md:text-[14px]">
            say hi
            <ArrowRight size={18} />
          </Sticker>
        </nav>

        {/* Home switches the theme by pulling the desk lamp's chain; everywhere
            else the same string hangs off the top edge of the page. */}
        {pathname === "/" ? null : <PullCord className="pointer-events-none hidden md:flex" />}
      </header>

      {/* the phone's dock */}
      <motion.nav
        aria-label="Pages"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        animate={{ y: tucked && !reduce ? 110 : 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-paper/85 px-3 py-2 shadow-[0_0_0_1.5px_var(--hairline),0_18px_30px_-16px_rgba(40,30,20,0.55)] backdrop-blur-md">
          {routes}
          {pathname === "/" ? null : (
            <div className="ml-1 pl-2 border-l-[2px] border-dashed border-hairline">
              <PullCord variant="dock" />
            </div>
          )}
        </div>
      </motion.nav>
    </>
  );
}
