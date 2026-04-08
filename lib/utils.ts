import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentMonthYear() {
  // await connection();

  const now = new Date();

  const month = now.toLocaleString("default", { month: "long" }); // e.g. "April"
  const monthPlusOne = now.getMonth() + 1;
  const year = now.getFullYear();

  const monthAndYear = `${month} ${year}`;

  return { monthAndYear, month, year, monthPlusOne };
}
