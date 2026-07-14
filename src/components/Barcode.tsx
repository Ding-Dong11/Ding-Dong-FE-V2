const bars = "2113121122311213112132211231121321122113311221123121";

export default function Barcode({ value }: { value: string }) {
  let x = 0;
  const rects = bars.split("").map((w, i) => {
    const width = Number(w) * 2.2;
    const rect = i % 2 === 0 ? <rect key={i} x={x} y={0} width={width} height={54} fill="#111" /> : null;
    x += width;
    return rect;
  });
  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${x} 54`} className="h-16 w-72" preserveAspectRatio="none" aria-hidden="true">
        {rects}
      </svg>
      <span className="mt-1 text-sm tracking-widest text-neutral-600">{value}</span>
    </div>
  );
}
