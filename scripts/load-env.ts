import { existsSync } from "node:fs";
import { resolve } from "node:path";

/** Loads .env.local and .env (in that priority) the way Next.js does, for CLI scripts. */
export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (existsSync(path)) process.loadEnvFile(path);
  }
}
