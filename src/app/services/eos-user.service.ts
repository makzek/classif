import { Injectable } from '@angular/core';

@Injectable()
export class EosUserService {
    user: User = {
        name: null,
        smth: null,
    };

    userName(): string {
        // return this.user.name;
        return 'Иванов И. И.';
    }
/* tslint:disable:no-unused-variable */
    login(name: string, password: string): void {

    }
/* tslint:enable:no-unused-variable */

}
/* tslint:disable:max-classes-per-file */
class User {
    name: string;
    smth: string;
}
/* tslint:enable:max-classes-per-file */
