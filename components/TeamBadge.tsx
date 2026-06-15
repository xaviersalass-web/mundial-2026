import Image from "next/image";
import type { TeamRef } from "@/lib/types/models";

// Shows the crest when available (real API data), otherwise a TLA chip (mock/free tier).
export function TeamBadge({ team, size = 24 }: { team: TeamRef; size?: number }) {
  if (team.crest) {
    return (
      <Image
        src={team.crest}
        alt={team.name}
        width={size}
        height={size}
        className="inline-block rounded-sm object-contain"
        unoptimized
      />
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-sm bg-white/10 font-mono font-bold text-white/80"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {team.tla ?? team.name.slice(0, 3).toUpperCase()}
    </span>
  );
}
