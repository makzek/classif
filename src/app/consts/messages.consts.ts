import { IMessage, DEFAULT_DISMISS_TIMEOUT, LONG_DISMISS_TIMEOUT } from '../../eos-common/core/message.interface';

export const WARN_DESK_EDITING: IMessage = {
    type: 'warning',
    title: 'Ошибка редактирования рабочего стола:',
    msg: 'одновременное редактирование нескольких рабочих столов запрещено',
    dismissOnTimeout: DEFAULT_DISMISS_TIMEOUT
};

export const WARN_DESK_CREATING: IMessage = {
    type: 'warning',
    title: 'Ошибка создания рабочего стола:',
    msg: 'Закончите редактирование рабочего стола',
    dismissOnTimeout: LONG_DISMISS_TIMEOUT
};

export const DANGER_DESK_CREATING: IMessage = {
    type: 'danger',
    title: 'Ошибка создания рабочего стола:',
    msg: 'нельзя создавать рабочие столы с одинаковым именем',
    dismissOnTimeout: LONG_DISMISS_TIMEOUT
};

export const WARN_LINK_PIN: IMessage = {
    type: 'warning',
    title: 'Ошибка добавления ссылки:',
    msg: 'ссылка была прикреплена к этому рабочему столу ранее',
    dismissOnTimeout: LONG_DISMISS_TIMEOUT
};

export const WARN_SEARCH_NOTFOUND: IMessage = {
    type: 'warning',
    title: 'Ничего не найдено: ',
    msg: 'попробуйте изменить поисковую фразу',
    dismissOnTimeout: LONG_DISMISS_TIMEOUT
};

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

export const SESSION_CLOSED: IMessage = {
    type: 'success',
    title: 'Сессия завершена',
    msg: ''
};

export const AUTH_REQUIRED: IMessage = {
    type: 'danger',
    title: 'Ошибка авторизации',
    msg: ''
};

export const NAVIGATE_TO_ELEMENT_WARN: IMessage = {
    title: 'Предупреждение:',
    msg: 'элемента не существует! Возможно он был удален.',
    type: 'warning'
}
