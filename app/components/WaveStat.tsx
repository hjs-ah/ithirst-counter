interface WaveStatProps {
  total: number;
  layCases: number;
  ministerCases: number;
  layLabel: string;
  goal: number;
  casesGivenAway: number;
}

export default function WaveStat({
  total,
  layCases,
  ministerCases,
  layLabel,
  goal,
  casesGivenAway,
}: WaveStatProps) {
  const layShare = total > 0 ? (layCases / total) * 100 : 50;
  const ministerShare = total > 0 ? (ministerCases / total) * 100 : 50;
  const goalPercent = goal > 0 ? Math.round((total / goal) * 100) : 0;
  const goalProgressWidth = Math.min(100, goalPercent);
  const goalReached = total >= goal;
  const inStock = Math.max(0, total - casesGivenAway);

  return (
    <div className="rounded-3xl border border-mist-200 bg-white p-6 shadow-sm dark:border-mist-700 dark:bg-mist-800 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-mist-400 dark:text-mist-500">
            Total cases given to date
          </span>
          <span className="font-display text-5xl font-extrabold tabular-nums text-ink-900 dark:text-mist-50 sm:text-6xl">
            {total.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-mist-400 dark:text-mist-500">
            {goalReached ? "Goal reached" : "Goal"}
          </span>
          <span className="font-display text-2xl font-bold tabular-nums text-steel-600 dark:text-steel-300">
            {goalPercent}%{" "}
            <span className="text-sm font-medium text-mist-400 dark:text-mist-500">
              of {goal.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* Goal progress */}
      <div className="mt-5">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-mist-100 dark:bg-mist-900/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-wave-light to-steel-500 transition-[width] duration-700 ease-out"
            style={{ width: `${goalProgressWidth}%` }}
          />
        </div>
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
          <LegendDot color="bg-wave-DEFAULT" label={layLabel} value={layCases} />
          <LegendDot color="bg-wave-dark" label="Ministers" value={ministerCases} />
        </div>
      </div>

      {/* Given away vs. still in stock */}
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-mist-100 pt-5 dark:border-mist-700/60">
        <div className="rounded-2xl bg-mist-50 px-4 py-3 dark:bg-mist-900/40">
          <span className="block text-xs font-medium text-mist-500 dark:text-mist-400">
            Cases given away
          </span>
          <span className="font-display text-xl font-bold tabular-nums text-ink-900 dark:text-mist-50">
            {casesGivenAway.toLocaleString()}
          </span>
        </div>
        <div className="rounded-2xl bg-mist-50 px-4 py-3 dark:bg-mist-900/40">
          <span className="block text-xs font-medium text-mist-500 dark:text-mist-400">
            Still in stock
          </span>
          <span className="font-display text-xl font-bold tabular-nums text-ink-900 dark:text-mist-50">
            {inStock.toLocaleString()}
          </span>
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
