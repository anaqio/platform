export function DepthGrid() {
  return (
    <aside className="relative z-20 h-40 w-full overflow-hidden sm:h-48">
      <div className="absolute inset-0 bg-gradient-to-r from-aq-grad-start via-aq-grad-mid2 to-aq-grad-end" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="perspective-grid mx-auto h-[160%] w-[120%]" />
      </div>
      <div className="grid-shimmer pointer-events-none absolute inset-0 opacity-20" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />
    </aside>
  );
}
