// The end-to-end run, apart from `npm run verify`: it needs a browser and a running app, which the
// gate and CI do not. `npm run e2e` starts the dev server unless one is already on port 3000.
import { defineConfig, devices } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: BASE_URL },
  projects: [
    { name: "phone", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 640 }, hasTouch: true } },
    { name: "laptop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: { command: "npm run dev", url: BASE_URL, reuseExistingServer: true, timeout: 120_000 },
});
