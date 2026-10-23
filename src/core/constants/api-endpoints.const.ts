// Every Route Handler URL, once (03-DATA.md §1). A call site imports it, never writes a literal.

/** The host's admin token travels in this header — never in a URL, which a server log keeps. */
export const ADMIN_TOKEN_HEADER = "x-admin-token";
/** A link preview's size, as WhatsApp and the rest draw it — the previews' images are this. */
export const PREVIEW_SIZE = { width: 1200, height: 630 };

export const API_ENDPOINTS = {
  rooms: {
    create: "/api/rooms",
    one: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}`,
    me: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/me`,
    hosts: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/hosts`,
    vote: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/vote`,
    finalize: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/finalize`,
    wall: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/wall`,
    scores: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/scores`,
    // A file to download, so the browser follows it as a link rather than fetching it.
    calendar: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/exit.ics`,
    // The room's link preview, in a language — an image a crawler fetches.
    preview: (slug: string, locale: string) =>
      `/api/rooms/${encodeURIComponent(slug)}/og?locale=${locale}`,
    summary: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/summary`,
    admin: (slug: string) => `/api/rooms/${encodeURIComponent(slug)}/admin`,
    adminMessage: (slug: string, messageId: number) =>
      `/api/rooms/${encodeURIComponent(slug)}/admin/messages/${messageId}`,
    reaction: (slug: string, messageId: number) =>
      `/api/rooms/${encodeURIComponent(slug)}/wall/${messageId}/reaction`,
  },
  // The site's link preview, in a language.
  preview: (locale: string) => `/api/og?locale=${locale}`,
  me: {
    loginCode: "/api/me/login-code",
  },
} as const;
