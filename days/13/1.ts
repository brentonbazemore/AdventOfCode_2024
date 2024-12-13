import nerdtype from 'nerdamer';
var rawnerd = require('nerdamer/all');
const nerdamer: typeof nerdtype = rawnerd;
// ^ I'm sorry you had to read this, but I'm more sorry I had to write this

import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n\n');

let sum = 0;
data.forEach(rawMachine => {
    const [rawA, rawB, rawP] = rawMachine.split('\n').map(line => line.split(': ')[1]);
    const [ax, ay] = rawA.split(', ').map(section => section.split('+')[1]).map(Number);
    const [bx, by] = rawB.split(', ').map(section => section.split('+')[1]).map(Number);
    const [px, py] = rawP.split(', ').map(section => section.split('=')[1]).map(Number);
    const b = +nerdamer(`((${px}-(b*${bx}))/${ax}) = ((${py}-(b*${by}))/${ay})`).solveFor('b').toString();
    const a = +nerdamer(`a=((${px}-(${b}*${bx}))/${ax})`).solveFor('a').toString();
    if (isNaN(a) || isNaN(b)) {

    } else {
        sum += (3 * a) + b;
    }
});
console.log(sum);
