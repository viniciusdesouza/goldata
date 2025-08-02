"use client";
import MatchItem from "./MatchItem";

export default function MatchItemIsolated({ match }: { match: any }) {
  return (
    <div className="mi-match-root not-prose"> {/* "not-prose" para Tailwind, "mi-match-root" para reset */}
      <MatchItem match={match} showFavoritos={false} />
    </div>
  );
}