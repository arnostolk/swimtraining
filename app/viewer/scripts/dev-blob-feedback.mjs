import fs from "node:fs";
import { spawn } from "node:child_process";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) {
    return;
  }

  const lines = fs.readFileSync(".env.local", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    process.env[key.trim()] ??= valueParts.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

loadLocalEnv();

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN ontbreekt. Zet deze in app/viewer/.env.local om lokaal tegen Vercel Blob te testen.");
  process.exit(1);
}

const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev"], {
  stdio: "inherit",
  env: {
    ...process.env,
    FEEDBACK_STORE: "vercel-blob",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
