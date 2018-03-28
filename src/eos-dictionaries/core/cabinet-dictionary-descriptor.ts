import { DictionaryDescriptor } from './dictionary-descriptor';
import { CABINET, USER_CABINET, DEPARTMENT, USER_CL, FOLDER } from 'eos-rest';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { IRecordOperationResult, IDictionaryDescriptor } from '../interfaces';
import { RecordDescriptor } from './record-descriptor';
import { EosUtils } from 'eos-common/core/utils';
import { CABINET_FOLDERS } from '../consts/dictionaries/cabinet.consts';

export class CabinetRecordDescriptor extends RecordDescriptor {
    getNewRecord(preSetData: any) {
        const rec = super.getNewRecord(preSetData);
        EosUtils.setValueByPath(rec, 'cabinetAccess', []);
        EosUtils.setValueByPath(rec, 'users', []);
        EosUtils.setValueByPath(rec, 'rec.FOLDER_List', CABINET_FOLDERS.map((fConst) => ({ FOLDER_KIND: fConst.key, USER_COUNT: 0 })));
        return rec;
    }
}

export class CabinetDictionaryDescriptor extends DictionaryDescriptor {

    addRecord(data: any, _useless: any, isProtected = false, isDeleted = false): Promise<any> {

        this.apiSrv.entityHelper.prepareAdded<CABINET>(data.rec, this.apiInstance);
        data.rec.ISN_CABINET = this.apiSrv.sequenceMap.GetTempISN();
        data.rec['FOLDER_List'].forEach((folder, idx) => {
            folder.ISN_FOLDER = this.apiSrv.sequenceMap.GetTempISN();
            folder.ISN_CABINET = data.rec.ISN_CABINET;
            this.apiSrv.entityHelper.prepareAdded<FOLDER>(folder, 'FOLDER');
        });
        console.log('create cabinet data', data);
        const changes = this.apiSrv.changeList([data.rec]);
        console.log('changes', changes);
        return this.apiSrv.batch(changes, '')
            .then(([resp]: any[]) => {
                if (resp) {
                    return resp.ID;
                } else {
                    return null;
                }
            });
    }

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
        Object.keys(updates).forEach((key) => {
            switch (key) {
                case 'owners':
                    updates[key].forEach((folder, idx) => {
                        changeData.push(EosUtils.deepUpdate(originalData[key][idx], updates[key][idx]));
                    });
                    break;
                case 'rec':
                    changeData.push(EosUtils.deepUpdate(originalData[key], updates[key]));
                    break;
                default: // do nothing
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

    protected _initRecord(data: IDictionaryDescriptor) {
        this.record = new CabinetRecordDescriptor(this, data);
    }
}
