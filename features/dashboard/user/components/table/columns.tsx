"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SelectUser } from "@/drizzle/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { deleteUser, toggleUserActive } from "../../actions/user";
import { toast } from "sonner";

function getAge(dateOfBirth: string | null | undefined): string {
  if (!dateOfBirth) return "—";
  const diff = Date.now() - new Date(dateOfBirth).getTime();
  return String(Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const columns: ColumnDef<SelectUser>[] = [
  {
    accessorKey: "fullName",
    header: "Member",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photo ?? ""} alt={user.fullName} />
            <AvatarFallback className="text-xs">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user.fullName}</span>
            <span className="text-xs text-muted-foreground">
              @{user.username}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: "Age",
    cell: ({ row }) => (
      <span className="text-sm">{getAge(row.original.dateOfBirth)}</span>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <span className="text-sm capitalize">{row.original.gender}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original;

      async function handleDelete() {
        await deleteUser(user.id);
        toast.success(`${user.fullName} has been removed.`);
      }

      async function handleToggleActive() {
        await toggleUserActive(user.id, !user.isActive);
        toast.success(
          user.isActive
            ? `${user.fullName} marked as inactive.`
            : `${user.fullName} marked as active.`
        );
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/member/${user.id}`}>
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleActive}>
              <PencilIcon className="mr-2 h-4 w-4" />
              {user.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
