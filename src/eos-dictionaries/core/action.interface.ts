import { E_RECORD_ACTIONS, E_ACTION_GROUPS } from '../core/record-action';

export interface IAction {
    type: E_RECORD_ACTIONS
    group: E_ACTION_GROUPS
    title: string
    hint: string
    iconClass: string
    buttonClass: string
};

export interface IActionButton extends IAction {
    isActive: boolean;
    enabled: boolean;
}
