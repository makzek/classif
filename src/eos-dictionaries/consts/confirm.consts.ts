import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';

export const CONFIRM_SAVE_ON_LEAVE: IConfirmWindow = {
    title: 'Имеются несохранённые изменения',
    body: 'Внесённые изменения могут быть потеряны.',
    okTitle: 'Сохранить и закрыть',
    cancelTitle: 'Закрыть без сохранения'
};

export const CONFIRM_CHANGE_BOSS: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'Начальником подразделения уже является {{persone}}, изменить на {{newPersone}}?',
    okTitle: 'Заменить',
    cancelTitle: 'Отмена'
};
