import test from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/cli.js";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

test("prints help without requiring an API key", async () => {
  const originalLog = console.log;
  const output = [];
  console.log = (message) => output.push(message);
  try {
    await run(["--help"]);
  } finally {
    console.log = originalLog;
  }
  assert.match(output.join("\n"), /repo-explorer/);
  assert.match(output.join("\n"), /research-brief/);
  assert.match(output.join("\n"), /idea-to-execution/);
  assert.match(output.join("\n"), /init/);
});

test("rejects unknown commands", async () => {
  await assert.rejects(() => run(["not-a-command"]), /Unknown command/);
});

test("installs skill files without requiring an API key", async () => {
  const originalCwd = process.cwd();
  const directory = await mkdtemp(path.join(os.tmpdir(), "myskills-"));
  process.chdir(directory);
  try {
    await run(["init"]);
    const skill = await readFile(
      path.join(directory, ".github", "skills", "repo-explorer", "SKILL.md"),
      "utf8",
    );
    assert.match(skill, /Repository Explorer/);
  } finally {
    process.chdir(originalCwd);
    await rm(directory, { recursive: true, force: true });
  }
});
