import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const PATTERN = 'MAS'.split('');
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
    const bottomLeft = [x - 1, y + 1];
    const bottomRight = [x + 1, y + 1];
    const topRight = [x + 1, y - 1];
    const topLeft = [x - 1, y - 1];
    const crossingPairs: [Function, Function, any, any][] = [
      [upRight, downRight, bottomLeft, topLeft],
      [upLeft, upRight, bottomRight, bottomLeft],
      [upLeft, downLeft, bottomRight, topRight],
      [downLeft, downRight, topRight, topLeft],
    ];

    const xShape = crossingPairs.some(([dir1, dir2, root1, root2]) => dir1(root1[0], root1[1]) && dir2(root2[0], root2[1]));

    if (xShape) {
      sum += 1;
    }
  }
}
console.log(sum);
