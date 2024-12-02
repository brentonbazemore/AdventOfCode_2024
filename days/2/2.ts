import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const reports = data.map(row => row.split(' ').map(Number));

const assertDec = (row: number[]) => {
    for (let i = 1; i < row.length; i++) {
        if (row[i - 1] <= row[i]) {
            return false;
        }
    }

    return true;
}

const assertAsc = (row: number[]) => {
    for (let i = 1; i < row.length; i++) {
        if (row[i - 1] >= row[i]) {
            return false;
        }
    }

    return true;
}

const assertRange = (row: number[]) => {
    for (let i = 1; i < row.length; i++) {
        const diff = Math.abs(row[i - 1] - row[i]);
        if (diff > 3 || diff < 1) {
            return false;
        }
    }

    return true;
}


let count = 0;
const check = (report) => {
    return (assertAsc(report) || assertDec(report)) && assertRange(report);
}

reports.forEach(report => {
    if (check(report)) {
        count += 1;
        return;
    }

    for (let i = 0; i < report.length; i++) {
        if (check(report.toSpliced(i, 1))) {
            count += 1;
            return;
        }
    }
});
console.log(count);