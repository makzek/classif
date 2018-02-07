import { DictionaryDescriptor } from './dictionary-descriptor';
import { CABINET, USER_CABINET, DEPARTMENT, USER_CL } from 'eos-rest';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';

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
                                    rec['DEPARTMENT_Ref'] = dept;
                                } else {
                                    rec['DEPARTMENT_NAME'] = '';
                                    rec['DEPARTMENT_Ref'] = {};
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
            this.apiSrv.read({ 'DEPARTMENT': [rec.DUE] }),
            // this.apiSrv.read({ 'FOLDER': PipRX.criteries({ 'ISN_CABINET': rec.ISN_CABINET + '' }) }),
            this.apiSrv.read<USER_CABINET>({ 'USER_CABINET': PipRX.criteries({ 'ISN_CABINET': rec.ISN_CABINET + '' }) })
                .then((userCabinet) => {
                    const userIds = userCabinet.map((u2c) => u2c.ISN_LCLASSIF);
                    return this.apiSrv.read<USER_CL>({ 'USER_CL': userIds, expand: 'UFOLDER_List' })
                        .then((users) => [userCabinet, users]);
                }),
            this.apiSrv.read<DEPARTMENT>({ 'DEPARTMENT': PipRX.criteries({ 'ISN_CABINET': rec.ISN_CABINET + '' }) }),
        ];
        return Promise.all(reqs)
            .then(([[department], [userCabinet, users], owners]) => {
                const related = {
                    department: department,
                    // folders: folders,
                    cabinetAccess: userCabinet,
                    users: users,
                    owners: owners
                };
                // console.log('cabinet related', related);
                return related;
            });
    }
}
