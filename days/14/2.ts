import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const bounds = inputFile !== 'input.txt' ? { top: 0, left: 0, right: 11, bottom: 7 } : { top: 0, left: 0, right: 101, bottom: 103 };
const positions = new Map<string, number>();

const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

const bots = data.map((row) => {
  const [rawP, rawV] = row.split(' ').map((raw) => raw.split('=')[1]);
  let [px, py] = rawP.split(',').map(Number);
  const [vx, vy] = rawV.split(',').map(Number);

  return { px, py, vx, vy };
});

for (let i = 0; i < 10000; i++) {
  console.log('\nStep' + (i + 1));
  positions.clear();
  bots.forEach(bot => {
    bot.px = mod((bot.px + bot.vx), bounds.right);
    bot.py = mod((bot.py + bot.vy), bounds.bottom);
    positions.set(`${bot.px}_${bot.py}`, 1);
  });

  for (let y = 0; y < bounds.bottom; y++) {
    let row = '';
    for (let x = 0; x < bounds.right; x++) {
      row += positions.get(`${x}_${y}`) ?? '.';
    }
    console.log(row);
  }
}

// if you run this one, you have to store the output in a file or something to see it
// expect it to be between step 5000 and 10000