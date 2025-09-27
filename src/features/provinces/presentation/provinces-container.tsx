"use client";
import { Button } from "@/components/ui/button";
import { Province } from "@/src/features/common/domain/types/provinces";
import RootTable from "@/src/features/common/presentation/components/root-table";
import TableMenu from "@/src/features/common/presentation/components/table-menu";
//import { usePagination } from "@/src/features/common/presentation/hooks/usePagination";
import { PAGE_SIZE } from "@/src/features/provinces/getAllProvinces/domain/constants";
import { useGetProvinces } from "@/src/features/provinces/getAllProvinces/interactors/use-get-provinces";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AddProvince } from "./add-province-modal";
import { cn } from "@/lib/utils";
import { useSidebar } from "../../common/presentation/components/sidebar";

type Pagination = {
  cursor: string | null;
  direction: "0" | "1";
  pageSize: number;
};

function ProvincesContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [addProvinceModal, setAddProvinceModal] = useState(false);
  const [pageSize] = useState(10);
  const [direction, setDirection] = useState<"0" | "1">("0");
  const [cursor, setCursor] = useState<string | null>(null);
  let index = 1;

  const {
    data: provincesResponse,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useGetProvinces({
    pageSize,
    direction,
    cursor,
  });

  const provinces = provincesResponse?.items || [];

  const handleAddClick = () => {
    setAddProvinceModal(!addProvinceModal);
  };

  const { collapsed } = useSidebar();

  //const pagination = usePagination(provinces.length, PAGE_SIZE, 5, currentPage);

  return (
    <div
      className={cn(
        "p-6 transition-all duration-300",
        collapsed ? "ml-16" : "ml-64"
      )}
    >
      <Button
        onClick={handleAddClick}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
      >
        <Plus className="w-16 h-16 text-white scale-150" strokeWidth={2} />
      </Button>
      <RootTable<Province>
        name="Provincias"
        data={provinces}
        columns={[
          {
            header: "Id",
            cell: (_row, rowIndex) => (rowIndex = index++),
            sortable: true,
          },
          {
            header: "Nombre",
            accessor: "nombre",
          },
          {
            header: "Acciones",
            cell: (row) => (
              <div className="flex justify-center">
                <TableMenu
                  onViewDetails={() => console.log("Detalles de", row.id)}
                  onEdit={() => console.log("Editar", row.id)}
                  onDelete={() => console.log("Eliminar", row.id)}
                />
              </div>
            ),
            width: 120,
          },
        ]}
        pagination={{
          direction,
          nextCursor: provincesResponse?.nextCursor ?? null,
          previousCursor: provincesResponse?.previousCursor ?? null,
          hasNextPage: provincesResponse?.hasNextPage ?? false,
          hasPreviousPage: provincesResponse?.hasPreviousPage ?? false,
          pageSize: PAGE_SIZE,
          totalRecords: provincesResponse?.totalRecords,
          handlePaginationChange: ({
            pageSize,
            cursor,
            direction,
          }: Pagination) => {
            setDirection(direction);
            setCursor(cursor);
          },
        }}
        getRowId={(row: any) => row.id}
        isLoading={isLoading}
        disableSelection
      />

      <AddProvince
        isOpen={addProvinceModal}
        onClose={() => setAddProvinceModal(false)}
      />
    </div>
  );
}

export default ProvincesContainer;
