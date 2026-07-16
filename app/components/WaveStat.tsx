interface WaveStatProps {
  total: number;
  layCases: number;
  ministerCases: number;
}

export default function WaveStat({ total, layCases, ministerCases }: WaveStatProps) {
  const layShare = total > 0 ? (layCases / total) * 100 : 50;
  const ministerShare = total > 0 ? (ministerCases / total) * 100 : 50;

  return (
    <div className="rounded-3xl border border-mist-200 bg-white p-6 shadow-sm dark:border-mist-700 dark:bg-mist-800 sm:p-8">
      <div className="flex flex-col gap-1">
        <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-mist-400 dark:text-mist-500">
          Total cases given to date
        </span>
        <span className="font-display text-5xl font-extrabold tabular-nums text-ink-900 dark:text-mist-50 sm:text-6xl">
          {total.toLocaleString()}
        </span>
      </div>

      {/* Signature element: a filling water channel, split by who gave */}
      <div className="mt-6">
        <div className="relative h-5 w-full overflow-hidden rounded-full bg-mist-100 dark:bg-mist-900/60">
          <div
            className="absolute inset-y-0 left-0 flex h-full transition-[width] duration-700 ease-out"
            style={{ width: total > 0 ? "100%" : "0%" }}
          >
            <div
              className="relative h-full overflow-hidden bg-wave-DEFAULT transition-[width] duration-700 ease-out"
              style={{ width: `${layShare}%` }}
            >
              <WaveTexture />
            </div>
            <div
              className="relative h-full overflow-hidden bg-wave-dark transition-[width] duration-700 ease-out"
              style={{ width: `${ministerShare}%` }}
            >
              <WaveTexture />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-mist-500 dark:text-mist-400">
          <LegendDot color="bg-wave-DEFAULT" label="Lay members" value={layCases} />
          <LegendDot color="bg-wave-dark" label="Ministers" value={ministerCases} />
        </div>
      </div>
    </div>
  );
}

function WaveTexture() {
  return (
    <svg
      className="absolute inset-0 h-full w-[200%] animate-wave opacity-40"
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 10 Q 10 4 20 10 T 40 10 T 60 10 T 80 10 T 100 10 T 120 10 T 140 10 T 160 10 T 180 10 T 200 10 V20 H0 Z"
        fill="rgba(255,255,255,0.5)"
      />
    </svg>
  );
}

function LegendDot({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="font-medium text-mist-600 dark:text-mist-300">{label}</span>
      <span className="tabular-nums">{value.toLocaleString()}</span>
    </span>
  );
}
