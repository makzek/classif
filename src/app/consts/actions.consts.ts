import { IAction } from '../core/action.interface';
import { E_RECORD_ACTIONS, E_ACTION_GROUPS } from '../core/record-action';

export const ACTION_ADD: IAction = {
    type: E_RECORD_ACTIONS.add,
    group: E_ACTION_GROUPS.common,
    title: '',
    hint: 'Создать новый',
    iconClass: 'glyphicon glyphicon-plus',
    enabled: true
};

export const ACTION_EDIT: IAction = {
    type: E_RECORD_ACTIONS.edit,
    group: E_ACTION_GROUPS.item,
    title: '',
    hint: 'Редактировать',
    iconClass: 'glyphicon glyphicon-pencil',
    enabled: true
};

export const ACTION_REMOVE: IAction = {
    type: E_RECORD_ACTIONS.remove,
    group: E_ACTION_GROUPS.group,
    title: '',
    hint: 'Удалить',
    iconClass: 'glyphicon glyphicon-remove',
    enabled: true
};

export const ACTION_UP: IAction = {
    type: E_RECORD_ACTIONS.navigateUp,
    group: E_ACTION_GROUPS.item,
    title: '',
    hint: 'Следующая',
    iconClass: 'glyphicon glyphicon-chevron-up',
    enabled: true
};

export const ACTION_DOWN: IAction = {
    type: E_RECORD_ACTIONS.navigateDown,
    group: E_ACTION_GROUPS.item,
    title: '',
    hint: 'Предыдущая',
    iconClass: 'glyphicon glyphicon-chevron-down',
    enabled: true
};

