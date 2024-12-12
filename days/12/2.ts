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
  const bound = { top: Infinity, right: -Infinity, bottom: -Infinity, left: Infinity };
  plants.forEach(plant => {
    candidates.delete(plant);
    const [plantX, plantY] = plant.split('_').map(Number);

    if (plantX <= bound.left) {
      bound.left = plantX;
    }
    if (plantX >= bound.right) {
      bound.right = plantX;
    }
    if (plantY <= bound.top) {
      bound.top = plantY;
    }
    if (plantY >= bound.bottom) {
      bound.bottom = plantY;
    }
  });

  let sides = 0;
  for (let i = 0; i < (bound.bottom - bound.top) + 2; i++) {
    let focusPoint = [bound.left, bound.top + i];
    let prev = 'false,false';
    while (true) {
      if (focusPoint[0] > bound.right) {
        break;
      }
      const [focusX, focusY] = focusPoint;
      const [top, bottom] = [plants.has(`${focusX}_${focusY - 1}`), plants.has(`${focusX}_${focusY}`)];
      if (top != bottom && [top, bottom].join() !== prev) {
        sides++;
      }
      prev = [top, bottom].join();
  
      focusPoint = [focusX + 1, focusY];
    }
  }

  for (let i = 0; i < (bound.right - bound.left) + 2; i++) {
    let focusPoint = [bound.left + i, bound.top];
    let prev = 'false,false';
    while (true) {
      if (focusPoint[1] > bound.bottom) {
        break;
      }
      const [focusX, focusY] = focusPoint;
      const [left, right] = [plants.has(`${focusX - 1}_${focusY}`), plants.has(`${focusX}_${focusY}`)];
      if (left != right && [left, right].join() !== prev) {
        sides++;
      }
      prev = [left, right].join();
  
      focusPoint = [focusX, focusY + 1];
    }
  }

  sum += area * sides;
}

console.log(sum);