import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class EosDictOrderService {

    private nodes: EosDictionaryNode[];
    private _order$: BehaviorSubject<EosDictionaryNode[]>;

    constructor() {
        this._order$ = new BehaviorSubject<EosDictionaryNode[]>(null);
    }

    get order$(): Observable<EosDictionaryNode[]> {
        return this._order$.asObservable();
    }

    public order(nodes: EosDictionaryNode[]) {
        const sortStorage = JSON.parse(localStorage.getItem('userOrder'));
        if (sortStorage) {
            nodes.forEach((node, i) => {
                sortStorage.forEach((id) => {

                });
            });
        }
        this._order$.next(nodes);
    }

    public moveUp() {
        this.move(-1);
    }

    public moveDown() {
        this.move(1);
    }

    public complete(nodes: EosDictionaryNode[]) {
        const sortStorage = [];
        nodes.forEach((node, i) => {
            sortStorage.push(node.id);
        });
        localStorage.setItem('userOrder', JSON.stringify(sortStorage));
    }

    private move(num: number) {
        this.nodes.forEach((node, i) => {
            const newIndex = i + num;
            if (node.selected && newIndex >= 0 && newIndex < this.nodes.length) {
                this.nodes.splice(i, 1);
                this.nodes.splice(newIndex, 0, node);
            }
        });
        this._order$.next(this.nodes);
    }

}
