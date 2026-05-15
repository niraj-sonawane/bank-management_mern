"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
import { cookies } from "next/headers";

const getAuthHeaders = (): Record<string, string> => {
  const token = cookies().get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getNotifications = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return [];
    return (await res.json()) as AppNotification[];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: { ...getAuthHeaders() },
      credentials: "include",
    });

    return res.ok;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/read-all`, {
      method: "PATCH",
      headers: { ...getAuthHeaders() },
      credentials: "include",
    });

    return res.ok;
  } catch (error) {
    console.error("Error marking all as read:", error);
    return false;
  }
};
