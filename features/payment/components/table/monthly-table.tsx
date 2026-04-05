"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  XCircleIcon,
  MoreHorizontalIcon,
  Trash2Icon,
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

  function navigate(month: number, year: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(month));
    params.set("year", String(year));
    router.push(`?${params.toString()}`);
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  async function handleDelete(paymentId: string, memberName: string) {
    await deletePayment(paymentId);
    toast.success(`Payment removed for ${memberName}.`);
    router.refresh();
  }

  const paidCount = members.filter((m) => m.payment !== null).length;

  return (
    <div className="space-y-4">
      {/* Month / Year selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={String(currentMonth)}
          onValueChange={(v) => navigate(Number(v), currentYear)}
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

        <Select
          value={String(currentYear)}
          onValueChange={(v) => navigate(currentMonth, Number(v))}
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

        {/* Progress pill */}
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

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Member</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No active members found.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow
                  key={member.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* Member */}
                  <TableCell>
                    <Link
                      href={`/dashboard/member/${member.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={member.photo ?? ""}
                          alt={member.fullName}
                        />
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
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {member.payment ? (
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
                    )}
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="text-right">
                    {member.payment ? (
                      <span className="font-medium">
                        ৳{member.payment.amount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    {member.payment ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              handleDelete(member.payment!.id, member.fullName)
                            }
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-xs h-8"
                      >
                        <Link
                          href={`/dashboard/payment/new?memberId=${member.id}&month=${currentMonth}&year=${currentYear}`}
                        >
                          Record
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
