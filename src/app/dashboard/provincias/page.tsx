"use client";

import { Province } from "@/src/features/common/domain/types/provinces";
import RootTable from "@/src/features/common/presentation/components/root-table";
//import { usePagination } from "@/src/features/common/presentation/hooks/usePagination";
import { PAGE_SIZE } from "@/src/features/provinces/domain/constants";
import { useGetProvinces } from "@/src/features/provinces/interactors/use-get-provinces";
import { useState } from "react";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: provincesResponse,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useGetProvinces();

  const provinces = provincesResponse?.items || [];
  if (isLoading) return <div>Loading...</div>;

  //const pagination = usePagination(provinces.length, PAGE_SIZE, 5, currentPage);

  return (
    <div className="p-6">
      <RootTable<Province>
        data={provinces}
        columns={[
          {
            header: "Id",
            accessor: "id",
            sortable: true,
          },
          {
            header: "Nombre",
            accessor: "nombre",
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
      />
    </div>
  );
}
