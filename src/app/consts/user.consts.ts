import { ISettingsItem } from '../core/settings-item.interface';

export const USER_SETTINGS: ISettingsItem[] = [
    {
        name: 'Показывать логически удалённые элементы',
        id: 'showDeleted',
        value: false,
    },
    {
        name: 'Тёмная тема',
        id: 'dark',
        value: true,
    },
];

export const DEFAURT_USER = {
    name: 'Зелибоба',
    secondName: 'Импоссиблович',
    family: 'Безбагов'
};
