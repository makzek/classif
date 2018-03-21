import { DictionaryDescriptor } from './dictionary-descriptor';
import { CABINET, USER_CABINET, DEPARTMENT, USER_CL } from 'eos-rest';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { IRecordOperationResult } from '../interfaces';

export class CabinetDictionaryDescriptor extends DictionaryDescriptor {
    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

        // console.warn('getData', query, order, limit);

        const req = { [this.apiInstance]: query };

        if (limit) {
            req.top = limit;
        }

        if (order) {
            req.orderby = order;
        }

        req.expand = 'FOLDER_List';

        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                this.prepareForEdit(data);
                data.forEach((rec) => {
                    this.prepareForEdit(rec.FOLDER_List);
                });
                const dues = [];
                data.forEach((rec) => {
                    if (dues.findIndex((due) => due === rec.DUE) < 0) {
                        dues.push(rec.DUE);
                    }
                });
                if (dues.length) {
                    return this.apiSrv.read({ 'DEPARTMENT': dues })
                        .then((departments) => {
                            data.forEach((rec) => {
                                const dept = departments.find((d) => d['DUE'] === rec.DUE);
                                if (dept) {
                                    rec['DEPARTMENT_NAME'] = dept['CLASSIF_NAME'];
                                } else {
                                    rec['DEPARTMENT_NAME'] = '';
                                }
                            });
                            return data;
                        });
                } else {
                    return data;
                }
            });
    }

    getRelated(rec: CABINET): Promise<any> {
        const reqs = [
            this.apiSrv.read({ 'FOLDER': PipRX.criteries({ 'ISN_CABINET': rec.ISN_CABINET + '' }) }),
            this.apiSrv.read({ 'DEPARTMENT': [rec.DUE] })
                .then(([department]: DEPARTMENT[]) => {
                    return this.getOwners(department.DUE)
                        .then((owners) => [department, owners]);
                }),
            this.apiSrv.read({ 'USER_CABINET': PipRX.criteries({ 'ISN_CABINET': rec.ISN_CABINET + '' }) })
                .then((userCabinet: USER_CABINET[]) => {
                    this.prepareForEdit(userCabinet);
                    const userIds = userCabinet.map((u2c) => u2c.ISN_LCLASSIF);
                    return this.apiSrv.read<USER_CL>({ 'USER_CL': userIds })
                        .then((users) => [userCabinet, users]);
                }),
            //            this.apiSrv.read<DEPARTMENT>({ 'DEPARTMENT': PipRX.criteries({ 'ISN_CABINET': rec.ISN_CABINET + '' }) })
        ];
        return Promise.all(reqs)
            .then(([folders, [department, owners], [userCabinet, users]/*, owners*/]) => {
                //                this.prepareForEdit(owners);
                this.prepareForEdit(folders);
                const related = {
                    department: department,
                    folders: folders,
                    cabinetAccess: userCabinet,
                    users: users,
                    owners: owners
                };
                // console.log('cabinet related', related);
                return related;
            });
    }

    updateRecord(originalData: any, updates: any): Promise<IRecordOperationResult[]> {
        const changeData = [];
        const results: IRecordOperationResult[] = [];
        Object.keys(originalData).forEach((key) => {
            if (originalData[key]) {
                switch (key) {
                    case 'folders':
                    case 'owners':
                        originalData[key].forEach((folder, idx) => {
                            changeData.push(Object.assign({}, originalData[key][idx], updates[key][idx]));
                        });
                        break;
                    case 'rec':
                        changeData.push(Object.assign({}, originalData[key], updates[key]));
                        break;
                    default: // do nothing

                }
            }
        });
        const changes = this.apiSrv.changeList(changeData);
        if (changes && changes.length) {
            return this.apiSrv.batch(changes, '')
                .then(() => {
                    results.push({ success: true, record: Object.assign({}, originalData.rec, updates.rec) });
                    return results;
                });
        } else {
            return Promise.resolve(results);
        }
    }

    getOwners(depDue: string): Promise<DEPARTMENT[]> {
        return this.apiSrv.read<DEPARTMENT>({ 'DEPARTMENT': PipRX.criteries({ 'IS_NODE': '1', DEPARTMENT_DUE: depDue }) })
            .then((owners) => {
                this.prepareForEdit(owners);
                return owners;
            });
    }
}
