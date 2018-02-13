import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';

export const CONFIRM_DESK_DELETE: IConfirmWindow = {
    title: 'Подтверждение удаления',
    body: 'Вы действительно хотите удалить рабочий стол "{{name}}"?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_LINK_DELETE: IConfirmWindow = {
    title: 'Подтверждение удаления',
    body: 'Вы действительно хотите удалить ссылку "{{link}}"?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_NODE_DELETE: IConfirmWindow = {
    title: 'Подтверждение удаления',
    body: 'Вы действительно хотите удалить запись {{name}} ?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_NODES_DELETE: IConfirmWindow = {
    title: 'Подтверждение удаления',
    body: 'Вы действительно хотите удалить записи {{name}} ?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_SUBNODES_RESTORE: IConfirmWindow = {
    title: 'Подтверждение восстановления',
    body: 'Восстановить дочерние элементы для {{name}}',
    okTitle: 'Восстановить дочерние',
    cancelTitle: 'Не восстанавливать дочерние'
};
