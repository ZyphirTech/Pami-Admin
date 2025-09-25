"use client";

import RootTable from "@/src/features/common/presentation/components/root-table";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const users: User[] = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Admin" },
  { id: 2, name: "Ana García", email: "ana@example.com", role: "User" },
  {
    id: 3,
    name: "Carlos Díaz",
    email: "carlos@example.com",
    role: "Supervisor",
  },
];

export default function UsersPage() {
  return (
    <div className="p-6">
      <RootTable<User>
        data={users}
        columns={[
          {
            header: "Nombre",
            accessor: "name",
            sortable: true,
          },
          {
            header: "Correo",
            accessor: "email",
          },
          {
            header: "Rol",
            accessor: "role",
            cell: (row: any) => (
              <span
                className={`px-2 py-1 rounded text-xs ${
                  row.role === "Admin"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {row.role}
              </span>
            ),
          },
        ]}
        pagination={{
          page: 0,
          pageSize: 10,
          totalRecords: 50,
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
