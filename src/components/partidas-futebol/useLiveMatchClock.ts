import { useState, useEffect, useRef } from "react";

type Status = {
  short: string;
  elapsed?: number;
  extra?: number;
  fetchedAt?: number;
};

export function useLiveMatchClock(status: Status, fetchedAt?: number) {
  const [now, setNow] = useState(Date.now());
  const initialFetchedAt = useRef(fetchedAt || Date.now());

  useEffect(() => {
    if (!["1H", "2H", "ET", "LIVE", "IN_PROGRESS"].includes(status.short)) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [status.short]);

  let elapsed = status.elapsed ?? 0;
  let extra = status.extra ?? 0;

  if (["1H", "2H", "ET", "LIVE", "IN_PROGRESS"].includes(status.short)) {
    const minutesSinceFetch = Math.floor((now - initialFetchedAt.current) / 60000);
    elapsed += minutesSinceFetch;
  }

  return { elapsed, extra, statusShort: status.short };
}