import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const [registerData, instData] = rawData.split('\n\n');

let [a, b, c] = registerData.split('\n').map((register) => +register.split(': ')[1]);
const instructions = instData.split(': ')[1].split(',').map(Number);
let pointer = 0;
let output: number[] = [];

const getCombo = {
  0: (val: number) => val,
  1: (val: number) => val,
  2: (val: number) => val,
  3: (val: number) => val,
  4: (val: number) => a,
  5: (val: number) => b,
  6: (val: number) => c,
  7: (val: number) => Infinity,
};

const machine = {
  0: (combo: number) => {
    a = Math.floor(a / 2 ** getCombo[combo as 1](combo));
    return 2;
  },
  1: (literal: number) => {
    b = b ^ literal;
    return 2;
  },
  2: (combo: number) => {
    b = getCombo[combo as 1](combo) % 8;
    return 2;
  },
  3: (literal: number) => {
    if (a === 0) {
      return 2;
    }
    pointer = literal;
    return 0;
  },
  4: (operand: number) => {
    b = b ^ c;
    return 2;
  },
  5: (combo: number) => {
    const out = `${getCombo[combo as 1](combo) % 8}`;
    output.push(...out.split('').map(Number));
    return 2;
  },
  6: (combo: number) => {
    b = Math.floor(a / 2 ** getCombo[combo as 1](combo));
    return 2;
  },
  7: (combo: number) => {
    c = Math.floor(a / 2 ** getCombo[combo as 1](combo));
    return 2;
  },
};

while (instructions[pointer] != null) {
  const opcode = +instructions[pointer] as 1;
  const operand = +instructions[pointer + 1];
  // console.log(opcode, operand)
  const inc = machine[opcode](operand);
  pointer += inc;
}

console.log(output.join())