import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const [rawRules, rawPages] = rawData.split('\n\n');

const pages = rawPages.split('\n').map(rawPage => rawPage.split(',').map(Number));
const rules = rawRules.split('\n').map(rawRule => rawRule.split('|').map(Number));

const incorrectOrders: number[][] = [];
const doSort = (pageList: number[], validRules: [number, number][]) => {
    const sorted = pageList.toSorted((a, b) => {
        for (let k = 0; k < validRules.length; k++) {
            const [pre, post] = validRules[k];
            if (a === pre && b === post) {
                return -1;
            }

            if (a === post && b === pre) {
                return 1
            }
        }

        return 0;
    });
    incorrectOrders.push(sorted);
}


pageLoop:
for (let i = 0; i < pages.length; i++) {
    const pageList = pages[i];

    const pageLookup = new Map<number, number>();
    pageList.forEach((page, i) => {
        pageLookup.set(page, i);
    });

    const validRules: [number, number][] = [];
    for (let j = 0; j < rules.length; j++) {
        if (pageLookup.has(rules[j][0]) && pageLookup.has(rules[j][1])) {
            validRules.push(rules[j] as [number, number]);
        }
    }

    for (let j = 0; j < validRules.length; j++) {
        const [pre, post] = validRules[j];
        if (pageLookup.get(pre)! >= pageLookup.get(post)!) {
            doSort(pageList, validRules);
            continue pageLoop;
        }
    }
}
let sum = 0;
incorrectOrders.forEach(list => {
    sum += list[Math.floor(list.length / 2)]
})
console.log(sum);