"use client";

import { useEffect, useMemo, useState } from "react";
import type { Donation, MemberTag, SiteText } from "@/lib/notion";
import { DEFAULT_SITE_TEXT } from "@/lib/notion";
import WaveStat from "./components/WaveStat";
import ThemeToggle from "./components/ThemeToggle";
import BrandMark from "./components/BrandMark";

type FilterMode = "all" | "excluding" | "only";
type SortMode = "name" | "cases-desc" | "cases-asc" | "newest" | "oldest";

const FILTERS: { id: FilterMode; label: string }[] = [
  { id: "all", label: "Including Ministers" },
  { id: "excluding", label: "Excluding Ministers" },
  { id: "only", label: "Ministers Only" },
];

const SORTS: { id: SortMode; label: string }[] = [
  { id: "cases-desc", label: "Most cases" },
  { id: "cases-asc", label: "Fewest cases" },
  { id: "name", label: "Name (A–Z)" },
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
];

export default function Home() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [siteText, setSiteText] = useState<SiteText>(DEFAULT_SITE_TEXT);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<SortMode>("cases-desc");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/donations");
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setErrorMessage(data.error ?? "Something went wrong loading donations.");
          setStatus("error");
          return;
        }
        setDonations(data.donations ?? []);
        if (data.siteText) setSiteText(data.siteText);
        setStatus("ready");
      } catch (err: any) {
        if (cancelled) return;
        setErrorMessage(err?.message ?? "Could not reach the server.");
        setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = donations;
    if (filter === "excluding") list = list.filter((d) => d.tag !== "Minister");
    if (filter === "only") list = list.filter((d) => d.tag === "Minister");

    return [...list].sort((a, b) => {
      switch (sort) {
        case "cases-desc":
          return b.cases - a.cases;
        case "cases-asc":
          return a.cases - b.cases;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return (b.dateGiven ?? "").localeCompare(a.dateGiven ?? "");
        case "oldest":
          return (a.dateGiven ?? "").localeCompare(b.dateGiven ?? "");
        default:
          return 0;
      }
    });
  }, [donations, filter, sort]);

  const totals = useMemo(() => {
    const totalCases = filtered.reduce((sum, d) => sum + d.cases, 0);
    const donorCount = filtered.length;
    const layCases = donations
      .filter((d) => d.tag === "Lay Member")
      .reduce((sum, d) => sum + d.cases, 0);
    const ministerCases = donations
      .filter((d) => d.tag === "Minister")
      .reduce((sum, d) => sum + d.cases, 0);
    const allTimeTotal = layCases + ministerCases;
    return { totalCases, donorCount, layCases, ministerCases, allTimeTotal };
  }, [filtered, donations]);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <header className="flex items-start justify-between gap-4">
          <div className="animate-rise">
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-steel-500 dark:text-steel-300">
              VOW Center · iThirst Ministry
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-900 dark:text-mist-50 sm:text-4xl">
              {siteText.header}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-mist-600 dark:text-mist-400">
              {siteText.subheader}
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="mt-8 animate-rise [animation-delay:80ms]">
          <WaveStat
            total={totals.allTimeTotal}
            layCases={totals.layCases}
            ministerCases={totals.ministerCases}
            goal={siteText.goal}
            casesGivenAway={siteText.casesGivenAway}
          />
        </section>

        <section className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Filter by tag"
            className="inline-flex rounded-full border border-mist-200 bg-white p-1 text-sm dark:border-mist-700 dark:bg-mist-800"
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                  filter === f.id
                    ? "bg-steel-500 text-white shadow-sm"
                    : "text-mist-600 hover:text-ink-900 dark:text-mist-300 dark:hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-mist-600 dark:text-mist-300">
            <span className="font-medium">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm text-ink-900 shadow-sm focus:border-steel-400 dark:border-mist-700 dark:bg-mist-800 dark:text-mist-100"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="mt-6">
          {status === "loading" && <ListSkeleton />}

          {status === "error" && (
            <div className="rounded-2xl border border-mist-200 bg-white p-8 text-center dark:border-mist-700 dark:bg-mist-800">
              <p className="font-display font-semibold text-ink-900 dark:text-mist-50">
                Couldn&apos;t load donations
              </p>
              <p className="mt-1 text-sm text-mist-500 dark:text-mist-400">
                {errorMessage}
              </p>
            </div>
          )}

          {status === "ready" && filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-mist-300 bg-white/60 p-10 text-center dark:border-mist-700 dark:bg-mist-800/40">
              <p className="font-display font-semibold text-ink-900 dark:text-mist-50">
                No entries yet
              </p>
              <p className="mt-1 text-sm text-mist-500 dark:text-mist-400">
                Add a row to the iThirst Water Donations database in Notion and
                it will show up here.
              </p>
            </div>
          )}

          {status === "ready" && filtered.length > 0 && (
            <DonationTable donations={filtered} />
          )}
        </section>

        <p className="mt-10 text-center text-xs text-mist-400 dark:text-mist-500">
          {totals.donorCount} {totals.donorCount === 1 ? "entry" : "entries"}{" "}
          shown · Data synced from DB
        </p>

        <BrandMark />
      </div>
    </main>
  );
}

function DonationTable({ donations }: { donations: Donation[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm dark:border-mist-700 dark:bg-mist-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-mist-200 bg-mist-50 text-xs uppercase tracking-wide text-mist-500 dark:border-mist-700 dark:bg-mist-900/40 dark:text-mist-400">
            <th className="px-5 py-3 font-semibold">Name</th>
            <th className="px-5 py-3 font-semibold">Tag</th>
            <th className="px-5 py-3 text-right font-semibold">Cases</th>
            <th className="hidden px-5 py-3 font-semibold sm:table-cell">
              Date given
            </th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d, i) => (
            <tr
              key={d.id}
              className={`border-b border-mist-100 last:border-0 dark:border-mist-700/60 ${
                i % 2 === 1 ? "bg-mist-50/60 dark:bg-mist-900/20" : ""
              }`}
            >
              <td className="px-5 py-3 font-medium text-ink-900 dark:text-mist-100">
                {d.name}
              </td>
              <td className="px-5 py-3">
                <TagPill tag={d.tag} />
              </td>
              <td className="px-5 py-3 text-right font-display font-bold text-steel-600 dark:text-steel-300">
                {d.cases}
              </td>
              <td className="hidden px-5 py-3 text-mist-500 dark:text-mist-400 sm:table-cell">
                {formatDate(d.dateGiven)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TagPill({ tag }: { tag: MemberTag }) {
  const isMinister = tag === "Minister";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isMinister
          ? "bg-steel-100 text-steel-700 dark:bg-steel-900/60 dark:text-steel-200"
          : "bg-mist-100 text-mist-600 dark:bg-mist-700 dark:text-mist-300"
      }`}
    >
      {tag}
    </span>
  );
}

function ListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white dark:border-mist-700 dark:bg-mist-800">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-mist-100 px-5 py-4 last:border-0 dark:border-mist-700/60"
        >
          <div className="h-3 w-32 animate-pulse rounded bg-mist-200 dark:bg-mist-700" />
          <div className="h-3 w-16 animate-pulse rounded-full bg-mist-200 dark:bg-mist-700" />
          <div className="ml-auto h-3 w-8 animate-pulse rounded bg-mist-200 dark:bg-mist-700" />
        </div>
      ))}
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
