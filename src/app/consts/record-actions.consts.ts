import { IAction } from '../core/action.interface';
import { E_RECORD_ACTIONS, E_ACTION_GROUPS } from '../core/record-action';

export const RECORD_ACTIONS: IAction[] = [{
    type: E_RECORD_ACTIONS.add,
    group: E_ACTION_GROUPS.common,
    title: null,
    hint: 'Создать новый',
    iconClass: 'eos-icon eos-icon-plus-blue',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.edit,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Редактировать',
    iconClass: 'eos-icon eos-icon-edit-blue',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.remove,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Удалить',
    iconClass: 'eos-icon eos-icon-close-blue',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.navigateUp,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Следующая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-top',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.navigateDown,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Предыдущая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-bottom',
    buttonClass: null
}];

export const DROPDOWN_RECORD_ACTIONS: IAction[] = [{
    type: E_RECORD_ACTIONS.removeHard,
    group: E_ACTION_GROUPS.group,
    title: 'Удалить (физически)',
    hint: null,
    iconClass: null,
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.showDeleted,
    group: E_ACTION_GROUPS.group,
    title: 'Восстановить логически удаленные элементы',
    hint: null,
    iconClass: null,
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.userOrder,
    group: E_ACTION_GROUPS.group,
    title: 'Включить пользователькую сортировку',
    hint: null,
    iconClass: null,
    buttonClass: null
}, {
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
}, {
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
