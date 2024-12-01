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

const min = (ar: { value: number, seen: boolean}[]) => {
    let localMin = Infinity;
    let pos = -1;
    for (let i = 0; i < ar.length; i++) {
        if (ar[i].value < localMin && !ar[i].seen) {
            localMin = ar[i].value;
            pos = i;
        }
    }
    ar[pos].seen = true;
    return { ...ar[pos], pos };
}
let leftMin;
let rightMin;
let sum = 0;
for (let i = 0; i < data.length; i++) {
    leftMin = min(left);
    rightMin = min(right);
    // console.log(leftMin, rightMin)

    const dist = Math.abs(leftMin.value - rightMin.value);
    console.log(dist);
    sum += dist;
}


console.log(sum);



