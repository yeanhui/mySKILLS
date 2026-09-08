import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { complete } from "../model-client.js";
import { optionValue, removeOptions, writeOutput } from "../shared.js";

const execFileAsync = promisify(execFile);
const MAX_DIFF_CHARS = 60000;

export async function runCodeReview(args) {
  const output = optionValue(args, "--output", "code-review.md");
  const base = optionValue(args, "--base", "HEAD");
  const directory = removeOptions(args, ["--output", "--base"])[0] || ".";

  let diff;
  try {
    const { stdout } = await execFileAsync("git", ["diff", base], {
      cwd: directory,
      maxBuffer: 1024 * 1024 * 10,
    });
    diff = stdout;
  } catch (error) {
    throw new Error(`Could not read a git diff against "${base}" in ${directory}: ${error.message}`);
  }
  if (!diff.trim()) {
    throw new Error(`No changes found against "${base}". Make some changes or pass a different --base.`);
  }

  const result = await complete({
    system: "You are a meticulous senior code reviewer. Focus on correctness, security, and maintainability. Do not invent issues that are not supported by the diff.",
    user: `Review this git diff and write a Markdown code review with these sections:
1. Summary of the change
2. Bugs and correctness issues
3. Security concerns
4. Style and maintainability suggestions
5. Missing tests or documentation
6. Overall verdict (approve, approve with comments, or request changes)

Diff (against ${base}):
${diff.slice(0, MAX_DIFF_CHARS)}`,
  });
  const written = await writeOutput(output, result);
  console.log(`Code review written to ${written}`);
}
