export interface PaginationConfig {
    last: number;
    current: number;
    pages: Array<number>;
}

export interface IListPage {
    start: number;
    current: number;
    length: number;
};

export interface IPageLength {
    title: string;
    value: number;
}

export const PAGES: IPageLength[] = [{
    title: '5',
    value: 5
},
{
    title: '10',
    value: 10
}, {
    title: '20',
    value: 20
}, {
    title: '40',
    value: 30
}, {
    title: '100',
    value: 100
}, {
    title: '200',
    value: 200
}]
