import { runRepoExplorer } from "./skills/repo-explorer.js";
import { runResearchBrief } from "./skills/research-brief.js";
import { runIdeaToExecution } from "./skills/idea-to-execution.js";
import { installSkills } from "./install-skills.js";

const HELP = `@ianyian/myskills - practical AI skills for projects

Usage:
  myskills <command> [arguments] [options]

Commands:
  repo-explorer [directory]       Analyze a repository
  research-brief <topic>         Create a research brief
  idea-to-execution <idea>        Create an implementation plan
  init [--force]                  Install VS Code Agent Skills in this project

Options:
  --output <file>                 Output Markdown path
  --url <url>                     Source URL (repeatable, research-brief only)
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
  if (command === "init") return installSkills({ force: rest.includes("--force") });
  throw new Error(`Unknown command "${command}". Run "myskills --help" for usage.`);
}
