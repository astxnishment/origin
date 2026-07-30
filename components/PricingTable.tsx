"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ALL_PUBLIC_PRICES,
  type PublicPriceRow,
} from "@/lib/publicPricing";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const ROWS_PER_PAGE = 8;

function unique(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function PriceStatus({ row }: { row: PublicPriceRow }) {
  return (
    <div className="text-right">
      <p className="text-[13px] font-semibold tabular-nums text-foreground">
        {row.priceLabel}
      </p>
      {row.quoteOnly && row.minPrice !== null && (
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          estimate
        </p>
      )}
    </div>
  );
}

export default function PricingTable() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Choose category");
  const [brand, setBrand] = useState("All brands");
  const [repair, setRepair] = useState("All repairs");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => unique(ALL_PUBLIC_PRICES.map((row) => row.category)),
    []
  );
  const brands = useMemo(
    () => unique(ALL_PUBLIC_PRICES.map((row) => row.brand)),
    []
  );
  const repairs = useMemo(
    () => unique(ALL_PUBLIC_PRICES.map((row) => row.repair)),
    []
  );

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    const hasSelection =
      Boolean(term) ||
      category !== "Choose category" ||
      brand !== "All brands" ||
      repair !== "All repairs";
    if (!hasSelection) return [];

    return ALL_PUBLIC_PRICES.filter((row) => {
      if (category !== "Choose category" && row.category !== category) return false;
      if (brand !== "All brands" && row.brand !== brand) return false;
      if (repair !== "All repairs" && row.repair !== repair) return false;
      if (!term) return true;
      return [
        row.category,
        row.brand,
        row.model,
        row.repair,
        row.part,
        row.tier,
      ].some((value) => value.toLowerCase().includes(term));
    });
  }, [brand, category, query, repair]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const visibleRows = filteredRows.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE
  );
  const hasSelection =
    Boolean(query.trim()) ||
    category !== "Choose category" ||
    brand !== "All brands" ||
    repair !== "All repairs";

  function updateFilter(update: () => void) {
    update();
    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setCategory("Choose category");
    setBrand("All brands");
    setRepair("All repairs");
    setPage(1);
  }

  function downloadCsv() {
    const headers = [
      "Category",
      "Brand",
      "Device",
      "Repair",
      "Part quality",
      "Minimum price",
      "Maximum price",
      "Time",
      "Warranty",
      "Tier",
      "Note",
    ];
    const lines = [
      headers.map(csvCell).join(","),
      ...filteredRows.map((row) =>
        [
          row.category,
          row.brand,
          row.model,
          row.repair,
          row.part,
          row.minPrice,
          row.maxPrice,
          row.time,
          row.warranty,
          row.tier,
          row.note,
        ]
          .map(csvCell)
          .join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "origin-repairs-price-table.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) =>
                updateFilter(() => setQuery(event.target.value))
              }
              placeholder="Search device, repair or part quality"
              aria-label="Search price table"
              className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[color:var(--control-border-hover)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
            <select
              value={category}
              onChange={(event) =>
                updateFilter(() => setCategory(event.target.value))
              }
              aria-label="Filter by category"
              className="h-10 min-w-36 rounded-md border border-border bg-card px-3 text-[12px] text-foreground outline-none"
            >
              <option>Choose category</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={brand}
              onChange={(event) =>
                updateFilter(() => setBrand(event.target.value))
              }
              aria-label="Filter by brand"
              className="h-10 min-w-32 rounded-md border border-border bg-card px-3 text-[12px] text-foreground outline-none"
            >
              <option>All brands</option>
              {brands
                .filter((item) => item !== "All brands")
                .map((item) => (
                  <option key={item}>{item}</option>
                ))}
            </select>

            <select
              value={repair}
              onChange={(event) =>
                updateFilter(() => setRepair(event.target.value))
              }
              aria-label="Filter by repair"
              className="h-10 min-w-40 rounded-md border border-border bg-card px-3 text-[12px] text-foreground outline-none"
            >
              <option>All repairs</option>
              {repairs.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={downloadCsv}
            disabled={!hasSelection}
            title="Download filtered prices as CSV"
            aria-label="Download filtered prices as CSV"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-surface disabled:opacity-35"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex min-h-6 items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {hasSelection
              ? `${filteredRows.length} matching price option${filteredRows.length === 1 ? "" : "s"}`
              : `${ALL_PUBLIC_PRICES.length} prices available`}
          </p>
          {hasSelection && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-[11px] font-medium text-foreground hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {!hasSelection && (
        <div className="p-4 sm:p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Choose a category
          </p>
          <div className="grid overflow-hidden rounded-md border border-border sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => updateFilter(() => setCategory(item))}
                className="min-h-14 border-b border-border px-4 py-3 text-left text-[13px] font-semibold text-foreground transition-colors hover:bg-surface sm:border-r lg:[&:nth-child(3n)]:border-r-0"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasSelection && (
        <div className="hidden md:block">
        <div className="grid grid-cols-[1.4fr_1.4fr_1.2fr_0.8fr_0.8fr] gap-4 border-b border-border bg-card px-5 py-3">
          {["Device", "Repair", "Part quality", "Time / warranty", "Price"].map(
            (label, index) => (
              <p
                key={label}
                className={`text-[10px] font-semibold uppercase tracking-widest text-muted-foreground ${
                  index === 4 ? "text-right" : ""
                }`}
              >
                {label}
              </p>
            )
          )}
        </div>

        {visibleRows.map((row) => (
          <Link
            key={row.id}
            href={row.href}
            className="grid min-h-20 grid-cols-[1.4fr_1.4fr_1.2fr_0.8fr_0.8fr] items-center gap-4 border-b border-border px-5 py-3 last:border-b-0 hover:bg-surface"
            title={row.note}
          >
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-foreground">
                {row.model}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {row.brand} · {row.category}
              </p>
            </div>
            <p className="text-[12px] leading-snug text-foreground">
              {row.repair}
            </p>
            <div className="min-w-0">
              <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                {row.part}
              </p>
              <p className="mt-1 text-[10px] font-medium text-[color:var(--icon-fg)]">
                {row.tier}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-foreground">{row.time}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {row.warranty}
              </p>
            </div>
            <PriceStatus row={row} />
          </Link>
        ))}
        </div>
      )}

      {hasSelection && (
        <div className="md:hidden">
        {visibleRows.map((row) => (
          <Link
            key={row.id}
            href={row.href}
            className="border-b border-border p-4 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-foreground">
                  {row.model}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {row.brand} · {row.category}
                </p>
              </div>
              <PriceStatus row={row} />
            </div>
            <p className="mt-3 text-[12px] font-medium text-foreground">
              {row.repair}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {row.part} · {row.time} · {row.warranty}
            </p>
          </Link>
        ))}
        </div>
      )}

      {hasSelection && visibleRows.length === 0 && (
        <div className="px-5 py-16 text-center">
          <p className="text-[14px] font-medium text-foreground">
            No matching prices
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Try a different model, repair or filter.
          </p>
        </div>
      )}

      {hasSelection && visibleRows.length > 0 && (
        <div className="flex items-center justify-between gap-4 border-t border-border bg-surface px-4 py-3 sm:px-5">
        <p className="text-[11px] text-muted-foreground">
          Page {safePage} of {pageCount}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage === 1}
            aria-label="Previous price page"
            title="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
            disabled={safePage === pageCount}
            aria-label="Next price page"
            title="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        </div>
      )}
    </div>
  );
}
