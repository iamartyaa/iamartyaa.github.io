"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AvatarMark, ArrowRight } from "@/components/art/cast";
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";
import { PullCord } from "@/components/site/pull-cord";
import { Sticker } from "@/components/site/sticker";
import { cn } from "@/lib/utils";

const ROUTES = [
  { href: "/", label: "the desk" },
  { href: "/things", label: "things" },
  { href: "/writing", label: "writing" },
  { href: "/about", label: "about" },
] as const;

/**
 * Three stickers on a sheet, not a nav bar. The active route is the ink
 * sticker; hovering the others glides a soft pill between them
 * (beUI SharedLayoutBg) so the row feels like one object.
 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-gutter py-6">
      {/* Content scrolls under the nav; this fades the paper up behind it so
          cards never collide with the stickers. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-paper via-paper/85 to-transparent"
      />
      <nav className="pointer-events-auto mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-y-3">
        <Link href="/" aria-label="Amartya — home">
          <Sticker tone="white" size="sm" tilt={-2.5} display className="text-[19px]">
            <AvatarMark size={26} />
            amartya
          </Sticker>
        </Link>

        <SharedLayoutBg
          as="div"
          className="order-3 w-full flex-row items-center justify-center gap-2 md:order-none md:w-auto md:gap-3"
          inset={6}
          pillClassName="rounded-full bg-ink/[0.05]"
        >
          {ROUTES.map((route, i) => {
            const active = pathname === route.href;
            return (
              <div key={route.href}>
                <Link href={route.href} aria-current={active ? "page" : undefined}>
                  <Sticker
                    tone={active ? "ink" : "white"}
                    size="md"
                    tilt={active ? 0 : i % 2 ? 1.5 : -1.5}
                    className={cn(active && "shadow-[var(--shadow-sticker-sm)]")}
                  >
                    {route.label}
                  </Sticker>
                </Link>
              </div>
            );
          })}
        </SharedLayoutBg>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <Sticker tone="orange" size="md" tilt={2.5} magnetic href="/about#say-hi">
            say hi
            <ArrowRight size={18} />
          </Sticker>
        </div>
      </nav>

      {/* Home switches the theme by pulling the desk lamp's chain; everywhere
          else the same string hangs off the top edge of the page. */}
      {pathname === "/" ? null : <PullCord className="pointer-events-none" />}
    </header>
  );
}
