import {aocTest} from "../util/aoc-test.js";

const example = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

await aocTest(
  import.meta.url,
  {solveA, solveB},
  [example, 13, 30],
);

function solveA(input: string) {
  let result = 0;
  for(const [,winSide, haveSide] of input.trim().matchAll(/: ([^|]+) \| (.+)$/gm)){
    const winners = winSide.split(/\s+/);
    const matches = haveSide.split(/\s+/).filter(it=> winners.includes(it));
    if(matches.length){
      result += (2 ** (matches.length - 1));
    }
  }
  return result;
}

function solveB(input: string) {
  let result = 0;
  let n = 0;
  const cards = Array.from(input.trim().matchAll(/: ([^|]+) \| (.+)$/gm));
  let multipliers = Array.from(cards, ()=>1);
  for(const [,winSide, haveSide] of cards){
    let mult = multipliers[n];
    const winners = winSide.split(/\s+/);
    const matches = haveSide.split(/\s+/).filter(it=> winners.includes(it)).length;

    for(let i = 0; i < matches; i++){
      multipliers[i + n + 1] += mult;
    }

    n++;
  }
  result = multipliers.reduce((a,b)=>a+b);
  return result;
}
