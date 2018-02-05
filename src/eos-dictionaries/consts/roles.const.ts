export interface RoleInWorkflow {
    value: number;
    title: string;
    selected?: boolean;
}

export interface Gender {
    id: number;
    title: string;
}

export const ROLES_IN_WORKFLOW: Array<RoleInWorkflow> = [
    {
        value: 0,
        title: 'Не указана',
        selected: true
    },
    {
        value: 1,
        title: 'Начальник'
    },
    {
        value: 0,
        title: 'Секретарь',
    }
];

export const GENDERS: Array<Gender> = [
    { id: null, title: 'Не указан' },
    { id: 0, title: 'Мужской' },
    { id: 1, title: 'Женский' }
];
