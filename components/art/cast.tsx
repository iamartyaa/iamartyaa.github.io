/**
 * THE CAST — every drawing on this site.
 *
 * House rules (locked in the design canvas):
 *  • one ink colour (#241f1c), round caps and joins, stroke 2.4 / 3 / 3.5 by scale
 *  • flat fills from the palette, never gradients
 *  • every face has the same eyes, so the whole cast reads as one hand
 * Eyes carry `animate-blink` so the page is quietly alive at rest.
 */

const INK = "#241f1c";

type ArtProps = { className?: string; size?: number };

function Eyes({ cx1, cx2, cy, r }: { cx1: number; cx2: number; cy: number; r: number }) {
  return (
    <>
      <circle className="animate-blink origin-center" cx={cx1} cy={cy} r={r} fill={INK} />
      <circle className="animate-blink origin-center" cx={cx2} cy={cy} r={r} fill={INK} />
    </>
  );
}

/** The mark. Head only — used in the nav sticker and the favicon. */
export function AvatarMark({ className, size = 30 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 30 30" aria-hidden>
      <circle cx="15" cy="16" r="12" fill="var(--peach)" stroke={INK} strokeWidth="2.4" />
      <path d="M4 13 C 7 2, 25 1, 27 12 C 20 8, 10 8, 4 13 Z" fill={INK} />
      <circle cx="10.5" cy="17" r="4.2" fill="#fff" stroke={INK} strokeWidth="2" />
      <circle cx="20" cy="17" r="4.2" fill="#fff" stroke={INK} strokeWidth="2" />
      <path d="M14.7 17 L 15.8 17" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <Eyes cx1={10.8} cx2={20.3} cy={17.4} r={1.5} />
      <path d="M12 23 Q 15 25.5, 18 23" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Faces share three moods across the cast, so a reaction reads the same everywhere. */
export type Mood = "rest" | "peeling" | "placed";

/**
 * Full figure, waving. The hero portrait and the contact card.
 *
 * `mood` drives the face only — the body never changes, which is what keeps
 * the three states feeling like one drawing reacting rather than three
 * different characters. `onDark` outlines the hair in paper: on the ink card
 * the black hair used to dissolve into the background and leave a floating
 * face.
 */
export function AvatarWaving({
  className,
  size = 300,
  mood = "rest",
  onDark = false,
}: ArtProps & { mood?: Mood; onDark?: boolean }) {
  const hairStroke = onDark ? "var(--paper)" : "none";
  return (
    <svg
      className={className}
      width={size}
      height={size * 1.15}
      viewBox="0 0 300 345"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <ellipse cx="150" cy="332" rx="96" ry="11" fill={onDark ? "rgba(0,0,0,0.35)" : "rgba(40,30,20,0.12)"} />
      <rect x="98" y="182" width="104" height="150" rx="34" fill="var(--blue)" stroke={INK} strokeWidth="3.5" />
      {/* the waving arm — it goes straight up when the sticker is being peeled */}
      <g style={{ transformOrigin: "202px 202px", transform: mood === "peeling" ? "rotate(-24deg)" : "none" }}>
        <path d="M202 202 C 236 190, 246 152, 228 128" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path
          d="M220 124 L 236 110 M226 133 L 246 126 M225 145 L 242 149"
          stroke={INK}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <path
        d={mood === "peeling" ? "M98 212 C 74 196, 62 168, 78 146" : "M98 212 C 72 222, 68 258, 92 272"}
        stroke={INK}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="150" cy="106" r="62" fill="var(--peach)" stroke={INK} strokeWidth="3.5" />
      {/* hair: filled ink, but outlined in paper on dark grounds so it never
          disappears into the card behind it */}
      <path
        d="M88 94 C 94 34, 206 22, 220 82 C 200 58, 126 58, 88 94 Z"
        fill={INK}
        stroke={hairStroke}
        strokeWidth={onDark ? 4 : 0}
        strokeLinejoin="round"
      />
      {onDark ? (
        <path d="M112 58 C 132 44, 168 42, 190 52" stroke="var(--paper)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
      ) : null}

      {mood === "placed" ? (
        <>
          {/* eyes closed, delighted */}
          <path d="M114 120 Q 128 108, 142 120" stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M158 120 Q 172 108, 186 120" stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M130 142 Q 150 164, 170 142" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "peeling" ? (
        <>
          {/* raised brows, wide eyes, a small startled mouth */}
          <path d="M114 94 Q 128 86, 140 92" stroke={INK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M160 92 Q 172 86, 186 94" stroke={INK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <circle cx="128" cy="120" r="17.5" fill="#fff" stroke={INK} strokeWidth="3.5" />
          <circle cx="172" cy="120" r="17.5" fill="#fff" stroke={INK} strokeWidth="3.5" />
          <circle cx="129" cy="117" r="4.6" fill={INK} />
          <circle cx="173" cy="117" r="4.6" fill={INK} />
          <ellipse cx="150" cy="150" rx="9" ry="11" fill={INK} />
        </>
      ) : (
        <>
          <circle cx="128" cy="118" r="16" fill="#fff" stroke={INK} strokeWidth="3.5" />
          <circle cx="172" cy="118" r="16" fill="#fff" stroke={INK} strokeWidth="3.5" />
          <path d="M144 118 L 156 118" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <Eyes cx1={129} cx2={173} cy={120} r={4.2} />
          <path d="M134 144 Q 150 158, 166 144" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
      <circle cx="112" cy="136" r="7" fill="#f4a58a" opacity={mood === "rest" ? 0.75 : 0.95} />
      <circle cx="188" cy="136" r="7" fill="#f4a58a" opacity={mood === "rest" ? 0.75 : 0.95} />
    </svg>
  );
}

/**
 * The cat. Tail wags on its own timer.
 *
 * `look` moves the pupils (−1..1 in each axis) so a wrapper can point them at
 * the cursor; `mood` is the click reaction. The eyes are drawn as a white +
 * pupil pair here rather than the shared ink dots, because a pupil needs
 * somewhere to move inside.
 */
export function Cat({
  className,
  size = 160,
  look = { x: 0, y: 0 },
  mood = "rest",
  blink = false,
}: ArtProps & { look?: { x: number; y: number }; mood?: "rest" | "happy" | "startled"; blink?: boolean }) {
  const dx = Math.max(-1, Math.min(1, look.x)) * 3.4;
  const dy = Math.max(-1, Math.min(1, look.y)) * 2.6;
  const closed = blink || mood === "happy";
  return (
    <svg className={className} width={size} height={size * 0.8} viewBox="0 0 200 160" aria-hidden style={{ overflow: "visible" }}>
      <path
        className="animate-tailwag origin-[75%_82%]"
        d="M150 132 C 190 126, 196 76, 168 52"
        stroke="#fffdf8"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
      />
      <path
        className="animate-tailwag origin-[75%_82%]"
        d="M150 132 C 190 126, 196 76, 168 52"
        stroke={INK}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M32 148 C 12 100, 32 44, 84 44 C 138 44, 160 92, 152 148 Z"
        fill="#fffdf8"
        stroke={INK}
        strokeWidth="3.5"
      />
      <path
        d="M44 60 L 36 18 L 72 44 M118 44 L 134 14 L 128 60"
        fill="#fffdf8"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M48 56 L 43 32 L 63 45 Z" fill="#f4a58a" />
      <path d="M119 45 L 129 26 L 126 55 Z" fill="#f4a58a" />

      {closed ? (
        <>
          <path d="M58 90 Q 68 80, 78 90" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M102 90 Q 112 80, 122 90" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="68" cy="88" rx="9.5" ry={mood === "startled" ? 11.5 : 10} fill="#fff" stroke={INK} strokeWidth="2.6" />
          <ellipse cx="112" cy="88" rx="9.5" ry={mood === "startled" ? 11.5 : 10} fill="#fff" stroke={INK} strokeWidth="2.6" />
          <circle cx={68 + dx} cy={88 + dy} r={mood === "startled" ? 3.4 : 5} fill={INK} />
          <circle cx={112 + dx} cy={88 + dy} r={mood === "startled" ? 3.4 : 5} fill={INK} />
        </>
      )}

      <path d="M83 102 L 90 109 L 97 102" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {mood === "happy" ? (
        <path d="M78 116 Q 90 128, 102 116" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : null}
      <path
        d="M8 96 L 46 92 M8 112 L 46 104 M172 96 L 134 92 M172 112 L 134 104"
        stroke={INK}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The mug. Steam rises on a loop. */
export function Mug({ className, size = 150, mood = "rest" }: ArtProps & { mood?: "rest" | "sip" }) {
  return (
    <svg className={className} width={size} height={size * 1.2} viewBox="0 0 150 180" aria-hidden>
      <g stroke="#c3b8a5" strokeWidth="3.4" fill="none" strokeLinecap="round">
        <path className="animate-steam" d="M46 70 C 36 54, 56 46, 46 28" />
        <path className="animate-steam [animation-delay:-1.4s]" d="M74 70 C 64 52, 84 44, 74 22" />
        <path className="animate-steam [animation-delay:-2.5s]" d="M100 70 C 90 54, 110 46, 100 32" />
      </g>
      <path d="M28 84 L 36 160 L 110 160 L 118 84 Z" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <path d="M118 96 C 146 96, 146 136, 114 138" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {mood === "sip" ? (
        <>
          <path d="M50 116 Q 58 108, 66 116" stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M80 116 Q 88 108, 96 116" stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M60 130 Q 73 142, 86 130" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="42" cy="128" r="5.5" fill="#f4a58a" opacity="0.8" />
          <circle cx="104" cy="128" r="5.5" fill="#f4a58a" opacity="0.8" />
        </>
      ) : (
        <>
          <Eyes cx1={58} cx2={88} cy={116} r={4} />
          <path d="M62 132 Q 73 140, 84 132" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      <path d="M28 84 L 118 84" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/** The plant — "still growing". */
export function Plant({ className, size = 120 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <path
        d="M60 104 C 48 76, 26 66, 24 34 C 50 40, 58 68, 60 90 C 62 68, 72 40, 96 34 C 94 66, 72 76, 60 104 Z"
        fill="var(--green)"
        stroke={INK}
        strokeWidth="3"
      />
      <rect x="38" y="100" width="44" height="14" rx="5" fill="#c98a5a" stroke={INK} strokeWidth="3" />
      <Eyes cx1={53} cx2={67} cy={62} r={2.6} />
      <path d="M55 71 Q 60 75, 65 71" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** The paper plane — the route's protagonist. */
export function PaperPlane({ className, size = 190 }: ArtProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size * 0.74}
      viewBox="0 0 190 140"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <path d="M6 68 L 184 12 L 122 132 L 100 86 Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M6 68 L 100 86 L 184 12 Z" fill="#e9eef9" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 86 L 112 112 L 122 132" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Eyes cx1={66} cx2={84} cy={64} r={3} />
      <path d="M70 76 Q 78 82, 86 74" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** The monitor — "things I made". */
export function Monitor({ className, size = 130 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size * 0.87} viewBox="0 0 150 130" aria-hidden>
      <rect x="26" y="34" width="104" height="72" rx="13" fill="var(--yellow)" stroke={INK} strokeWidth="3" />
      <rect x="62" y="12" width="30" height="22" rx="6" fill="#fff" stroke={INK} strokeWidth="3" />
      <Eyes cx1={58} cx2={96} cy={66} r={4} />
      <path d="M64 84 Q 77 95, 90 84" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M46 106 L 46 122 M112 106 L 112 122" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** The rocket — a thing that shipped. */
export function Rocket({ className, size = 130 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 130 130" aria-hidden>
      <path d="M65 10 C 90 34, 100 78, 90 112 L 40 112 C 30 78, 40 34, 65 10 Z" fill="#fff" stroke={INK} strokeWidth="3" />
      <path
        d="M40 92 L 16 118 L 40 112 M90 92 L 114 118 L 90 112"
        fill="var(--orange)"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="65" cy="52" r="13" fill="var(--sky)" stroke={INK} strokeWidth="3" />
      <path d="M52 112 Q 65 132, 78 112" fill="var(--yellow)" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/** The notebook — notes and drawings. */
export function Notebook({ className, size = 130 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size * 0.87} viewBox="0 0 130 113" aria-hidden>
      <rect x="22" y="14" width="86" height="86" rx="9" fill="#fff" stroke={INK} strokeWidth="3" />
      <path d="M22 32 H108 M42 14 V100" stroke={INK} strokeWidth="2" fill="none" />
      <path d="M56 50 H96 M56 64 H86 M56 78 H94" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="46" r="3.4" fill="var(--yellow)" stroke={INK} strokeWidth="2" />
      <circle cx="32" cy="68" r="3.4" fill="var(--orange)" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

/** Little marks used inside stickers. */
export function Sparkle({ className, size = 22 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2 L 14.5 9 L 22 10 L 16.5 15 L 18 22 L 12 18.5 L 6 22 L 7.5 15 L 2 10 L 9.5 9 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SmileyDot({ className, size = 22 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="var(--yellow)" stroke={INK} strokeWidth="2.4" />
      <circle cx="9" cy="11" r="1.4" fill={INK} />
      <circle cx="15" cy="11" r="1.4" fill={INK} />
      <path d="M9 15 Q 12 17.5, 15 15" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** The X mark, drawn in the same ink as everything else. */
export function XMark({ className, size = 18 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M4 4 L 20 20 M20 4 L 4 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ArrowRight({ className, size = 18 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path
        d="M3 10 H16 M11 5 L 16 10 L 11 15"
        stroke="currentColor"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Hand-drawn curved arrow used beside margin notes. */
export function CurlyArrow({ className, size = 60 }: ArtProps) {
  return (
    <svg className={className} width={size} height={size / 2} viewBox="0 0 60 30" aria-hidden>
      <path d="M2 6 C 20 30, 40 30, 56 8" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M48 6 L 57 8 L 54 17" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
