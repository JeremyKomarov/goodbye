// Every Route Handler URL, once (03-DATA.md §1). A call site imports it, never writes a literal.
export const API_ENDPOINTS = {
  rooms: {
    create: "/api/rooms",
    one: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}`,
    me: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/me`,
    hosts: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/hosts`,
    vote: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/vote`,
    finalize: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/finalize`,
    wall: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/wall`,
    reaction: (slug: string, messageId: number) =>
      `/api/rooms/${encodeURIComponent(slug)}/wall/${messageId}/reaction`,
  },
  me: {
    loginCode: "/api/me/login-code",
  },
} as const;
