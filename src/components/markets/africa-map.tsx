"use client";

const countries: Array<{ id: string; name: string; x: number; y: number; status: string }> = [
  { id: "ghana", name: "Ghana", x: 28, y: 48, status: "Prototype / Pilot" },
  { id: "nigeria", name: "Nigeria", x: 36, y: 50, status: "Coming soon" },
  { id: "kenya", name: "Kenya", x: 62, y: 58, status: "Coming soon" },
  { id: "south_africa", name: "South Africa", x: 52, y: 86, status: "Coming soon" },
  { id: "brvm", name: "BRVM", x: 22, y: 52, status: "Coming soon" },
];

export function AfricaMap({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <div className="relative overflow-hidden rounded-[1.25rem] bg-[color:var(--navy-card)] text-primary-foreground">
      <svg viewBox="0 0 100 100" className="h-72 w-full opacity-90">
        <ellipse cx="50" cy="52" rx="28" ry="38" fill="#0a1c16" />
        <path d="M35 20 Q50 12 62 22 Q78 40 70 70 Q55 95 45 88 Q28 70 30 40 Z" fill="#12382c" stroke="#c9a24a" strokeWidth="0.6" />
        {countries.map((c) => (
          <g key={c.id}>
            <circle cx={c.x} cy={c.y} r={c.id === "ghana" ? 3.4 : 2.2} fill={c.id === "ghana" ? "#c9a24a" : "#f3eee3"}>
              {c.id === "ghana" ? (
                <animate attributeName="r" values="3.2;4;3.2" dur="2.4s" repeatCount="indefinite" />
              ) : null}
            </circle>
          </g>
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 grid gap-2 p-4 sm:grid-cols-2">
        {countries.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect?.(c.id)}
            className="rounded-xl bg-black/25 px-3 py-2 text-left text-sm backdrop-blur transition hover:-translate-y-0.5"
          >
            <p className="font-medium">{c.name}</p>
            <p className="text-xs text-primary-foreground/70">{c.status}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
