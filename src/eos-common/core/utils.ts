export class EosUtils {
    static dateToString(d: Date): string {
        const pad = (n: number) => n < 10 ? '0' + n : '' + n;
        return d.getFullYear() +
            '-' + pad(d.getMonth() + 1) +
            '-' + pad(d.getDate());
        /*'T' + pad(d.getHours()) +
        ':' + pad(d.getMinutes()) +
        ':' + pad(d.getSeconds()); */
    }

    static dateForInput(d: Date): string {
        const pad = (n: number) => n < 10 ? '0' + n : '' + n;
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('.');
    }

    static setValueByPath(data: any, path: string, value: any): any {
        const _path = path.split('.');
        const tail = _path.splice(-1, 1);
        data = data || {};
        let elem = data;
        if (_path.length) {
            elem = EosUtils.getValueByPath(data, _path.join('.'), true);
        }
        const key = EosUtils.getKeyIndex(tail[0]);
        if (key.idx === undefined) {
            elem[key.value] = value;
        } else {
            elem[key.value][key.idx] = value;
        }
        return data;
    }

    static getValueByPath(data: any, path: string, initPath = false): any {
        const _path = path.split('.');
        let elem = data;
        for (let i = 0; i < _path.length && (elem !== undefined && elem !== null); i++) { // dive deep while property exist
            const key = EosUtils.getKeyIndex(_path[i]);
            if (initPath && elem[key.value] === undefined) { // if undefined init empty
                if (key.idx === undefined) {
                    elem[key.value] = {};
                } else {
                    elem[key.value][key.idx] = {};
                }
            }
            elem = (key.idx === undefined) ? elem[key.value] : elem[key.value][key.idx];
        }
        return elem;
    }

    static getKeyIndex(key: string): { value: string, idx: number } {
        let aKey: string;
        let aIdx: number;
        if (key.indexOf('[') === -1) {
            aKey = key;
        } else {
            const tmpPath = key.split('[');
            aKey = tmpPath[0];
            aIdx = Number.parseInt(tmpPath[1]);
            if (isNaN(aIdx)) {
                aIdx = undefined;
            }
        }
        return { value: aKey, idx: aIdx };
    }
}
