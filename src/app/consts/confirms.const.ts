import { IConfirmWindow } from '../core/confirm-window.interface';

export const CONFIRM_DESK_DELETE: IConfirmWindow = {
    title: 'Удалить?',
    body: 'Вы действительно хотите удалить рабочий стол "{{name}}"?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_LINK_DELETE: IConfirmWindow = {
    title: 'Удалить?',
    body: 'Вы действительно хотите удалить ссылку "{{link}}"?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};
