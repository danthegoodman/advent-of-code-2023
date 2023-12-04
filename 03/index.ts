import { aocTest } from "../util/aoc-test.js";

const example = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`

await aocTest(
  import.meta.url,
  {solveA, solveB},
  [example, 4361, 467835],
);

function solveA(input: string) {
  let lines = input.trim().split('\n');
  let result = 0;
  for (let [row, l] of lines.entries()) {
    for (const match of l.matchAll(/\d+/g)) {
      const len = match[0].length;
      let cStart = Math.max(match.index! - 1, 0);
      let cEnd = match.index! + len + 1;
      let chars = [lines[row - 1], lines[row], lines[row + 1]].map(it => it?.slice(cStart, cEnd) ?? "").join('');
      if (chars.match(/[^0-9.]/)) {
        result += Number(match[0]);
      }
    }
  }
  return result;
}

function solveB(input: string) {
  let lines = input.trim().split('\n');
  let result = 0;
  let cogs = new Map<string, number[]>();

  for (let [row, l] of lines.entries()) {
    for (const match of l.matchAll(/\d+/g)) {
      const len = match[0].length;
      let cStart = Math.max(match.index! - 1, 0);
      let cEnd = Math.min(match.index! + len, l.length);
      for (let r = row - 1; r <= row + 1; r++) {
        if (lines[r] === undefined) continue;
        for (let c = cStart; c <= cEnd; c++) {
          if (lines[r][c] === "*") {
            const key = r + "," + c;
            const n = Number(match[0]);
            cogs.get(key)?.push(n) ?? cogs.set(key, [n])
          }
        }
      }
    }
  }

  for(let cNums of cogs.values()){
    if(cNums.length === 2){
      result += (cNums[0] * cNums[1])
    }
  }
  return result;
}
