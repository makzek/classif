export enum SEARCH_MODES {
    totalDictionary,
    onlyCurrentBranch,
    currentAndSubbranch
}

export interface ISearchSettings {
    mode: SEARCH_MODES;
    deleted: boolean;
}
