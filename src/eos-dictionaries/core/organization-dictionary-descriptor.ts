import { DictionaryDescriptor } from './dictionary-descriptor';
import { IRecordOperationResult } from 'eos-dictionaries/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { CONTACT, ORGANIZ_CL, SEV_ASSOCIATION } from 'eos-rest';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';

export class OrganizationDictionaryDescriptor extends DictionaryDescriptor {

    addContacts(newContacts: any[], orgDUE: string): Promise<IRecordOperationResult[]> {
        return this.apiSrv.read<ORGANIZ_CL>({ ORGANIZ_CL: orgDUE, expand: 'CONTACT_List' })
            .then(([org]) => {
                const results: IRecordOperationResult[] = [];
                if (org) {
                    // console.log('adding contacts to organizaztion', org);
                    this.apiSrv.entityHelper.prepareForEdit(org);
                    const contacts = org.CONTACT_List || [];
                    newContacts.forEach((contact) => {
                        const existContact = contacts.find((exContact) =>
                            exContact['SURNAME'] === contact['SURNAME'] &&
                            exContact['DUTY'] === contact['DUTY'] &&
                            exContact['DEPARTMENT'] === contact['DEPARTMENT']
                        );
                        if (!existContact) {
                            const _isn = this.apiSrv.sequenceMap.GetTempISN();
                            contact['ISN_CONTACT'] = _isn;
                            this.apiSrv.entityHelper.prepareAdded<CONTACT>(contact, 'CONTACT');
                            contacts.push(contact);
                            results.push({
                                success: true,
                                record: contact
                            });
                        } else {
                            contact['ISN_CONTACT'] = existContact['ISN_CONTACT'];
                            results.push({
                                record: contact,
                                success: false,
                                error: new RestError({
                                    isLogicException: true,
                                    message: 'Контакт существует!'
                                })
                            });
                        }
                    });
                    const changes = this.apiSrv.changeList([org]);
                    if (changes) {
                        return this.apiSrv.batch(changes, '')
                            .then((resp) => this.createNewContactsSEV(newContacts, resp))
                            .then((sevResults) => results.concat(sevResults));
                    } else {
                        return results;
                    }
                }
                return results;
            });
    }

    /**
     * мы ориентировались на то что такого класса логику пишем на клиенте.
     * больше чтобы понять как минимизировать АПИ. (c) В. Люкевич
     */
    private createNewContactsSEV(newContacts: any[], createResp: any[]): Promise<IRecordOperationResult[]> {
        console.log('creating sev for contacts', newContacts, createResp);
        createResp.forEach((newIsn) => {
            const contact = newContacts
                .find((_contact) => _contact.SEV && _contact['ISN_CONTACT'] === newIsn.FixedISN);
            if (contact) {
                contact.ISN_CONTACT = newIsn.FixedISN;
            }
        });

        const pReadSev = newContacts.filter((contact) => contact && contact.SEV && contact['ISN_CONTACT'] > 0)
            .map((contact) => {
                console.log('read SEV for contact', contact);
                return this.apiSrv.read<SEV_ASSOCIATION>({
                    SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(contact['ISN_CONTACT'], 'CONTACT')]
                })
                    .then(([sev]) => {
                        const result = {
                            record: contact,
                            exist: false
                        };
                        if (sev) {
                            result.exist = true;
                        }
                        return result;
                    });

            });

        return Promise.all(pReadSev)
            .then((readResults) => {
                const changes = [];
                const results: IRecordOperationResult[] = [];

                readResults.forEach((result) => {
                    if (result.exist) {
                        results.push(<IRecordOperationResult>{
                            record: result.record,
                            success: false,
                            error: new RestError({
                                isLogicException: true,
                                message: 'Индекс СЭВ создан ранее!'
                            })
                        });
                    } else {
                        const sevRec = this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(undefined, 'SEV_ASSOCIATION');
                        sevRec.GLOBAL_ID = result.record['GLOBAL_ID'];
                        if (SevIndexHelper.PrepareForSave(sevRec, result.record)) {
                            changes.push(sevRec);
                        }
                    }
                });

                if (changes.length) {
                    console.log('SEV changes', changes);
                    return this.apiSrv.batch(changes, '')
                        .then(() => results);
                } else {
                    return results;
                }
            });
    }
}
