import '../../types/helper.d.ts';
import { runMachine } from './machine.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const [registerData, instData] = rawData.split('\n\n');

const instructions = instData.split(': ')[1].split(',').map(Number);
console.log('target', instructions.join());
const target = instructions;

const magnitudes = [
  281474976710656, 35184372088832, 4398046511104, 549755813888, 68719476736, 8589934592, 1073741824, 134217728, 16777216, 2097152, 262144, 32768, 4096, 512, 64,
  8, 1,
];

const solutions: number[] = [];
const findSolutions = (n: number, solution: number) => {
  if (n > magnitudes.length) {
    return;
  }

  for (let j = 0; j < magnitudes[n - 1]; j += magnitudes[n]) {
    const output = runMachine(instructions, solution + j);
    console.log(n, output.join());
    if (output.join() === target.join()) {
      solutions.push(solution + j);
    }

    if (output.at(-n) === target.at(-n)) {
      findSolutions(n + 1, solution + j);
    }

  }
};

findSolutions(1, 0);
console.log(Math.min(...solutions));

// for (let i = 1; i < magnitudes.length; i++) {
//   for (let j = magnitudes[i]; j < magnitudes[i - 1]; j += magnitudes[i]) {
//     const output = runMachine(instructions, j);
//     console.log(output.join());
//   }
// }
