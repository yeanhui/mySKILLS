import { complete } from "../model-client.js";
import { optionValue, optionValues, removeOptions, writeOutput } from "../shared.js";

export async function runResearchBrief(args) {
  const urls = optionValues(args, "--url");
  const output = optionValue(args, "--output", "research-brief.md");
  const topicArgs = removeOptions(args, ["--url", "--output"]);
  const topic = topicArgs.join(" ").trim();
  if (!topic) throw new Error("Provide a research topic.");

  const sources = [];
  for (const url of urls) {
    let response;
    try {
      response = await fetch(url);
    } catch (error) {
      throw new Error(`Could not fetch ${url}: ${error.message}`);
    }
    if (!response.ok) throw new Error(`Could not fetch ${url} (${response.status}).`);
    sources.push(`SOURCE: ${url}\n${(await response.text()).slice(0, 12000)}`);
  }

  const result = await complete({
    system: "You are a careful research analyst. Distinguish facts from interpretation, cite supplied URLs inline as [1], [2], and never claim to have consulted sources that were not supplied.",
    user: `Create a concise Markdown research brief about: ${topic}

Include: an executive summary, key findings, comparison or trade-offs where relevant, practical recommendations, and a Sources section. If no URLs are supplied, clearly label claims that need verification.

${sources.length ? sources.join("\n\n") : "No source URLs were supplied."}`,
  });
  const written = await writeOutput(output, result);
  console.log(`Research brief written to ${written}`);
}
