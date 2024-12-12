import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const popSet = (set: Set<any>) => {
  for (const value of set) {
    set.delete(value);
    return value;
  }
};

const candidates = new Set<string>();
for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[0].length; x++) {
    candidates.add(`${x}_${y}`);
  }
}

const fill = (x: number, y: number, id: string, filled: Set<string>) => {
  if (data[y]?.[x] !== id) {
    return [];
  }

  if (filled.has(`${x}_${y}`)) {
    return [];
  }

  const found: string[] = [`${x}_${y}`];
  filled.add(`${x}_${y}`);
  found.push(...fill(x + 1, y, id, filled));
  found.push(...fill(x - 1, y, id, filled));
  found.push(...fill(x, y + 1, id, filled));
  found.push(...fill(x, y - 1, id, filled));

  return found;
}

let sum = 0;
while (candidates.size > 0) {
  const [x, y] = popSet(candidates).split('_').map(Number);
  const id = data[y][x];

  const plants = new Set(fill(x, y, id, new Set<string>()));
  const area = plants.size;
  let perimeter = 0;
  plants.forEach(plant => {
    candidates.delete(plant);
    const [plantX, plantY] = plant.split('_').map(Number);
    
    if (!plants.has(`${plantX + 1}_${plantY}`)) {
      perimeter++;
    }
    if (!plants.has(`${plantX - 1}_${plantY}`)) {
      perimeter++;
    }
    if (!plants.has(`${plantX}_${plantY + 1}`)) {
      perimeter++;
    }
    if (!plants.has(`${plantX}_${plantY - 1}`)) {
      perimeter++;
    }
  });

  sum += area * perimeter;
}

console.log(sum);