"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDebounce } from "./debounce";

export function UserControls({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("search") || "");
  const debounced = useDebounce(search);

  const page = Number(params.get("page") || 1);

  useEffect(() => {
    const url = new URLSearchParams(params.toString());
    url.set("search", debounced);
    url.set("page", "1");
    router.push(`?${url.toString()}`);
  }, [debounced]);

  const goToPage = (p: number) => {
    const url = new URLSearchParams(params.toString());
    url.set("page", String(p));
    router.push(`?${url.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "default" : "outline"}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
