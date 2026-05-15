"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import { cookies } from "next/headers";

const getAuthHeaders = (): Record<string, string> => {
  const token = cookies().get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const applyForLoanAction = async (data: {
  bankAccountId: string;
  loanType: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
}) => {
  try {
    const res = await fetch(`${API_BASE}/api/loans/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error applying for loan:", error);
    return null;
  }
};

export const getUserLoansAction = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/loans`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching loans:", error);
    return [];
  }
};

export const payLoanEMIAction = async (loanId: string, amount: number) => {
  try {
    const res = await fetch(`${API_BASE}/api/loans/${loanId}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify({ amount }),
    });

    return res.ok;
  } catch (error) {
    console.error("Error paying EMI:", error);
    return false;
  }
};
