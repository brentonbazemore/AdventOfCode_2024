import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.replaceAll('\n', '');

const enables = data.matchAll(/do\(\)/g).toArray();
const disables = data.matchAll(/don't\(\)/g).toArray();
const muls = data.matchAll(/mul\([\d]{1,3},[\d]{1,3}\)/g).toArray();

const toggles = [{[0]: 'do()', index: 0}, ...enables, ...disables].sort((a, b) => a.index - b.index);

let sum = 0;
muls.forEach(inst => {
    const isEnabled = toggles.findLast((toggle) => toggle.index < inst.index)?.[0] === 'do()';
    const [a, b] = inst[0].replace('mul(', '').replace(')', '').split(',').map(Number);
    if (isEnabled) {
        sum += a * b;
    }
});
console.log(sum);