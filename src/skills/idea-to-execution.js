import { complete } from "../model-client.js";
import { optionValue, removeOptions, writeOutput } from "../shared.js";

export async function runIdeaToExecution(args) {
  const output = optionValue(args, "--output", "implementation-plan.md");
  const idea = removeOptions(args, ["--output"]).join(" ").trim();
  if (!idea) throw new Error("Provide an idea to turn into an execution plan.");

  const result = await complete({
    system: "You are a pragmatic technical product manager and software architect. Make assumptions explicit and keep the plan implementable.",
    user: `Turn this idea into an execution-ready Markdown plan:

${idea}

Include:
1. Problem and goals
2. Assumptions and non-goals
3. Proposed user experience
4. Technical approach
5. Ordered implementation tasks with likely files or modules
6. Acceptance criteria
7. Testing strategy
8. Risks and open questions`,
  });
  const written = await writeOutput(output, result);
  console.log(`Implementation plan written to ${written}`);
}
