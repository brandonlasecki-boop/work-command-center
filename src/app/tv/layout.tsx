import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tv-root h-full w-full overflow-hidden bg-slate-950">
      {children}
    </div>
  );
}
