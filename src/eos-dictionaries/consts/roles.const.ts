export interface RoleInWorkflow {
    value: number;
    title: string;
    disable?: boolean;
}

export interface Gender {
    id: number;
    title: string;
}

export const ROLES_IN_WORKFLOW: Array<RoleInWorkflow> = [
    {
        value: 0,
        title: 'Роль',
        disable: true
    },
    {
        value: 1,
        title: 'Начальник'
    }
];

export const GENDERS: Array<Gender> = [
    { id: null, title: 'Не указан' },
    { id: 0, title: 'Мужской' },
    { id: 1, title: 'Женский' }
];
