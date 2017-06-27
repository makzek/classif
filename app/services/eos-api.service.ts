import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EosDictionaryNode } from '../core/eos-dictionary-node';

/* tslint:disable:max-line-length */
const mockRubrics: any[] = [
  { id: 1, code: '1', title: 'Общая тематика', parentId: null, isNode: true, isDeleted: false, description: 'description' },
  { id: 2, code: '1.1', title: 'Вопросы промышленности', parentId: 1, isNode: false, isDeleted: false, description: 'description' },
  { id: 3, code: '1.2', title: 'Вопросы сельского хозяйства', parentId: 1, isNode: false, isDeleted: false, description: 'description' },
  { id: 4, code: '1.3', title: 'Вопросы экологии', parentId: 1, isNode: false, isDeleted: false, description: 'description' },
  { id: 5, code: '1.4', title: 'Вопросы строительства', parentId: 1, isNode: false, isDeleted: false, description: 'description' },
  { id: 6, code: '2', title: 'Обращения граждан', parentId: null, isNode: false, isDeleted: false, description: 'description' },
  { id: 7, code: '3', title: 'Финансы', parentId: null, isNode: false, isDeleted: false, description: 'description' },
];
/* tslint:enable:max-line-length */

const mockRubricsMap = new Map<number, EosDictionaryNode>(
    mockRubrics.map((rubric) => [rubric.id, rubric] as [number, EosDictionaryNode])
);

@Injectable()
export class EosApiService {
    getDictionary(dictId: string) {

    }

    getDictionaryNode(id: number): EosDictionaryNode {
        return mockRubricsMap.get(id);
    }

    getDictionaryNodeChildren(dictionaryId: string, parentId: number = null): any[] {
        const children: any[] = [];
        // TODO: make async
        if (dictionaryId === 'rubricator') {
            mockRubrics.forEach((node) => {
                if (node.parentId === parentId) {
                    children.push(node);
                }
            });
        }
        return children;
    }
}
