import { IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const STATUS_EXEC_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'status-exec',
    apiInstance: 'STATUS_EXEC_CL',
    title: 'Состояния исполнения (Контролера)',
});
