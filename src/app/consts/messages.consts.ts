import { IMessage } from '../core/message.interface';

export const DEFAULT_DISMISS_TIMEOUT = 2000;

export const WARN_DESK_EDITING: IMessage = {
    type: 'warning',
    title: 'Ошибка редактирования рабочего стола:',
    msg: 'одновременное редактирование нескольких рабочих столов запрещено',
    dismissOnTimeout: DEFAULT_DISMISS_TIMEOUT
};

export const WARN_DESK_CREATING: IMessage = {
    type: 'warning',
    title: 'Ошибка создания рабочего стола:',
    msg: 'Закончените редактирование рабочего стола',
    dismissOnTimeout: DEFAULT_DISMISS_TIMEOUT
};
