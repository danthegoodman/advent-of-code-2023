import {aocTest} from "../util/aoc-test.js";

const example = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`
const ex2 = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

await aocTest(
  import.meta.url,
  {solveA, solveB},
  [example, 142, null],
  [ex2, null, 281],
);

function solveA(input: string): number {
  let lines = input.trim().split('\n');
  let sum = 0;
  for(const l of lines){
    const matches = Array.from(l.matchAll(/\d/g), it=>it[0]);
    const first = matches[0];
    const last = matches.at(-1);
    let n = Number.parseInt(first +""+last,10);
    sum += n
  }
  return sum;
}

function solveB(input: string): number {
  let lines = input.trim().split('\n');
  let sum = 0;
  for(const l of lines){
    // gotta use a non-consuming regex for match all in case there's overlap (like twone should be 21)
    const matches = Array.from(l.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g), it=>it[1]);
    const first = translate(matches[0]);
    const last = translate(matches.at(-1)!);
    let n = Number.parseInt(first +""+last,10);
    console.log({l, first, last, n})
    sum += n
  }
  return sum;

  function translate(s: string){
    switch(s){
      case "one": return 1;
      case "two": return 2;
      case "three": return 3;
      case "four": return 4;
      case "five": return 5;
      case "six": return 6;
      case "seven": return 7;
      case "eight": return 8;
      case "nine": return 9;
      default: return s;
    }
  }
}
