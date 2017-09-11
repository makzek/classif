import { _T } from '../core/consts';

export class TypeExt {
	// tslint:disable:indent
	static mergeMetadata(_metadata: any) {
		_metadata.RUBRIC_CL = {
			pk: 'DUE',
			properties: {
				DUE: _T.s, ISN_NODE: _T.i, CLASSIF_NAME: _T.s, ISN_HIGH_NODE: _T.i, DELETED: _T.i, IS_NODE: _T.i, RUBRIC_CODE: _T.s,
				CODE: _T.s,
				INS_DATE: _T.d,
				UPD_DATE: _T.d,
				INS_WHO: _T.i,
				UPD_WHO: _T.i
			},
			readonly: [
				'INS_DATE',
				'UPD_DATE',
				'INS_WHO',
				'UPD_WHO'
			],
			relations: []
		}
	}
}

