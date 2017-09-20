export class SequenceMap {
    private nextIsn: number = -20000;
    private fixed: any = {};

    GetTempISN = function () {
        return ++this.nextIsn;
    }

    GetTempDUE = function (parentDue) {
        return parentDue + (++this.nextIsn).toString() + '.';
    }

    GetFixed(tempID: any) {
        return this.fixed[tempID];
    }
    Fix(tempID: any, id: any) {
        this.fixed[tempID] = id;
    }
}
