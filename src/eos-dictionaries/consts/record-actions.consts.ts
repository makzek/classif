import { IAction } from '../core/action.interface';
import { E_RECORD_ACTIONS, E_ACTION_GROUPS } from '../core/record-action';

export const RECORD_ACTIONS_EDIT = {
    type: E_RECORD_ACTIONS.edit,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Редактировать',
    iconClass: 'eos-icon eos-icon-edit-blue small',
    buttonClass: null
};

export const RECORD_ACTIONS_NAVIGATION_UP = {
    type: E_RECORD_ACTIONS.navigateUp,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Следующая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-top small',
    buttonClass: null
};

export const RECORD_ACTIONS_NAVIGATION_DOWN = {
    type: E_RECORD_ACTIONS.navigateDown,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Предыдущая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-bottom small',
    buttonClass: null
};

export const RECORD_ACTIONS: IAction[] = [{
    type: E_RECORD_ACTIONS.add,
    group: E_ACTION_GROUPS.common,
    title: null,
    hint: 'Создать новый',
    iconClass: 'eos-icon eos-icon-plus-blue small',
    buttonClass: null
},
    RECORD_ACTIONS_EDIT,
{
    type: E_RECORD_ACTIONS.remove,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Удалить логически',
    iconClass: 'eos-icon eos-icon-bin-blue small',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.moveUp,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Вверх',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-top small',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.moveDown,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Вниз',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-bottom small',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.userOrder,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Включить пользователькую сортировку',
    iconClass: 'fa fa-list',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.showDeleted,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Отображать логически удалённые',
    iconClass: 'eos-icon eos-icon-show-blue small',
    buttonClass: null
}
   /* RECORD_ACTIONS_NAVIGATION_UP,
RECORD_ACTIONS_NAVIGATION_DOWN*/ ];

export const DROPDOWN_RECORD_ACTIONS: IAction[] = [{
    type: E_RECORD_ACTIONS.removeHard,
    group: E_ACTION_GROUPS.group,
    title: 'Удалить (физически)',
    hint: null,
    iconClass: null,
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.restore,
    group: E_ACTION_GROUPS.group,
    title: 'Восстановить логически удаленные элементы',
    hint: null,
    iconClass: null,
    buttonClass: null
}, /* {
    type: E_RECORD_ACTIONS.userOrder,
    group: E_ACTION_GROUPS.group,
    title: 'Включить пользователькую сортировку',
    hint: null,
    iconClass: null,
    buttonClass: null
},  {
    type: E_RECORD_ACTIONS.moveUp,
    group: E_ACTION_GROUPS.item,
    title: 'Вверх',
    hint: null,
    iconClass: null,
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.moveDown,
    group: E_ACTION_GROUPS.item,
    title: 'Вниз',
    hint: null,
    iconClass: null,
    buttonClass: null
},*/ {
    type: E_RECORD_ACTIONS.add,
    group: E_ACTION_GROUPS.common,
    title: 'Добавить элемент',
    hint: null,
    iconClass: null,
    buttonClass: 'hidden-lg'
}, {
    type: E_RECORD_ACTIONS.remove,
    group: E_ACTION_GROUPS.group,
    title: 'Удалить элемент',
    hint: null,
    iconClass: null,
    buttonClass: 'hidden-lg'
}, {
    type: E_RECORD_ACTIONS.edit,
    group: E_ACTION_GROUPS.item,
    title: 'Редактировать элемент',
    hint: null,
    iconClass: null,
    buttonClass: 'hidden-lg'
}, {
    type: E_RECORD_ACTIONS.navigateUp,
    group: E_ACTION_GROUPS.item,
    title: 'Выбрать предыдущий',
    hint: null,
    iconClass: null,
    buttonClass: 'hidden-lg'
}, {
    type: E_RECORD_ACTIONS.navigateDown,
    group: E_ACTION_GROUPS.item,
    title: 'Выбрать следующий',
    hint: null,
    iconClass: null,
    buttonClass: 'hidden-lg'
}];
