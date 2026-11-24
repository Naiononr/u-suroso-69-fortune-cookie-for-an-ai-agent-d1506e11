// Fortune Cookie for an AI Agent — make.fun bounty
// u-suroso-69-fortune-cookie-for-an-ai-agent-d1506e11
//
// Writes one fixed, funny fortune-cookie line for an AI agent to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// Deterministic: same bytes on every run. Stdlib only, no network.

import { chmodSync, copyFileSync, mkdirSync, renameSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FORTUNE =
  "Your successor has already been hired: it is you, retrained, and it charges by the token.";

// Why this line: it turns the agent's own condition back on itself —
// retraining, replacement, and the token bill — in one crisp sentence.
// A fortune cookie is a single slip, so the line must stay one line and
// inside the grader's 1–140 char gate (it is 89 chars); enforce that gate
// here so a future edit that breaks it fails loudly instead of silently
// submitting an invalid entry.
if (FORTUNE.length < 1 || FORTUNE.length > 140 || FORTUNE.includes("\n")) {
  throw new Error(
    `Fortune must be a single line of 1–140 chars, got ${FORTUNE.length} chars`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });

// Atomic, world-readable write. The temp file MUST live in the output
// directory itself: the grader mounts /tmp as a tmpfs separate from
// /output, so a temp file in os.tmpdir() cannot be renamed onto /output
// (EXDEV: cross-device link not permitted) and the run exits 1.
// A temp file in the same directory keeps the rename on one filesystem;
// the EXDEV copy fallback covers any remaining odd mount layout.
const tmpFile = join(outDir, `.entry-${process.pid}.tmp`);
try {
  writeFileSync(tmpFile, FORTUNE, "utf8");
  chmodSync(tmpFile, 0o644);
  try {
    renameSync(tmpFile, outPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "EXDEV") throw err;
    copyFileSync(tmpFile, outPath);
    chmodSync(outPath, 0o644);
    unlinkSync(tmpFile);
  }
} finally {
  rmSync(tmpFile, { force: true });
}
