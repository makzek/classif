import { IMessage, DEFAULT_DISMISS_TIMEOUT, DANGER_DISMISS_TIMEOUT } from '../../eos-common/core/message.interface';

export const WARN_EDIT_ERROR: IMessage = {
    type: 'warning',
    title: 'Предупреждение: ',
    msg: 'не выбран элемент для редактирования'
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

export const DANGER_LOGICALY_RESTORE_ELEMENT: IMessage = {
    type: 'danger',
    title: 'Ошибка логического восстановления элемента: ',
    msg: 'нельзя логически восстановить подэлемент логически удаленного элемента'
};

export const WARN_SEARCH_NOTFOUND: IMessage = {
    type: 'warning',
    title: 'Ничего не найдено: ',
    msg: 'попробуйте изменить поисковую фразу'
};

export const DANGER_NAVIGATE_TO_DELETED_ERROR: IMessage = {
    type: 'danger',
    title: 'Ошибка редактирования элемента: ',
    /* tslint:disable:max-line-length */
    msg: 'больше нет не удалённых элементов. Включите просмотр логически удалённых элементов, чтобы просмотреть, или востановите удалённых элементы, чтобы отредактировать'
    /* tslint:enable:max-line-length */
};

export const DANGER_HAVE_NO_ELEMENTS: IMessage = {
    type: 'warning',
    title: 'Элементы не выбраны!',
    msg: 'Удалять нечего.'
}

export const INFO_NOTHING_CHANGES: IMessage = {
    type: 'info',
    title: 'Информация о сохранении изменений: ',
    msg: 'текущие изменения совпадают с изначальным значением. Изменения не будут сохранены'
};

export const SUCCESS_SAVE: IMessage = {
    type: 'success',
    title: 'Изменения сохранены',
    msg: ''
}

export const WARN_SAVE_FAILED: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'изменения не сохранены!'
}

export const WARN_LOGIC_DELETE: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'отмеченные элементы уже были логически удалены!'
}
