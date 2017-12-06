import { IAction } from '../core/action.interface';
import { E_RECORD_ACTIONS, E_ACTION_GROUPS } from '../core/record-action';

export const RECORD_ACTIONS_EDIT = {
    type: E_RECORD_ACTIONS.edit,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Редактировать',
    iconClass: 'eos-icon eos-icon-edit-blue small',
    hoverIconClass: 'eos-icon eos-icon-edit-dark-blue small',
    activeIconClass: null,
    buttonClass: null
};

export const RECORD_ACTIONS_NAVIGATION_UP = {
    type: E_RECORD_ACTIONS.navigateUp,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Предыдущая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-top small',
    buttonClass: null
};

export const RECORD_ACTIONS_NAVIGATION_DOWN = {
    type: E_RECORD_ACTIONS.navigateDown,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Следующая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-bottom small',
    buttonClass: null
};

export const RECORD_ACTIONS: IAction[] = [{
    type: E_RECORD_ACTIONS.add,
    group: E_ACTION_GROUPS.common,
    title: null,
    hint: 'Создать новый',
    iconClass: 'eos-icon eos-icon-plus-blue small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-plus-dark-blue small',
    buttonClass: null
},
    RECORD_ACTIONS_EDIT,
{
    type: E_RECORD_ACTIONS.remove,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Удалить логически',
    iconClass: 'eos-icon eos-icon-bin-blue small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-bin-dark-blue small',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.showDeleted,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Отображать логически удалённые',
    iconClass: 'eos-icon eos-icon-show-blue small',
    activeIconClass: 'eos-icon eos-icon-show-white small',
    hoverIconClass: '',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.userOrder,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Пользовательская сортировка',
    iconClass: 'eos-icon eos-icon-custom-list-blue small',
    activeIconClass: 'eos-icon eos-icon-custom-list-white small',
    hoverIconClass: 'eos-icon eos-icon-custom-list-white small',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.moveUp,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Вверх',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-top small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-arrow-v-dark-blue-top small',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.moveDown,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Вниз',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-bottom small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-arrow-v-dark-blue-bottom small',
    buttonClass: null
},
   /* RECORD_ACTIONS_NAVIGATION_UP,
RECORD_ACTIONS_NAVIGATION_DOWN*/ ];

export const MORE_RECORD_ACTIONS: IAction[] = [{
    type: E_RECORD_ACTIONS.restore,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Восстановить логически удаленные элементы',
    iconClass: 'eos-icon eos-icon-repair-blue small',
    activeIconClass: '',
    hoverIconClass: 'eos-icon eos-icon-repair-dark-blue small',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.removeHard,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Удалить (физически)',
    iconClass: 'eos-icon eos-icon-bin-forever-blue small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-bin-forever-dark-blue small',
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.createRepresentative,
    group: E_ACTION_GROUPS.group,
    title: null,
    hint: 'Создать представителя организации',
    iconClass: 'eos-icon eos-icon-avatar-blue small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-avatar-dark-blue small',
    buttonClass: null
}];

export const DROPDOWN_RECORD_ACTIONS: IAction[] = [{
    type: E_RECORD_ACTIONS.removeHard,
    group: E_ACTION_GROUPS.group,
    title: 'Удалить (физически)',
    hint: null,
    iconClass: null,
    activeIconClass: null,
    hoverIconClass: null,
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.restore,
    group: E_ACTION_GROUPS.group,
    title: 'Восстановить логически удаленные элементы',
    hint: null,
    iconClass: null,
    activeIconClass: null,
    hoverIconClass: null,
    buttonClass: null
}, {
    type: E_RECORD_ACTIONS.add,
    group: E_ACTION_GROUPS.common,
    title: 'Добавить элемент',
    hint: null,
    iconClass: null,
    activeIconClass: null,
    hoverIconClass: null,
    buttonClass: 'hidden-lg'
}, {
    type: E_RECORD_ACTIONS.remove,
    group: E_ACTION_GROUPS.group,
    title: 'Удалить элемент',
    hint: null,
    iconClass: null,
    activeIconClass: null,
    hoverIconClass: null,
    buttonClass: 'hidden-lg'
}, {
    type: E_RECORD_ACTIONS.edit,
    group: E_ACTION_GROUPS.item,
    title: 'Редактировать элемент',
    hint: null,
    iconClass: null,
    activeIconClass: null,
    hoverIconClass: null,
    buttonClass: 'hidden-lg'
}, {
    type: E_RECORD_ACTIONS.navigateUp,
    group: E_ACTION_GROUPS.item,
    title: 'Выбрать предыдущий',
    hint: null,
    iconClass: null,
    activeIconClass: null,
    hoverIconClass: null,
    buttonClass: 'hidden-lg'
}, {
    type: E_RECORD_ACTIONS.navigateDown,
    group: E_ACTION_GROUPS.item,
    title: 'Выбрать следующий',
    hint: null,
    iconClass: null,
    activeIconClass: null,
    hoverIconClass: null,
    buttonClass: 'hidden-lg'
}];
