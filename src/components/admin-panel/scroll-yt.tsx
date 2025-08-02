import React from "react";
import "./scroll-yt.css";

export function ScrollYt({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`yt-scrollbar ${className}`}>{children}</div>
  );
}