import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const [rawOptions, rawPatterns] = rawData.split('\n\n');

const options = rawOptions.split(', ');
const patterns = rawPatterns.split('\n');

// dfs
const check = (pattern: string, cache: Map<string, number>) => {
  if (cache.has(pattern)) {
    return cache.get(pattern)!;
  }

  if (pattern.length === 0) {
    return 1;
  }

  let count = 0;
  options.forEach((option) => {
    const piece = pattern.substring(0, option.length);
    if (piece === option) {
      count += check(pattern.substring(option.length), cache);
    }
  });

  cache.set(pattern, count);

  return count;
};

let sum = 0;
patterns.forEach((pattern, i) => {
  // console.log('Pattern', i);
  sum += check(pattern, new Map<string, number>());
});

console.log(sum);