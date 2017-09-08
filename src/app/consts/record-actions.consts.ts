import { IAction } from '../core/action.interface';
import { E_RECORD_ACTIONS, E_ACTION_GROUPS } from '../core/record-action';

export const RECORD_ACTIONS: IAction[] = [{
    type: E_RECORD_ACTIONS.add,
    group: E_ACTION_GROUPS.common,
    title: '',
    hint: 'Создать новый',
    iconClass: 'eos-icon eos-icon-plus-blue',
    enabled: true
}, {
    type: E_RECORD_ACTIONS.edit,
    group: E_ACTION_GROUPS.item,
    title: '',
    hint: 'Редактировать',
    iconClass: 'eos-icon eos-icon-edit-blue',
    enabled: true
}, {
    type: E_RECORD_ACTIONS.remove,
    group: E_ACTION_GROUPS.group,
    title: '',
    hint: 'Удалить',
    iconClass: 'eos-icon eos-icon-close-blue',
    enabled: true
}, {
    type: E_RECORD_ACTIONS.navigateUp,
    group: E_ACTION_GROUPS.item,
    title: '',
    hint: 'Следующая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-top',
    enabled: true
}, {
    type: E_RECORD_ACTIONS.navigateDown,
    group: E_ACTION_GROUPS.item,
    title: '',
    hint: 'Предыдущая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-bottom',
    enabled: true
}];
