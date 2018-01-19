export class EosUtils {
    static dateToString(d: Date): string {
        const pad = (n: number) => n < 10 ? '0' + n : '' + n;
        return d.getFullYear() +
            '-' + pad(d.getMonth() + 1) +
            '-' + pad(d.getDate()) +
            'T' + pad(d.getHours()) +
            ':' + pad(d.getMinutes()) +
            ':' + pad(d.getSeconds());
    }
}
