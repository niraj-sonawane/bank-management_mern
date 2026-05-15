"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import { cookies } from "next/headers";

const getAuthHeaders = (): Record<string, string> => {
  const token = cookies().get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get multiple bank accounts (simulated, from MongoDB)
export const getAccounts = async ({ userId }: getAccountsProps) => {
  // userId is no longer needed on the backend; auth middleware uses the JWT
  try {
    const res = await fetch(`${API_BASE}/api/bank/accounts`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to load accounts", await res.text());
      return null;
    }

    return (await res.json()) as {
      data: Account[];
      totalBanks: number;
      totalCurrentBalance: number;
    };
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account (simulated, from MongoDB)
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    const res = await fetch(`${API_BASE}/api/bank/account/${appwriteItemId}`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to load account", await res.text());
      return null;
    }

    return (await res.json()) as {
      data: Account;
      transactions: Transaction[];
    };
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

export const depositFunds = async ({ accountId, amount }: { accountId: string, amount: number }) => {
  try {
    const res = await fetch(`${API_BASE}/api/bank/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify({ accountId, amount }),
    });

    if (!res.ok) {
      console.error("Failed to deposit funds", await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error depositing funds", error);
    return false;
  }
};
