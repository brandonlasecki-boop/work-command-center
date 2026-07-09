export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-950">
      {children}
    </div>
  );
}
