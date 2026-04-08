"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deletePayment } from "../../actions/payment";

const MONTHS = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);

type Member = {
  id: string;
  fullName: string;
  username: string;
  photo: string | null;
  payment: {
    id: string;
    amount: number;
    paymentMonth: number;
    paymentYear: number;
  } | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MonthlyTable({
  members,
  currentMonth,
  currentYear,
}: {
  members: Member[];
  currentMonth: number;
  currentYear: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const safeMonth =
    Number.isInteger(currentMonth) && currentMonth >= 1 && currentMonth <= 12
      ? currentMonth
      : new Date().getMonth() + 1;
  const safeYear = YEARS.includes(currentYear) ? currentYear : YEARS[0];

  function navigate(month: number, year: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(month));
    params.set("year", String(year));
    router.push(`?${params.toString()}`);
  }

  const handleDelete = useCallback(
    async (paymentId: string, memberName: string) => {
      await deletePayment(paymentId);
      toast.success(`Payment removed for ${memberName}.`);
      router.refresh();
    },
    [router]
  );

  const paidCount = useMemo(
    () => members.filter((m) => m.payment !== null).length,
    [members]
  );

  // Status filter applied before passing to table
  const filteredByStatus = useMemo(
    () =>
      members.filter((m) => {
        if (statusFilter === "paid") return m.payment !== null;
        if (statusFilter === "unpaid") return m.payment === null;
        return true;
      }),
    [members, statusFilter]
  );

  const columns: ColumnDef<Member>[] = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: "Member",
        cell: ({ row }) => {
          const member = row.original;
          return (
            <Link
              href={`/dashboard/member/${member.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.photo ?? ""} alt={member.fullName} />
                <AvatarFallback className="text-xs">
                  {getInitials(member.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{member.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  @{member.username}
                </p>
              </div>
            </Link>
          );
        },
      },
      {
        accessorKey: "payment",
        header: "Status",
        cell: ({ row }) =>
          row.original.payment ? (
            <Badge
              variant="outline"
              className="gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400"
            >
              <CheckCircle2Icon className="h-3.5 w-3.5" />
              Paid
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1.5 text-destructive border-destructive/30 bg-destructive/5"
            >
              <XCircleIcon className="h-3.5 w-3.5" />
              Not paid
            </Badge>
          ),
      },
      {
        id: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.payment ? (
              <span className="font-medium">
                ৳{row.original.payment.amount.toLocaleString()}
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        ),
      },
      // {
      //   id: "actions",
      //   header: () => null,
      //   cell: ({ row }) => {
      //     const member = row.original;
      //     return member.payment ? (
      //       <DropdownMenu>
      //         <DropdownMenuTrigger asChild>
      //           <Button variant="ghost" size="icon" className="h-8 w-8">
      //             <MoreHorizontalIcon className="h-4 w-4" />
      //           </Button>
      //         </DropdownMenuTrigger>
      //         <DropdownMenuContent align="end" className="w-36">
      //           <DropdownMenuItem
      //             variant="destructive"
      //             onClick={() =>
      //               handleDelete(member.payment!.id, member.fullName)
      //             }
      //           >
      //             <Trash2Icon className="mr-2 h-4 w-4" />
      //             Remove
      //           </DropdownMenuItem>
      //         </DropdownMenuContent>
      //       </DropdownMenu>
      //     ) : (
      //       <Button variant="ghost" size="sm" asChild className="text-xs h-8">
      //         <Link
      //           href={`/dashboard/payment/new?memberId=${member.id}&month=${safeMonth}&year=${safeYear}`}
      //         >
      //           Record
      //         </Link>
      //       </Button>
      //     );
      //   },
      // },
    ],
    [handleDelete, safeMonth, safeYear]
  );

  const table = useReactTable({
    data: filteredByStatus,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    initialState: { pagination: { pageSize: 10 } },
    state: { columnFilters },
  });

  return (
    <div className="space-y-4">
      {/* ── Controls ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Name search */}
        <Input
          placeholder="Search member..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("fullName")?.setFilterValue(e.target.value)
          }
          className="w-48"
        />
        {/* Month */}
        <Select
          value={String(safeMonth)}
          onValueChange={(v) => {
            if (!v) return;
            navigate(Number(v), safeYear);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.slice(1).map((name, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select
          value={String(safeYear)}
          onValueChange={(v) => {
            if (!v) return;
            navigate(safeMonth, Number(v));
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            if (v === "all" || v === "paid" || v === "unpaid") {
              setStatusFilter(v);
            }
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Not paid</SelectItem>
          </SelectContent>
        </Select>

        {/* Progress bar */}
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width:
                  members.length > 0
                    ? `${Math.round((paidCount / members.length) * 100)}%`
                    : "0%",
              }}
            />
          </div>
          <span>
            {members.length > 0
              ? `${Math.round((paidCount / members.length) * 100)}%`
              : "0%"}
          </span>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors"
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ───────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} member
          {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(v) => {
                if (!v) return;
                table.setPageSize(Number(v));
              }}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </p>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
