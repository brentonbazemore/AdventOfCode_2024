import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const ops = ['*', '+'];
const build = (built: string, listLength: number) => {
  if (listLength === 0) {
    return [built];
  }

  const output: string[] = [];
  for (let i = 0; i < ops.length; i++) {
    output.push(...build(`${built}:${ops[i]}`, listLength - 1));
  }

  return output;
};

let sum = 0;
data.forEach((row) => {
  const [rawResult, rest] = row.split(': ');
  const result = +rawResult;
  const factors = rest.split(' ').map(Number);

  const operationOrders = build('', factors.length - 1).map((exp) => exp.substring(1).split(':'));
  const valid = operationOrders.some((operationOrder) => {
    const copy = [...factors];
    let value = copy.shift();
    operationOrder.forEach((operation) => {
      const operand = copy.shift();
      value = eval(`${value}${operation}${operand}`);
    });

    return value === result;
  });

  if (valid) {
    sum += result;
  }
});
console.log(sum);
