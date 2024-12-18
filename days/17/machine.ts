const XOR = (v1: number, v2: number) => {
  const hi = 0x80000000;
  const low = 0x7fffffff;
  const hi1 = ~~(v1 / hi);
  const hi2 = ~~(v2 / hi);
  const low1 = v1 & low;
  const low2 = v2 & low;
  const h = hi1 ^ hi2;
  const l = low1 ^ low2;
  return h * hi + l;
};

export const runMachine = (instructions: number[], a: number) => {
  let b = 0;
  let c = 0;
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
      b = XOR(b, literal);
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
      b = XOR(b, c);
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

  // console.log(output.join());
  return output;
};

// let out = [];
// let x = a % 8;
// let a2 = Math.floor(a / 2 ** 3);
// let b2 = XOR(XOR(x, 1), 4);
// let c2 = Math.floor(a / 2 ** XOR(x, 1));
// let b3 = XOR(b2, c2);
// out.push(b3 % 8);
// const run = () => {
//   a = a2;
//   b = b3;
//   c = c2;

//   x = a % 8;
//   a2 = Math.floor(a / 2 ** 3);
//   b2 = XOR(XOR(x, 1), 4);
//   c2 = Math.floor(a / 2 ** XOR(x, 1));
//   b3 = XOR(b2, c2);
//   out.push(b3 % 8);
// };

// while (a > 8) {
//   run();
// }

// console.log(out.join());
