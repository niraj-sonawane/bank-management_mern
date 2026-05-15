"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import { cookies } from "next/headers";

const getAuthHeaders = (): Record<string, string> => {
  const token = cookies().get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAdminStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return null;
  }
};

export const getAdminUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/users`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
};

export const getAdminTransactions = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/transactions`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching admin transactions:", error);
    return [];
  }
};

export const getPendingLoans = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/loans/pending`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching pending loans:", error);
    return [];
  }
};

export const getPendingTransfers = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/transactions/pending`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching pending transfers:", error);
    return [];
  }
};

export const approveTransactionAction = async (txId: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/transactions/${txId}/approve`, {
      method: "PATCH",
      headers: { ...getAuthHeaders() },
      credentials: "include",
    });

    return res.ok;
  } catch (error) {
    console.error("Error approving transaction:", error);
    return false;
  }
};

export const approveLoanAction = async (loanId: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/loans/${loanId}/approve`, {
      method: "PATCH",
      headers: { ...getAuthHeaders() },
      credentials: "include",
    });

    return res.ok;
  } catch (error) {
    console.error("Error approving loan:", error);
    return false;
  }
};
