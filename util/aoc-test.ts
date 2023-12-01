import chalk from "chalk";
import {basename, dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {readFileSync, writeFileSync} from "node:fs";

type AocResult = string | number | null | undefined;

/**
 * If the test returns null or undefined, it is assumed to be incomplete.
 * Otherwise, the output is normalized into a string format for output comparison.
 */
type AocTestFn = (input: string) => AocResult;

/**
 * Either expectation may be nullish. If so, the example is not run for that
 * part. Useful if the second part does not reuse the first part's example.
 */
type AocExample = [input: string, expectedA: AocResult, expectedB: AocResult];
type AocTest = { solveA: AocTestFn; solveB: AocTestFn; }

/**
 * Defines a test suite for running an Advent of Code challenge.
 *
 * The use of the importMetaUrl a code template to be copy & pasted into each
 * day's challenge. Only the day number is extracted from it.
 *
 * Any number of examples may be given. If an example's result for a part is
 * nullish, then that example will not be run for that part. All examples
 * for a day must pass before the actual input will be executed.
 *
 * When executing against the real input, the result will be cached to the file
 * system. Subsequent runs will compare the output to the previous result and
 * will report if it has changed.
 */
export async function aocTest(importMetaUrl: string, opts: AocTest, ...examples: AocExample[]) {
  const testId = basename(dirname(fileURLToPath(importMetaUrl)));
  const dataDir = dirname(dirname(fileURLToPath(import.meta.url))) + "/data";

  const input = await readInput(dataDir, testId);
  const solvers = [["A", opts.solveA], ["B", opts.solveB]] as const;

  for (const [name, solver] of solvers) {
    let passed = true;
    for (const [n, ex] of examples.entries()) {
      passed &&= runExample(name, n, solver, ex);
    }
    if (!passed) {
      console.log(chalk.yellow(`${name}: Examples failed.`) + " Not running against input");
      continue;
    }

    runReal(testId, dataDir, name, solver, input)

    if(name === "A") console.log();
  }
}

async function readInput(dataDir: string, testId: string){
  const filename = `${testId}-input.txt`;
  const result = maybeReadFile(dataDir + "/" + filename);
  if (!result) throw `missing ${filename}`;
  return result.trim();
}

function maybeReadFile(filename: string): string | null {
  try {
    return readFileSync(filename, 'utf8');
  } catch (e: any){
    if(e.code !== "ENOENT") throw e;
    return null;
  }
}

function runExample(part: 'A' | 'B', n: number, solver: AocTestFn, ex: AocExample): boolean {
  const expected = part === 'A' ? ex[1] : ex[2]
  if(expected == null) return true;

  const actual = solver(ex[0]);
  const expStr = String(expected);

  let message: string;
  let color: (s:string)=>string;
  if (actual == undefined) {
    message = `${actual} result`;
    color = chalk.redBright;
  } else {
    const actStr = String(actual)
    if (actStr === expStr) {
      message = "✅ "
      color = chalk.green;
    } else {
      message = "\n   actual: " + actual + "\n expected: " + expStr;
      color = chalk.red;
    }
  }

  const title = color(`${part}: Example ${n + 1}`)
  console.log(title+": " + message);

  return color === chalk.green;
}

function runReal(testId: string, dataDir: string, part: 'A' | 'B', solver: AocTestFn, input: string){
  const actual = solver(input);
  const actStr = String(actual);

  const outputFile = `${dataDir}/${testId}-output${part}.txt`;
  const expected = maybeReadFile(outputFile);

  let message: string;
  let color: (s:string)=>string;
  if (actual == undefined) {
    message = `${actual} result`;
    color = chalk.redBright;
  } else {
    message = actStr;
    if(expected != null){
      if(actStr === expected){
        color = chalk.green;
      } else {
        message += chalk.yellow("\nPrevious") + ": " + expected;
        color = chalk.yellow;
      }
    } else {
      color = s=>s;
    }
    writeFileSync(outputFile, actStr);
  }

  console.log(color(`${part} Result`) + ": " + message);
}

