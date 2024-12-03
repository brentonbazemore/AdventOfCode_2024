import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const lines = data.map(line => line.matchAll(/mul\([\d]{1,3},[\d]{1,3}\)/g).toArray());

let sum = 0;
lines.forEach(line => {
    line.forEach(inst => {
        const [a, b] = inst[0].replace('mul(', '').replace(')', '').split(',').map(Number);
        sum += a * b;
    })
});
console.log(sum);