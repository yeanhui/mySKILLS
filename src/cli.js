import { runRepoExplorer } from "./skills/repo-explorer.js";
import { runResearchBrief } from "./skills/research-brief.js";
import { runIdeaToExecution } from "./skills/idea-to-execution.js";
import { runCodeReview } from "./skills/code-review.js";
import { installSkills } from "./install-skills.js";

const HELP = `@yeanhui/myskills - practical AI skills for projects

Usage:
  myskills <command> [arguments] [options]

Commands:
  repo-explorer [directory]       Analyze a repository
  research-brief <topic>         Create a research brief
  idea-to-execution <idea>        Create an implementation plan
  code-review [directory]         Review a git diff for bugs and security issues
  init [--force]                  Install VS Code Agent Skills in this project

Options:
  --output <file>                 Output Markdown path
  --url <url>                     Source URL (repeatable, research-brief only)
  --base <ref>                    Git ref to diff against (code-review only, default: HEAD)
  --help                          Show this help

Environment:
  OPENAI_API_KEY                  Required model provider API key
  OPENAI_MODEL                    Optional model (default: gpt-4o-mini)
  OPENAI_BASE_URL                 Optional OpenAI-compatible API base URL`;

export async function run(args) {
  const [command, ...rest] = args;
  if (!command || command === "--help" || command === "-h") {
    console.log(HELP);
    return;
  }

  if (command === "repo-explorer") return runRepoExplorer(rest);
  if (command === "research-brief") return runResearchBrief(rest);
  if (command === "idea-to-execution") return runIdeaToExecution(rest);
  if (command === "code-review") return runCodeReview(rest);
  if (command === "init") return installSkills({ force: rest.includes("--force") });
  throw new Error(`Unknown command "${command}". Run "myskills --help" for usage.`);
}
