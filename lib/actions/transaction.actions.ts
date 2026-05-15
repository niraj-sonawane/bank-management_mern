"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import { cookies } from "next/headers";

const getAuthHeaders = (): Record<string, string> => {
  const token = cookies().get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTransactions = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/transactions`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to load transactions", await res.text());
      return [];
    }

    return (await res.json()) as Transaction[];
  } catch (error) {
    console.log(error);
    return [];
  }
};
