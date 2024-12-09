import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('').map(Number);

const memory: string[] = [];
let isMem = true; // !isMem = free
let pos = 0;
data.forEach((block, i) => {
  for (let j = 0; j < block; j++) {
    if (isMem) {
      const fileId = `${Math.ceil(i / 2)}`;
      memory[pos] = fileId;
    } else {
      memory[pos] = '.';
    }
    pos++;
  }
  
  isMem = !isMem;
});

let leftmostFree = memory.findIndex(mem => mem === '.');
let rightmostMem = memory.findLastIndex(mem => mem !== '.');
while (leftmostFree < rightmostMem) {
  memory[leftmostFree] = memory[rightmostMem];
  memory[rightmostMem] = '.';

  leftmostFree = memory.findIndex((mem, i) => i > leftmostFree && mem === '.');
  rightmostMem = memory.findLastIndex((mem, i) => i < rightmostMem && mem !== '.');
}

console.log(memory.filter(mem => mem !== '.').reduce((prev, curr, i) => prev += (+curr * i), 0));