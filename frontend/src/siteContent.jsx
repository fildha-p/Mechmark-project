import { createContext, useContext, useEffect, useState } from "react";
import { fallbackContent } from "./content.js";

// In development Vite proxies /api and /media to Django (see vite.config.js).
// In production set VITE_API_URL to the backend origin, e.g. https://api.mechmark.in
export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const ContentContext = createContext(fallbackContent);

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

// Use API values where present; keep fallback values for anything the API leaves empty.
function merge(fallback, live) {
  const result = { ...fallback };
  for (const [key, value] of Object.entries(live || {})) {
    if (!hasValue(value)) continue;
    const base = fallback[key];
    result[key] =
      base && typeof base === "object" && !Array.isArray(base) && typeof value === "object" && !Array.isArray(value)
        ? merge(base, value)
        : value;
  }
  return result;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/api/site/`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
      .then((live) => setContent(merge(fallbackContent, live)))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.warn("Mechmark API unavailable, showing built-in content.", error.message);
        }
      });
    return () => controller.abort();
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

export async function submitEnquiry(payload) {
  const response = await fetch(`${API_BASE}/api/enquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  let body = {};
  try {
    body = await response.json();
  } catch {
    // non-JSON error page
  }
  if (!response.ok) {
    const error = new Error(body.error || "Could not send your enquiry.");
    error.fields = body.fields || [];
    throw error;
  }
  return body;
}
