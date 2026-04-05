import { notFound } from "next/navigation";
import { getUserById } from "@/features/dashboard/user/actions/user";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, MailIcon, UserIcon, WalletIcon } from "lucide-react";
import { getPaymentsByUser } from "@/features/payment/actions/payment";

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

function getAge(dob: string | null | undefined) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [user, payments] = await Promise.all([
    getUserById(id),
    getPaymentsByUser(id),
  ]);

  if (!user) notFound();

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <SidebarInset>
      <SiteHeader title={user.fullName} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-5xl w-full mx-auto">
          {/* Member card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="h-20 w-20 rounded-xl">
                  <AvatarImage src={user.photo ?? ""} alt={user.fullName} />
                  <AvatarFallback className="rounded-xl text-lg">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-semibold">{user.fullName}</h2>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <UserIcon className="h-3.5 w-3.5" />@{user.username} ·{" "}
                      {user.gender}
                      {getAge(user.dateOfBirth)
                        ? ` · ${getAge(user.dateOfBirth)} yrs`
                        : ""}
                    </span>
                    <span className="flex items-center gap-2">
                      <MailIcon className="h-3.5 w-3.5" />
                      {user.email}
                    </span>
                    {user.dateOfBirth && (
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        Born{" "}
                        {new Date(user.dateOfBirth).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <WalletIcon className="h-3.5 w-3.5" />
                      Member since{" "}
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">Total paid</p>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  ৳{totalPaid.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">Months paid</p>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{payments.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <p className="text-sm text-muted-foreground">Avg per month</p>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {payments.length > 0
                    ? `৳${Math.round(totalPaid / payments.length).toLocaleString()}`
                    : "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment history */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment history</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  No payments recorded yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Month</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Recorded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {MONTHS[payment.paymentMonth]}
                        </TableCell>
                        <TableCell>{payment.paymentYear}</TableCell>
                        <TableCell className="text-right">
                          ৳{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(payment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
