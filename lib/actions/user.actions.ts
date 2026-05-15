"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import { cookies } from "next/headers";

const getAuthHeaders = (): Record<string, string> => {
  const token = cookies().get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    
    if (data.token) {
      cookies().set("token", data.token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      });
    }

    return data.user as User;
  } catch (error) {
    console.error("Error logging in", error);
    return null;
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  try {
    const payload = {
      ...userData,
      password,
    };

    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to register", await res.text());
      return null;
    }

    const data = await res.json();
    
    if (data.token) {
      cookies().set("token", data.token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      });
    }

    return data.user as User;
  } catch (error) {
    console.error("Error registering user", error);
    return null;
  }
};

export async function getLoggedInUser() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      // Ensure the call is dynamic on the server
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: { ...getAuthHeaders() },
      credentials: "include",
    });

    if (res.ok) {
      cookies().delete("token");
    }

    return res.ok;
  } catch (error) {
    return false;
  }
};

// In the simulated version, a "bank" is created directly via the backend.
// This helper lets the UI create a bank account using a decoded shareable/account number.
export const createSimulatedBankAccount = async ({
  bankName,
  accountNumber,
  startingBalance,
}: {
  bankName: string;
  accountNumber: string;
  startingBalance: number;
}) => {
  try {
    const res = await fetch(`${API_BASE}/api/bank/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      credentials: "include",
      body: JSON.stringify({
        bankName,
        accountNumber,
        startingBalance,
      }),
    });

    if (!res.ok) {
      console.error("Failed to create bank account", await res.text());
      return null;
    }

    return (await res.json()) as Bank;
  } catch (error) {
    console.error("Error creating bank account", error);
    return null;
  }
};
