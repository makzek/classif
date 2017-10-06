
export const DEFAULT_DISMISS_TIMEOUT = 2000;
export const SHORT_DISMISS_TIMEOUT = 1000;
export const LONG_DISMISS_TIMEOUT = 3000;

export interface IMessage {
    type: 'success' | 'info' | 'warning' | 'danger',
    title: string,
    msg: string,
    dismissOnTimeout?: number,
}
