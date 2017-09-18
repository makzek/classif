import { IMessage } from '../../app/core/message.interface';

export const DEFAULT_DISMISS_TIMEOUT = 1000;
export const LONG_DISMISS_TIMEOUT = 2000;

export const WARN_EDIT_ERROR: IMessage = {
    type: 'warning',
    title: 'Ошибка редактирования: ',
    msg: 'не выбран элемент для редактирования',
    dismissOnTimeout: LONG_DISMISS_TIMEOUT
};

export const DANGER_EDIT_ROOT_ERROR: IMessage = {
    type: 'danger',
    title: 'Ошибка редактирования элемента: ',
    msg: 'вы пытаетесь отредактировать корень (или другой элемент без id). Корень нельзя редактировать'
};

export const DANGER_EDIT_DELETED_ERROR: IMessage = {
    type: 'danger',
    title: 'Ошибка редактирования элемента: ',
    msg: 'удалённые элементы нельзя редактировать'
};

export const DANGER_DELETE_ELEMENT: IMessage = {
    type: 'danger',
    title: 'Ошибка удаления элемента: ',
    msg: 'на этот объект ссылаются другие объекты системы'
};

export const WARN_SEARCH_NOTFOUND: IMessage = {
    type: 'warning',
    title: 'Ничего не найдено: ',
    msg: 'попробуйте изменить поисковую фразу',
    dismissOnTimeout: LONG_DISMISS_TIMEOUT
};
