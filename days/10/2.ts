import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const up = (x: number, y: number) => ({ x, y: y - 1, value: +data[y - 1]?.[x] });
const down = (x: number, y: number) => ({ x, y: y + 1, value: +data[y + 1]?.[x] });
const left = (x: number, y: number) => ({ x: x - 1, y, value: +data[y]?.[x - 1] });
const right = (x: number, y: number) => ({ x: x + 1, y, value: +data[y]?.[x + 1] });

const uniq9s = new Set();
const findPath = (x: number, y: number, path: number[]) => {
    if (path.length === 10) {
        uniq9s.add(`${x}_${y}`);
        return [path];
    }

    const trails: number[][] = [];
    [up, down, left, right].forEach((direction) => {
        const { x: newX, y: newY, value } = direction(x, y);
        if (+path.at(-1)! + 1 === value) {
            trails.push(...findPath(newX, newY, [...path, value]))
        }
    });
    return trails;
}

let sum = 0;
const out: number[][] = [];
for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
        if (data[y][x] === '0') {
            uniq9s.clear();
            out.push(...findPath(x, y, [0]));
            sum += uniq9s.size;
        }
    }
}
console.log(out.filter(p => p.length === 10).length);