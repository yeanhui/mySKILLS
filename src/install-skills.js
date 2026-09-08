import { access, cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(packageRoot, "skills");

const skillNames = ["repo-explorer", "research-brief", "idea-to-execution"];

export async function installSkills({ force = false } = {}) {
  const destinationRoot = path.resolve(".github", "skills");
  await mkdir(destinationRoot, { recursive: true });

  for (const skillName of skillNames) {
    const source = path.join(sourceRoot, skillName);
    const destination = path.join(destinationRoot, skillName);
    if (!force) {
      try {
        await access(destination);
        throw new Error(`${destination} already exists. Use --force to replace it.`);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
    await cp(source, destination, { recursive: true, force });
  }

  console.log(`Installed ${skillNames.length} VS Code Agent Skills in ${destinationRoot}`);
}
