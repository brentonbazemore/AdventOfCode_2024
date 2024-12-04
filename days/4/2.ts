import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const PATTERN = 'XMAS'.split('');
const up = (x: number, y: number) => PATTERN.every((char, i) => data[y - i]?.[x] === char);
const down = (x: number, y: number) => PATTERN.every((char, i) => data[y + i]?.[x] === char);
const left = (x: number, y: number) => PATTERN.every((char, i) => data[y]?.[x - i] === char);
const right = (x: number, y: number) => PATTERN.every((char, i) => data[y]?.[x + i] === char);
const upRight = (x: number, y: number) => PATTERN.every((char, i) => data[y - i]?.[x + i] === char);
const downRight = (x: number, y: number) => PATTERN.every((char, i) => data[y + i]?.[x + i] === char);
const downLeft = (x: number, y: number) => PATTERN.every((char, i) => data[y + i]?.[x - i] === char);
const upLeft = (x: number, y: number) => PATTERN.every((char, i) => data[y - i]?.[x - i] === char);

let sum = 0;
for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[0].length; x++) {
    const root = data[y][x];

    const matches = [up, down, left, right, upRight, downRight, downLeft, upLeft].filter(func => func(x, y)).length;
    sum += matches;
  }
}
console.log(sum);
