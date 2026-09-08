import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function writeOutput(filePath, content) {
  const absolutePath = path.resolve(filePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${content.trim()}\n`, "utf8");
  return absolutePath;
}

export function optionValue(args, name, fallback) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}

export function optionValues(args, name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === name && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}

export function removeOptions(args, names) {
  const result = [];
  for (let index = 0; index < args.length; index += 1) {
    if (names.includes(args[index])) index += 1;
    else result.push(args[index]);
  }
  return result;
}
