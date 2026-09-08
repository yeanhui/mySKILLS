import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { complete } from "../model-client.js";
import { optionValue, writeOutput } from "../shared.js";

const IGNORED = new Set([".git", "node_modules", "dist", "build", "coverage", ".next"]);
const MAX_FILES = 80;
const MAX_CHARS_PER_FILE = 5000;

async function collectFiles(directory, relative = "") {
  if (relative.split(path.sep).some((part) => IGNORED.has(part))) return [];
  const entries = await readdir(path.join(directory, relative), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(directory, child));
    else if (files.length < MAX_FILES && !entry.name.startsWith(".env")) files.push(child);
    if (files.length >= MAX_FILES) break;
  }
  return files;
}

export async function runRepoExplorer(args) {
  const directory = args[0] && !args[0].startsWith("--") ? args[0] : ".";
  const output = optionValue(args, "--output", "PROJECT_OVERVIEW.md");
  const root = path.resolve(directory);
  if (!(await stat(root)).isDirectory()) throw new Error(`${directory} is not a directory.`);

  const files = await collectFiles(root);
  const excerpts = [];
  for (const relative of files) {
    try {
      const content = await readFile(path.join(root, relative), "utf8");
      excerpts.push(`### ${relative}\n${content.slice(0, MAX_CHARS_PER_FILE)}`);
    } catch {
      // Binary and unreadable files are represented by the file list only.
      excerpts.push(`### ${relative}\n[content unavailable]`);
    }
  }

  const result = await complete({
    system: "You are a senior software architect. Produce accurate, practical Markdown. Do not invent files, dependencies, or behavior that is not supported by the supplied repository evidence.",
    user: `Analyze this repository and write an onboarding document with these sections:
1. Executive summary
2. Architecture and data flow
3. Important directories and files
4. How to run, test, and extend it
5. Dependencies and configuration
6. Risks, unknowns, and recommended next steps

Repository: ${root}
File excerpts:
${excerpts.join("\n\n")}`,
  });
  const written = await writeOutput(output, result);
  console.log(`Repository overview written to ${written}`);
}
