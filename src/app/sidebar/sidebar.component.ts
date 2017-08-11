import { Component } from '@angular/core';

@Component({
    selector: 'eos-sidebar',
    templateUrl: 'sidebar.component.html',
})
export class SidebarComponent {
    hideMenu = true;
    modules = [{
        icon: 'fa-list',
        title: 'Cправочники',
        url: '/spravochniki'
    }, {
        icon: 'fa-code',
        title: 'Тестовая страница',
        url: '/test'
    }];
}
