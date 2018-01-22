import { DictionaryDescriptor } from './dictionary-descriptor';
import { IRecordOperationResult } from 'eos-dictionaries/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { CONTACT } from 'eos-rest';

export class ContactDictionaryDescriptor extends DictionaryDescriptor {

    addRecord(contact: any): Promise<any> {
        const _isn = this.apiSrv.sequenceMap.GetTempISN();
        contact['ISN_CONTACT'] = _isn;
        this.apiSrv.entityHelper.prepareAdded<CONTACT>(contact, this.apiInstance);
        // console.log('new contact', contact);
        const changes = this.apiSrv.changeList([contact]);
        // console.log('changes', changes)
        return this.apiSrv.batch(changes, '')
            .then((resp: any[]) => {
                // console.log('response', resp);
                if (resp && resp[0]) {
                    return resp[0].FixedISN;
                } else {
                    return null;
                }
            });
    }

    createContacts(newContacts: any[], orgISN: string): Promise<IRecordOperationResult[]> {
        return this.getData({ criteries: { 'ISN_ORGANIZ': orgISN + '' } })
            .then((contacts) => {
                // const results: IRecordOperationResult[] = [];
                // console.log('organization exist contacts', contacts);
                // console.log('new contacts', newContacts);
                // filter only new contacts
                // const _contacts = [];
                const pContacts = newContacts.map((contact) => {
                    if (contacts.findIndex((existContact) =>
                        existContact['SURNAME'] === contact['SURNAME'] && existContact['DUTY'] === contact['DUTY']) === -1) {
                        return this.addRecord(contact)
                            .then((createdID) => {
                                contact['ISN_CONTACT'] = createdID;
                                return <IRecordOperationResult>{
                                    success: true,
                                    record: contact
                                };
                            })
                            .then((result) => {
                                // handle SEV
                                this.getRelatedSev(result.record).then((/*sevs*/) => { /*console.log('contact sev', sevs)*/ });
                                return result;
                            })
                            .catch((err) => {
                                return <IRecordOperationResult>{
                                    success: false,
                                    record: contact,
                                    error: err
                                };
                            });
                    } else {
                        return Promise.resolve({
                            record: contact,
                            success: false,
                            error: new RestError({
                                isLogicError: true,
                                message: 'Контакт существует'
                            })
                        });
                    }
                });

                return Promise.all(pContacts);
            });
    }
}
