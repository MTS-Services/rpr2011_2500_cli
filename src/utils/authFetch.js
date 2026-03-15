let getAuthToken;
let logoutUser;

export function initializeAuthUtils({ get, refresh, logout }) {
  getAuthToken = get;
  logoutUser = logout;
  // Note: refresh token is not used - backend doesn't support it
}

export async function authenticatedFetch(url, options = {}) {
  let token = getAuthToken ? getAuthToken() : null;

  // Fallback for edge cases where context state is not yet hydrated.
  if (!token && typeof window !== "undefined") {
    token = window.localStorage.getItem("auth_access_token");
  }

  // Do not force navigation here; callers can decide how to handle auth failures.
  if (!token) {
    return new Response(JSON.stringify({ message: "Session expired. Please log in again." }), { status: 401 });
  }

  const defaultOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type":
        options.headers?.["Content-Type"] || options.headers?.["content-type"] || "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // Just return the response - let components handle 401/errors
  const response = await fetch(url, defaultOptions);
  return response;
}
