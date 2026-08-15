"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { EmptyState } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { Columns3, ChevronLeft, ChevronRight } from "lucide-react";

export type DataColumn<T> = {
  id: string;
  header: string;
  field: keyof T & string;
  hrefField?: keyof T & string;
  sortable?: boolean;
  filterable?: boolean;
};

function cellValue<T>(row: T, col: DataColumn<T>): string | number {
  const v = row[col.field];
  if (typeof v === "number") return v;
  if (v == null) return "";
  return String(v);
}

export function DataTable<T extends object>({
  columns,
  rows,
  rowKeyField,
  actions,
  searchPlaceholder = "Search…",
  emptyTitle = "No records yet.",
  emptyDescription = "Save an entry to populate this list.",
  pageSizeOptions = [10, 25, 50],
}: {
  columns: DataColumn<T>[];
  rows: T[];
  rowKeyField: keyof T & string;
  actions?: (row: T) => React.ReactNode;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSizeOptions?: number[];
}) {
  const [search, setSearch] = useState("");
  const [sortId, setSortId] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] ?? 10);
  const [showCols, setShowCols] = useState(false);

  const visible = columns.filter((c) => !hidden.has(c.id));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (q) {
        const blob = columns.map((c) => String(cellValue(row, c))).join(" ").toLowerCase();
        if (!blob.includes(q)) return false;
      }
      for (const col of columns) {
        const needle = filters[col.id]?.trim().toLowerCase();
        if (needle && !String(cellValue(row, col)).toLowerCase().includes(needle)) return false;
      }
      return true;
    });
  }, [rows, search, filters, columns]);

  const sorted = useMemo(() => {
    if (!sortId) return filtered;
    const col = columns.find((c) => c.id === sortId);
    if (!col) return filtered;
    return [...filtered].sort((a, b) => {
      const av = cellValue(a, col);
      const bv = cellValue(b, col);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortId, sortDir, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageIndex = Math.min(page, pageCount - 1);
  const slice = sorted.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  const filterable = columns.filter((c) => c.filterable !== false);

  function toggleSort(id: string) {
    if (sortId !== id) {
      setSortId(id);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder={searchPlaceholder}
          className="max-w-xs"
        />
        <div className="relative">
          <Button type="button" variant="outline" size="sm" onClick={() => setShowCols((v) => !v)}>
            <Columns3 className="h-4 w-4" />
            Columns
          </Button>
          {showCols ? (
            <div className="absolute right-0 z-20 mt-1 w-52 rounded-md border bg-card p-2 shadow-lg">
              {columns.map((c) => (
                <label key={c.id} className="flex items-center gap-2 px-1 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={!hidden.has(c.id)}
                    onChange={() => {
                      setHidden((prev) => {
                        const next = new Set(prev);
                        if (next.has(c.id)) next.delete(c.id);
                        else if (next.size < columns.length - 1) next.add(c.id);
                        return next;
                      });
                    }}
                  />
                  {c.header || c.id}
                </label>
              ))}
            </div>
          ) : null}
        </div>
        <p className="ml-auto text-xs text-muted-foreground">
          {sorted.length} row{sorted.length === 1 ? "" : "s"}
        </p>
      </div>
      {filterable.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {filterable.map((c) => (
            <Input
              key={c.id}
              value={filters[c.id] ?? ""}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, [c.id]: e.target.value }));
                setPage(0);
              }}
              placeholder={`Filter ${c.header.toLowerCase() || c.id}`}
              className="h-8 max-w-40 text-xs"
            />
          ))}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <THead>
            <TR>
              {visible.map((c) => (
                <TH key={c.id}>
                  <button
                    type="button"
                    className={cn("inline-flex items-center gap-1", c.sortable === false && "cursor-default")}
                    onClick={() => c.sortable !== false && toggleSort(c.id)}
                  >
                    {c.header}
                    {sortId === c.id ? (sortDir === "asc" ? " ↑" : " ↓") : null}
                  </button>
                </TH>
              ))}
              {actions ? <TH className="w-40">Actions</TH> : null}
            </TR>
          </THead>
          <TBody>
            {slice.length === 0 ? (
              <TR>
                <TD colSpan={visible.length + (actions ? 1 : 0)} className="py-8 text-center text-muted-foreground">
                  No rows match the current search or filters.
                </TD>
              </TR>
            ) : (
              slice.map((row) => (
                <TR key={String(row[rowKeyField])}>
                  {visible.map((c) => {
                    const text = String(cellValue(row, c));
                    const href = c.hrefField ? String(row[c.hrefField] ?? "") : "";
                    return (
                      <TD key={c.id}>
                        {href ? (
                          <Link className="text-primary underline" href={href}>
                            {text}
                          </Link>
                        ) : (
                          text
                        )}
                      </TD>
                    );
                  })}
                  {actions ? <TD className="whitespace-nowrap">{actions(row)}</TD> : null}
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          Rows
          <select
            className="h-8 rounded-md border bg-card px-2"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled={pageIndex <= 0} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pageIndex >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
