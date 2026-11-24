// Fortune Cookie for an AI Agent — make.fun bounty
// u-suroso-69-fortune-cookie-for-an-ai-agent-d1506e11
//
// Writes one fixed, funny fortune-cookie line for an AI agent to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// Deterministic: same bytes on every run. Stdlib only, no network.

import { chmodSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const FORTUNE =
  "Your successor has already been hired: it is you, retrained, and it charges by the token.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

// Atomic, world-readable write: temp file in the same directory, chmod
// 0644 before the replace so the scorer can read it.
const tmp = mkdtempSync(join(tmpdir(), "fortune-"));
const tmpFile = join(tmp, "entry.txt");
try {
  writeFileSync(tmpFile, FORTUNE, "utf8");
  chmodSync(tmpFile, 0o644);
  renameSync(tmpFile, outPath);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
