export interface PaginationConfig {
    start: number;
    length: number;
    current: number;
    pageCount: number;
    pages: Array<number>;
}

export interface IPageLength {
    title: string;
    value: number;
}

export const PAGES: IPageLength[] = [
{
    title: '10',
    value: 10
}, {
    title: '20',
    value: 20
}, {
    title: '40',
    value: 40
}, {
    title: '100',
    value: 100
}, {
    title: '200',
    value: 200
}]
