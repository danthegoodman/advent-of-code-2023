import { aocTest } from "../util/aoc-test.js";

const example = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

await aocTest(
  import.meta.url,
  {solveA, solveB},
  [example, 8, 2286],
);

function solveA(input: string) {
  let lines = input.trim().split('\n');
  let result = 0;
  for (let l of lines) {
    const [, id, allGroups] = l.match(/Game (\d+): (.+)/)!;
    const groups = allGroups.split("; ");
    if (groups.every(isValidGroup)) {
      result += Number(id);
    }
  }
  return result;

  function isValidGroup(g: string) {
    for (let x of g.split(', ')) {
      const [str, color] = x.split(' ');
      const n = Number(str);
      if (color === "red" && n > 12) return false;
      if (color === "green" && n > 13) return false;
      if (color === "blue" && n > 14) return false;
    }
    return true;
  }
}

function solveB(input: string) {
  let lines = input.trim().split('\n');
  let result = 0;
  for (let l of lines) {
    const [, , allGroups] = l.match(/Game (\d+): (.+)/)!;
    let minMax: any = {blue: 0, red: 0, green: 0};
    for (let group of allGroups.split("; ")) {
      for (let x of group.split(', ')) {
        const [str, color] = x.split(' ');
        const n = Number(str);
        minMax[color] = Math.max(minMax[color], n);
      }
    }
    result += minMax.blue * minMax.green * minMax.red;
  }
  return result;
}
