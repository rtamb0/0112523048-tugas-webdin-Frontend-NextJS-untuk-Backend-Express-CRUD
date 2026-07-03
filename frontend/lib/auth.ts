const isBrowser = typeof window !== "undefined";

export function saveAuth(token: string, user: any) {
  if (!isBrowser) return;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  if (!isBrowser) return null;

  return localStorage.getItem("token");
}

export function getUser() {
  if (!isBrowser) return null;

  const raw = localStorage.getItem("user");

  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  if (!isBrowser) return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
