import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const left: { value: number, seen: boolean}[] = [];
const right: { value: number, seen: boolean}[] = [];

data.forEach(row => {
    const [l, r] = row.split('   ');
    left.push({ value: +l, seen: false });
    right.push({ value: +r, seen: false });
});

let sum = 0;
left.forEach(l => {
    const count = right.filter(r => r.value === l.value).length;
    sum += l.value * count;
});

console.log(sum);



