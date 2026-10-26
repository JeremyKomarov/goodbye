import { AuthApiError, AuthSessionMissingError } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

// A browser whose session Supabase Auth has revoked, or has not: the client is a stand-in, so
// nothing here reaches the network.
const auth = {
  getSession: vi.fn(),
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
};
vi.mock("./client", () => ({ browserSupabase: () => ({ auth }) }));
vi.mock("./captcha", () => ({ captchaToken: async () => "captcha-token" }));

const USER = "11111111-1111-1111-1111-111111111111";
const signedIn = { data: { session: { user: { id: USER }, access_token: "old" } } };

// `restoreSession` asks once a page load, so each case loads the module afresh.
async function load() {
  vi.resetModules();
  return import("./session");
}

beforeEach(() => {
  vi.clearAllMocks();
  auth.getSession.mockResolvedValue(signedIn);
  auth.signInWithPassword.mockResolvedValue({ error: null });
});

describe("restoreSession", () => {
  it("signs back in with the kept code when the session is gone", async () => {
    auth.getUser.mockResolvedValue({ error: new AuthSessionMissingError() });
    const { restoreSession } = await load();
    await expect(restoreSession(() => "ABCD2345")).resolves.toBe(true);
    expect(auth.signInWithPassword).toHaveBeenCalledOnce();
  });

  it("leaves a session the server still knows alone", async () => {
    auth.getUser.mockResolvedValue({ error: null });
    const { restoreSession } = await load();
    await expect(restoreSession(() => "ABCD2345")).resolves.toBe(false);
    expect(auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("does nothing on a failure that says nothing about the session", async () => {
    auth.getUser.mockResolvedValue({ error: new AuthApiError("down", 500, "unexpected_failure") });
    const { restoreSession } = await load();
    await expect(restoreSession(() => "ABCD2345")).resolves.toBe(false);
    expect(auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("asks nothing without a kept code, or without a session", async () => {
    const { restoreSession } = await load();
    await expect(restoreSession(() => null)).resolves.toBe(false);
    auth.getSession.mockResolvedValue({ data: { session: null } });
    const again = await load();
    await expect(again.restoreSession(() => "ABCD2345")).resolves.toBe(false);
    expect(auth.getUser).not.toHaveBeenCalled();
  });

  it("asks once a page load", async () => {
    auth.getUser.mockResolvedValue({ error: null });
    const { restoreSession } = await load();
    await restoreSession(() => "ABCD2345");
    await restoreSession(() => "ABCD2345");
    expect(auth.getUser).toHaveBeenCalledOnce();
  });

  it("holds other requests' headers until it has signed back in", async () => {
    auth.getUser.mockResolvedValue({ error: new AuthSessionMissingError() });
    let signIn!: () => void;
    auth.signInWithPassword.mockReturnValue(
      new Promise((resolve) => (signIn = () => resolve({ error: null }))),
    );
    const { restoreSession, sessionHeaders } = await load();
    const restored = restoreSession(() => "ABCD2345");
    const headers = sessionHeaders();
    await vi.waitFor(() => expect(auth.signInWithPassword).toHaveBeenCalled());
    auth.getSession.mockResolvedValue({
      data: { session: { user: { id: USER }, access_token: "new" } },
    });
    signIn();
    await restored;
    await expect(headers).resolves.toEqual({ authorization: "Bearer new" });
  });
});

describe("signInWithCode", () => {
  it("sends the captcha's token with the code", async () => {
    const { signInWithCode } = await load();
    await signInWithCode(USER, "abcd2345");
    expect(auth.signInWithPassword).toHaveBeenCalledWith(
      expect.objectContaining({ options: { captchaToken: "captcha-token" } }),
    );
  });

  it("tells a refused captcha from a wrong code", async () => {
    const { signInWithCode } = await load();
    const refuse = (code: string, status: number) =>
      auth.signInWithPassword.mockResolvedValueOnce({ error: new AuthApiError("no", status, code) });
    refuse("captcha_failed", 400);
    await expect(signInWithCode(USER, "abcd2345")).rejects.toMatchObject({ code: "unauthorized" });
    refuse("invalid_credentials", 400);
    await expect(signInWithCode(USER, "abcd2345")).rejects.toMatchObject({
      code: "wrong_login_code",
    });
  });
});
