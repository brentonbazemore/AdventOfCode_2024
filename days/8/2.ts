import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const bounds = { top: 0, right: data[0].length, bottom: data.length, left: 0 };

const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return [x2 - x1, y2 - y1];
};

const makeKey = (x: any, y: any) => `${x}_${y}`;
const makeCoords = (key: string) => key.split('_').map(Number);

const nodes = new Map<string, string[]>();
for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[0].length; x++) {
    const node = data[y][x];
    if (node != '.') {
      if (nodes.has(node)) {
        nodes.get(node)?.push(makeKey(x, y));
      } else {
        nodes.set(node, [makeKey(x, y)]);
      }
    }
  }
}

const antinodes = new Set<string>(); // not sure if 2 antinodes from same node can overlap
nodes.forEach((locations, node) => {

  locations.forEach(locationKey1 => {
    const [x1, y1] = makeCoords(locationKey1);
    
    locations.forEach(locationKey2 => {
      if (locationKey1 === locationKey2) {
        return;
      }

      const [x2, y2] = makeCoords(locationKey2);
      const [xDiff, yDiff] = distance(x1, y1, x2, y2);

      let i = 1;
      while (true) {
        const [x, y] = [x1 - (xDiff * i), y1 - (yDiff * i)];
        if (x >= bounds.left && x < bounds.right && y >= bounds.top && y < bounds.bottom) {
          antinodes.add(makeKey(x, y));
        } else {
          break;
        }
        i++;
      }
      i = 1;
      while (true) {
        const [x, y] = [x1 + (xDiff * i), y1 + (yDiff * i)];
        if (x >= bounds.left && x < bounds.right && y >= bounds.top && y < bounds.bottom) {
          antinodes.add(makeKey(x, y));
        } else {
          break;
        }
        i++;
      }
    });
  });
});

// for (let y = 0; y < data.length; y++) {
//   let line = '';
//   for (let x = 0; x < data[0].length; x++) {
//     line += antinodes.has(`${x}_${y}`) ? '#' : '.'
//   }
//   console.log(line);
// }
console.log(antinodes.size)
