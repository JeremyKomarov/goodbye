/** A room the host has just opened. The admin token is shown once and kept in their browser. */
export interface CreatedRoom {
  slug: string;
  adminToken: string;
}
