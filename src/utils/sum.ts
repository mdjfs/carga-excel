/* eslint-disable @typescript-eslint/no-explicit-any */
export const sumAll = (arr: any[], sum: (item: any) => number): number => {
    return arr.reduce((acc, item) => acc + sum(item), 0)
}