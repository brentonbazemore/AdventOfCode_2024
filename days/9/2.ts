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

const maxFile = +memory[memory.length - 1];
for (let fileId = maxFile; fileId > 0; fileId--) {
  const fileStart = memory.findIndex((mem) => +mem === fileId);
  const fileEnd = memory.findLastIndex((mem) => +mem === fileId);
  const fileSize = (fileEnd - fileStart) + 1;
  const freeChunk = memory.findIndex((mem, j) => {
    for (let k = 0; k < fileSize; k++) {
      if (memory[j + k] !== '.') {
        return false;
      }
    }

    return true;
  });

  if (freeChunk > fileStart) {
    continue;
  }

  if (freeChunk != -1) {
    for (let j = 0; j < fileSize; j++) {
      memory[freeChunk + j] = `${fileId}`;
      memory[fileStart + j] = '.';
    }
  }
}

console.log(
  memory.reduce((prev, curr, i) => {
    if (curr === '.') {
      return prev;
    }
    return (prev += +curr * i);
  }, 0)
);
