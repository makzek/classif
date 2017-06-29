import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EosDictionaryNode } from '../core/eos-dictionary-node';

/* tslint:disable:max-line-length */
const mockRubrics: any[] = [
  { id: 1, code: '1', title: 'Общая тематика', parentId: null, isNode: true, isDeleted: false, description: 'description', hasSubnodes: true },
  { id: 2, code: '1.1', title: 'Вопросы промышленности', parentId: 1, isNode: true, isDeleted: false, description: 'description', hasSubnodes: false },
  { id: 3, code: '1.2', title: 'Вопросы сельского хозяйства', parentId: 1, isNode: false, isDeleted: false, description: 'description', hasSubnodes: false },
  { id: 4, code: '1.3', title: 'Вопросы экологии', parentId: 1, isNode: false, isDeleted: false, description: 'description', hasSubnodes: false },
  { id: 5, code: '1.4', title: 'Вопросы строительства', parentId: 1, isNode: false, isDeleted: false, description: 'description', hasSubnodes: false },
  { id: 6, code: '2', title: 'Обращения граждан', parentId: null, isNode: true, isDeleted: false, description: 'description', hasSubnodes: false },
  { id: 7, code: '3', title: 'Финансы', parentId: null, isNode: false, isDeleted: false, description: 'description', hasSubnodes: false },
];
/* tslint:enable:max-line-length */

const mockRubricsMap = new Map<number, EosDictionaryNode>(
    mockRubrics.map((rubric) => [rubric.id, rubric] as [number, EosDictionaryNode])
);

@Injectable()
export class EosApiService {
    getDictionary(dictId: string) {
    }

    /* Return promise with dictionary node data */
    getDictionaryNode(dictionaryId: string, id: number): Promise<EosDictionaryNode> {
        return new Promise<EosDictionaryNode>((resolve, reject) => {
            if (dictionaryId === 'rubricator') {
                return resolve(mockRubricsMap.get(id));
            } else {
                reject(`Dictionary '${dictionaryId}' doesn't exist`);
            }
        });
    }

    /* Return promise with dictionary node children data */
    getDictionaryNodeChildren(
        dictionaryId: string,
        parentId: number = null,
        onlyNodes: boolean = false
    ): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            if (dictionaryId === 'rubricator') {
                const children: any[] = [];
                mockRubrics.forEach((node) => {
                    if (node.parentId === parentId && (!onlyNodes || node.isNode)) {
                        children.push(node);
                    }
                });
                resolve(children);
            } else {
                reject(`Dictionary '${dictionaryId}' doesn't exist`);
            }
        });
    }
}
