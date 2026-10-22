// Every Route Handler URL, once (03-DATA.md §1). A call site imports it, never writes a literal.
export const API_ENDPOINTS = {
  rooms: {
    create: "/api/rooms",
    one: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}`,
  },
} as const;
