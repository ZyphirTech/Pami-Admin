"use client";
import { Province } from "@/src/features/common/domain/types/provinces";
import RootTable from "@/src/features/common/presentation/components/root-table";
import TableMenu from "@/src/features/common/presentation/components/table-menu";
//import { usePagination } from "@/src/features/common/presentation/hooks/usePagination";
import { PAGE_SIZE } from "@/src/features/provinces/domain/constants";
import { useGetProvinces } from "@/src/features/provinces/interactors/use-get-provinces";
import { useState } from "react";

function ProvincesContainer() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: provincesResponse,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useGetProvinces();

  const provinces = provincesResponse?.items || [];

  //const pagination = usePagination(provinces.length, PAGE_SIZE, 5, currentPage);

  return (
    <div className="p-6">
      <RootTable<Province>
        name="Provincias"
        data={provinces}
        columns={[
          {
            header: "Id",
            cell: (_row, rowIndex) => rowIndex + 1,
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
          page: currentPage,
          pageSize: PAGE_SIZE,
          totalRecords: provinces.length,
          handlePaginationModelChange: ({ page, pageSize }: any) => {
            console.log("Cambió la página:", page, "con pageSize:", pageSize);
            // aquí llamas a tu backend con los nuevos params
          },
        }}
        getRowId={(row: any) => row.id}
        isLoading={isLoading}
        disableSelection
      />
    </div>
  );
}

export default ProvincesContainer;
