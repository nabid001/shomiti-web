"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { SelectUser } from "@/drizzle/schemas";
import { Ellipsis } from "lucide-react";

export const columns: ColumnDef<SelectUser>[] = [
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "username", header: "Username" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "gender", header: "Gender" },
  {
    accessorKey: "action",
    header: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const user = row.original;

      return <Ellipsis size={20} opacity={80} />;
    },
  },
];
