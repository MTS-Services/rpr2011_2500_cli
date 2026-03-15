import { redirect } from "next/navigation";

let getAuthToken;
let refreshAuthToken;
let logoutUser;

export function initializeAuthUtils({ get, refresh, logout }) {
  getAuthToken = get;
  refreshAuthToken = refresh;
  logoutUser = logout;
}

async function handle401(request, options) {
  try {
    const newAccessToken = await refreshAuthToken();
    if (!newAccessToken) {
      logoutUser();
      if (typeof window !== "undefined") window.location.href = "/login";
      return new Response(JSON.stringify({ message: "Session expired. Please log in again." }), { status: 401 });
    }

    const newOptions = { ...options };
    newOptions.headers.Authorization = `Bearer ${newAccessToken}`;
    return fetch(request, newOptions);
  } catch (error) {
    logoutUser();
    if (typeof window !== "undefined") window.location.href = "/login";
    return new Response(JSON.stringify({ message: "Session expired. Please log in again." }), { status: 401 });
  }
}

export async function authenticatedFetch(url, options = {}) {
  const token = getAuthToken();

  if (!token) {
    logoutUser();
    if (typeof window !== "undefined") window.location.href = "/login";
    return new Response(JSON.stringify({ message: "Session expired. Please log in again." }), { status: 401 });
  }

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (response.status === 401) {
    return handle401(url, defaultOptions);
  }

  return response;
}
