"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";

export const TransactionFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: value === "all" ? "" : value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex justify-end mb-4">
      <Select onValueChange={handleFilter} defaultValue={searchParams.get("filter") || "all"}>
        <SelectTrigger className="w-[220px] bg-white border border-gray-300 rounded-md">
          <SelectValue placeholder="Filter Transactions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Transactions</SelectItem>
          <SelectItem value="credit">Credits Only</SelectItem>
          <SelectItem value="debit">Debits Only</SelectItem>
          <SelectItem value="amount_highest">Highest Amount</SelectItem>
          <SelectItem value="amount_lowest">Lowest Amount</SelectItem>
          <SelectItem value="oldest">Date (Oldest First)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
