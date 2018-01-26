import { DictionaryDescriptor } from './dictionary-descriptor';
import { IRecordOperationResult } from 'eos-dictionaries/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { CONTACT, ORGANIZ_CL/*, SEV_ASSOCIATION */ } from 'eos-rest';
// import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';

export class OrganizationDictionaryDescriptor extends DictionaryDescriptor {

    addContacts(newContacts: any[], orgDUE: string): Promise<IRecordOperationResult[]> {
        return this.apiSrv.read<ORGANIZ_CL>({ ORGANIZ_CL: orgDUE, expand: 'CONTACT_List' })
            .then(([org]) => {
                const results: IRecordOperationResult[] = [];
                if (org) {
                    console.log(org.CONTACT_List);
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
                            console.log('exist contact', existContact);
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
                            .then((resp) => {
                                console.log(resp);
                                /*
                                newContacts.filter((contact) => contact && contact.SEV)
                                    .map((contact) => {
                                        return this.apiSrv.read<SEV_ASSOCIATION>({
                                            SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(contact['ISN_CONTACT'], 'CONTACT')]
                                        })
                                            .then((sev) => this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(sev[0], 'SEV_ASSOCIATION'));
                                    });
                                    */
                                return results;
                            });
                    } else {
                        return results;
                    }
                }
                return (results);
            });
    }
}
