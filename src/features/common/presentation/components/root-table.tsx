"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { debounce as debounceFn } from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Column<T = any> = {
  header: string;
  accessor?: string;
  cell?: (row: T, rowIndex: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string | number;
};

type Pagination = {
  page?: number;
  pageSize?: number;
  totalRecords?: number;
  handlePaginationModelChange?: (model: {
    page: number;
    pageSize: number;
  }) => void;
};

type Props<T = any> = {
  name: string;
  data: T[];
  columns: Column<T>[];
  pagination?: Pagination;
  hideFooter?: boolean;
  disableSelection?: boolean;
  rowHeight?: number; // not used for HTML table but kept for API compatibility
  withoutSearch?: boolean;
  withoutBorder?: boolean;
  headerComponent?: React.ReactNode;
  handleSearch?: (value: string) => void;
  getRowId?: (row: T) => string | number;
  isLoading: boolean;
};

function formatNumber(n?: number | null) {
  if (n == null) return 0;
  return n;
}

export default function RootTable<T = any>({
  name,
  data,
  columns,
  pagination,
  hideFooter,
  disableSelection,
  withoutSearch = false,
  withoutBorder = false,
  headerComponent,
  handleSearch,
  getRowId,
  isLoading,
}: Props<T>) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState<number>(pagination?.page ?? 0);
  const [pageSize, setPageSize] = useState<number>(pagination?.pageSize ?? 10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Helper para actualizar query string (similar a tu original)
  const updateQuery = useCallback(
    (
      updates: Record<string, string | number | undefined | null>,
      options?: { appendSort?: string[] }
    ) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      if (options?.appendSort) {
        params.delete("sort");
        options.appendSort.forEach((s) => params.append("sort", s));
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router]
  );

  // Debounce de búsqueda
  const debouncedSearch = useMemo(
    () =>
      debounceFn((value: string) => {
        // Llamada externa si el usuario proveyó handleSearch
        if (handleSearch) {
          handleSearch(value);
        } else {
          // actualizar query string por defecto y resetear página
          updateQuery({ search: value || undefined, page: 0 });
          setPage(0);
        }
      }, 500),
    [handleSearch, updateQuery]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onSearchChange = (v: string) => {
    setSearchValue(v);
    debouncedSearch(v);
  };

  // Paginación: cuando se cambie desde controles locales, preferimos llamar al callback externo o a updateQuery
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    if (pagination?.handlePaginationModelChange) {
      pagination.handlePaginationModelChange({ page: nextPage, pageSize });
    } else {
      updateQuery({ page: nextPage, pageSize });
    }
  };

  const changePageSize = (nextSize: number) => {
    setPageSize(nextSize);
    setPage(0);
    if (pagination?.handlePaginationModelChange) {
      pagination.handlePaginationModelChange({ page: 0, pageSize: nextSize });
    } else {
      updateQuery({ page: 0, pageSize: nextSize });
    }
  };

  // Sorting toggler (server-side): click header to cycle none -> asc -> desc -> none
  const toggleSort = (col: Column<T>) => {
    if (!col.sortable || !col.accessor) return;
    if (sortField !== col.accessor) {
      setSortField(col.accessor);
      setSortDir("asc");
      updateQuery({}, { appendSort: [`${col.accessor},asc`] });
    } else {
      if (sortDir === "asc") {
        setSortDir("desc");
        updateQuery({}, { appendSort: [`${col.accessor},desc`] });
      } else if (sortDir === "desc") {
        setSortField(null);
        setSortDir(null);
        updateQuery({}, { appendSort: [] });
      } else {
        setSortDir("asc");
        updateQuery({}, { appendSort: [`${col.accessor},asc`] });
      }
    }
  };

  const total = pagination?.totalRecords ?? data.length;
  const totalPages = Math.max(1, Math.ceil(formatNumber(total) / pageSize));
  const start = page * pageSize + 1;
  const end = Math.min(formatNumber(total), (page + 1) * pageSize);

  // Selección de filas (si habilitado)
  const toggleRow = (row: T) => {
    const id = getRowId
      ? String(getRowId(row))
      : String((row as any).id ?? Math.random());
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Small Empty state
  const EmptyState = () => (
    <div className="flex items-center justify-center p-12 text-center text-sm text-muted-foreground">
      <div>
        <p className="font-medium">No Records Found</p>
        <p className="mt-1 text-xs">No hay registros para mostrar.</p>
      </div>
    </div>
  );

  return (
    <div className={withoutBorder ? "" : "shadow-md rounded-lg"}>
      <Card className={withoutBorder ? "" : "overflow-hidden"}>
        {!withoutSearch &&
          (headerComponent || (
            <CardHeader className="flex flex-wrap items-center justify-between gap-2 py-3 px-4">
              <div className="flex items-center gap-3">
                {headerComponent ? (
                  headerComponent
                ) : (
                  <CardTitle className="text-sm">{name}</CardTitle>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar..."
                  className="max-w-xs"
                />
              </div>
            </CardHeader>
          ))}

        <CardContent className="p-0">
          <ScrollArea className="w-full">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <svg
                  className="animate-spin h-8 w-8 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            ) : data.length === 0 ? (
              <EmptyState />
            ) : (
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    {!disableSelection && (
                      <th className="px-4 py-3 w-12 text-left">
                        <Checkbox
                          checked={
                            Object.values(selected).length > 0 &&
                            Object.values(selected).every(Boolean)
                          }
                          onCheckedChange={(v) => {
                            // seleccionar/desseleccionar visibles
                            const next: Record<string, boolean> = {};
                            if (v) {
                              data.forEach((r) => {
                                const id = getRowId
                                  ? String(getRowId(r))
                                  : String((r as any).id ?? Math.random());
                                next[id] = true;
                              });
                            }
                            setSelected(next);
                          }}
                          aria-label="select all rows"
                        />
                      </th>
                    )}
                    {columns.map((col, idx) => (
                      <th
                        key={idx}
                        className={`px-4 py-3 text-left text-sm font-medium uppercase tracking-wider ${
                          col.className ?? ""
                        }`}
                        style={col.width ? { width: col.width } : undefined}
                      >
                        <div
                          className={`flex items-center gap-2 select-none ${
                            col.sortable ? "cursor-pointer" : ""
                          }`}
                          onClick={() => toggleSort(col)}
                        >
                          <span>{col.header}</span>
                          {col.sortable &&
                            col.accessor &&
                            sortField === col.accessor && (
                              <span className="text-xs text-muted-foreground">
                                {sortDir === "asc" ? "▲" : "▼"}
                              </span>
                            )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-background divide-y">
                  {data.map((row, rIndex) => {
                    const rowId = getRowId
                      ? String(getRowId(row))
                      : String((row as any).id ?? rIndex);
                    return (
                      <tr key={rowId} className="odd:bg-white even:bg-surface">
                        {!disableSelection && (
                          <td className="px-4 py-2">
                            <Checkbox
                              checked={!!selected[rowId]}
                              onCheckedChange={() => toggleRow(row)}
                              aria-label={`select row ${rowId}`}
                            />
                          </td>
                        )}

                        {columns.map((col, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 align-middle">
                            {col.cell
                              ? col.cell(row, rIndex)
                              : col.accessor
                              ? (row as any)[col.accessor]
                              : null}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </ScrollArea>
        </CardContent>

        {!hideFooter && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t">
            <div className="flex items-center gap-2 text-sm">
              <div>
                Mostrando{" "}
                <span className="font-medium">
                  {data.length === 0 ? 0 : `${start} - ${end}`}
                </span>{" "}
                de <span className="font-medium">{total}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changePage(Math.max(0, page - 1))}
                  disabled={page <= 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="px-2 text-sm">
                  Página <span className="font-medium">{page + 1}</span> de{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changePage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  onValueChange={(v) => changePageSize(Number(v))}
                  defaultValue={String(pageSize)}
                >
                  <SelectTrigger className="w-[110px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50, 100].map((s) => (
                      <SelectItem value={String(s)} key={s}>
                        {s} / página
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
