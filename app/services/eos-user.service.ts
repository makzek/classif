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

    login(name: string, password: string): void {

    }

}

class User {
    name: string;
    smth: string;
}
