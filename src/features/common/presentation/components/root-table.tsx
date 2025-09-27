"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { debounce as debounceFn } from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  PaginationState,
  RowSelectionState,
  flexRender,
  Updater,
} from "@tanstack/react-table";

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: pagination?.page ?? 0,
    pageSize: pagination?.pageSize ?? 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: pagination?.page ?? 0,
      pageSize: pagination?.pageSize ?? prev.pageSize,
    }));
  }, [pagination?.page, pagination?.pageSize]);

  const rowCount = pagination?.totalRecords ?? data.length;

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
          setPagination((up) => ({ ...up, pageIndex: 0 }));
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

  // Paginación: cuando se cambie, llamamos al callback externo o a updateQuery
  const onPaginationChange = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      setPagination((old) => {
        let newState =
          typeof updaterOrValue === "function"
            ? updaterOrValue(old)
            : updaterOrValue;
        if (newState.pageSize !== old.pageSize) {
          newState = { ...newState, pageIndex: 0 };
        }
        if (pagination?.handlePaginationModelChange) {
          pagination.handlePaginationModelChange({
            page: newState.pageIndex,
            pageSize: newState.pageSize,
          });
        } else {
          updateQuery({
            page: newState.pageIndex,
            pageSize: newState.pageSize,
          });
        }
        return newState;
      });
    },
    [pagination, updateQuery]
  );

  // Sorting: actualiza query con sort
  const onSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      setSorting((old) => {
        const newSorting =
          typeof updaterOrValue === "function"
            ? updaterOrValue(old)
            : updaterOrValue;
        const appendSort: string[] = [];
        if (newSorting.length > 0) {
          const { id, desc } = newSorting[0];
          appendSort.push(`${id},${desc ? "desc" : "asc"}`);
        }
        updateQuery({}, { appendSort });
        return newSorting;
      });
    },
    [updateQuery]
  );

  const tanstackColumns: ColumnDef<T>[] = useMemo(() => {
    const cols: ColumnDef<T>[] = columns.map((col, idx) => ({
      id: col.accessor ?? `custom${idx}`,
      accessorKey: col.accessor,
      header: col.header,
      cell: (info) =>
        col.cell
          ? col.cell(info.row.original, info.row.index)
          : col.accessor
          ? info.getValue()
          : null,
      enableSorting: !!col.sortable && !!col.accessor,
      meta: {
        className: col.className,
        width: col.width,
      },
    }));

    if (!disableSelection) {
      cols.unshift({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate") ||
              false
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="select all rows"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`select row ${row.id}`}
          />
        ),
        meta: {
          className: "w-12",
        },
      });
    }

    return cols;
  }, [columns, disableSelection]);

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.max(1, Math.ceil(rowCount / pageSize)),
    rowCount,
    state: {
      pagination: { pageIndex, pageSize },
      sorting,
      rowSelection,
    },
    enableMultiSort: false,
    onPaginationChange,
    onSortingChange,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (originalRow, index) =>
      getRowId
        ? String(getRowId(originalRow))
        : String((originalRow as any).id ?? index),
  });

  const total = rowCount;
  const totalPages = table.getPageCount();
  const start = pageIndex * pageSize + 1;
  const end = Math.min(formatNumber(total), (pageIndex + 1) * pageSize);

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
    <div
      className={withoutBorder ? "" : "shadow-md rounded-lg overflow-hidden"}
    >
      <Card className={withoutBorder ? "border-none shadow-none" : ""}>
        {!withoutSearch &&
          (headerComponent || (
            <CardHeader className="flex flex-wrap items-center justify-between gap-2 py-3 px-4 bg-muted/50">
              <div className="flex items-center gap-3">
                {headerComponent ? (
                  headerComponent
                ) : (
                  <CardTitle className="text-base font-semibold">
                    {name}
                  </CardTitle>
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

        <CardContent className="px-2 py-0">
          <ScrollArea className="w-full h-[500px]">
            {" "}
            {/* Añadido altura fija para scroll vertical con headers sticky */}
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
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={`text-left font-semibold text-foreground ${
                            (header.column.columnDef.meta as any)?.className ??
                            ""
                          }`}
                          style={{
                            width: (header.column.columnDef.meta as any)?.width,
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={`flex items-center gap-2 select-none ${
                                header.column.getCanSort()
                                  ? "cursor-pointer hover:text-primary"
                                  : ""
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() && (
                                <span className="text-xs">
                                  {header.column.getIsSorted() === "asc"
                                    ? "▲"
                                    : "▼"}
                                </span>
                              )}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`hover:bg-muted/50 transition-colors ${
                        row.index % 2 === 0 ? "bg-background" : "bg-muted/5"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </CardContent>

        {!hideFooter && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div>
                Mostrando{" "}
                <span className="font-medium text-foreground">
                  {data.length === 0 ? 0 : `${start}`}
                </span>{" "}
                de <span className="font-medium text-foreground">{total}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="px-2 text-sm text-muted-foreground">
                  Página{" "}
                  <span className="font-medium text-foreground">
                    {pageIndex + 1}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium text-foreground">
                    {totalPages}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
