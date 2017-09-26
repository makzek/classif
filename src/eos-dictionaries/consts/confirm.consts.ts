import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';

export const CONFIRM_SAVE_ON_LEAVE: IConfirmWindow = {
    title: 'Имеются не сохранённые изменения!',
    body: 'Внесенные изменения могут быть потеряны',
    okTitle: 'Сохранить и закрыть',
    cancelTitle: 'Закрыть без сохранения'
};
