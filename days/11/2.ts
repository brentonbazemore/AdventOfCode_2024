import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split(' ').map(Number);

let numbers = new Map<number, number>();
data.forEach(number => numbers.set(number, 1));

const addToMap = (map: Map<number, number>, key: number, value: number) => {
    if (!map.has(key)) {
        map.set(key, 0);
    }

    map.set(key, map.get(key)! + value);
}

for (let blink = 0; blink < 75; blink++) {
    const nextNumbers = new Map<number, number>();

    numbers.forEach((count, number) => {
        if (number === 0) {
            addToMap(nextNumbers, 1, count);
        } else if (`${number}`.length % 2 === 0) {
            const str = `${number}`;
            const left = +str.slice(0, str.length / 2);
            const right = +str.slice(str.length / 2, str.length);
            addToMap(nextNumbers, left, count);
            addToMap(nextNumbers, right, count);
        } else {
            addToMap(nextNumbers, number * 2024, count);
        }
    });

    numbers = nextNumbers;
    console.log('Blink:', blink + 1, numbers.size);
}

let sum = 0;
numbers.forEach((count) => sum += count);
console.log(sum);