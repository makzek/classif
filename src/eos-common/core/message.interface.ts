export interface IMessage {
    type: 'success' | 'info' | 'warning' | 'danger',
    title: string,
    msg: string,
    dismissOnTimeout?: number,
}
