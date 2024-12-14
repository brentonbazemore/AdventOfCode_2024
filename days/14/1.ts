import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const bounds = inputFile !== 'input.txt' ? { top: 0, left: 0, right: 11, bottom: 7 } : { top: 0, left: 0, right: 101, bottom: 103 };
const bots = new Map<string, number>();

const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

data.forEach((row) => {
  const [rawP, rawV] = row.split(' ').map((raw) => raw.split('=')[1]);
  let [px, py] = rawP.split(',').map(Number);
  const [vx, vy] = rawV.split(',').map(Number);

  for (let i = 0; i < 100; i++) {
    px = mod((px + vx), bounds.right);
    py = mod((py + vy),bounds.bottom);
  }

  bots.set(`${px}_${py}`, (bots.get(`${px}_${py}`) ?? 0) + 1);
});

const quadrants = {
  0: 0,
  1: 0, 
  2: 0, 
  3: 0,
};

bots.forEach((count, position) => {
  const [x, y] = position.split('_').map(Number);

  if (x < Math.floor(bounds.right / 2)) {
    if (y < Math.floor(bounds.bottom / 2)) {
      quadrants[0] += count;
    } else if (y >= Math.ceil(bounds.bottom / 2)) {
      quadrants[1] += count;
    }
  } else if (x >= Math.ceil(bounds.right / 2)) {
    if (y < Math.floor(bounds.bottom / 2)) {
      quadrants[2] += count;
    } else if (y >= Math.ceil(bounds.bottom / 2)) {
      quadrants[3] += count;
    }
  }
});

// for (let y = 0; y < bounds.bottom; y++) {
//   let row = '';
//   for (let x = 0; x < bounds.right; x++) {
//     row += bots.get(`${x}_${y}`) ?? '.';
//   }
//   console.log(row);
// }

console.log(Object.keys(quadrants).reduce((prod, curr) => prod * +quadrants[+curr as 1], 1));
