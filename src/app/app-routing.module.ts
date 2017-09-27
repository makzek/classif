import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionariesComponent } from '../eos-dictionaries/dictionaries/dictionaries.component';
import { DictionaryComponent } from '../eos-dictionaries/dictionary/dictionary.component';
import { CardComponent } from '../eos-dictionaries/card/card.component';
import { TestPageComponent } from './test-page/test-page.component';
import { DesktopComponent } from './desktop/desktop.component';
import { DeliveryComponent } from '../eos-rest/clman/delivery.component';
import { RubricComponent } from '../eos-rest/clman/rubric.component';

import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { AuthGuard } from './guards/eos-auth.guard';

const routes: Routes = [{
    path: 'spravochniki',
    data: { title: 'Справочники', showInBreadcrumb: true },
    canActivate: [AuthGuard],
    children: [{
        path: '',
        pathMatch: 'full',
        component: DictionariesComponent,
        canActivate: [AuthGuard],
    }, {
        path: ':dictionaryId',
        data: { title: 'Справочник', showInBreadcrumb: true },
        children: [{
            path: ':nodeId',
            data: { title: 'node', showInBreadcrumb: true },
            children: [{
                path: '',
                component: DictionaryComponent,
                pathMatch: 'full',
                data: { showSandwichInBreadcrumb: true },
            }, {
                path: 'edit',
                pathMatch: 'full',
                component: CardComponent,
                data: { title: 'Редактирование', showInBreadcrumb: true },
                canDeactivate: [CanDeactivateGuard]
            }, {
                path: 'view',
                pathMatch: 'full',
                component: CardComponent,
                data: { title: 'Просмотр', showInBreadcrumb: true },
            }],
        }, {
            path: '',
            component: DictionaryComponent,
            pathMatch: 'full',
        }],
    }],
}, {
    path: 'desk',
    data: { title: 'Рабочий стол', showInBreadcrumb: true },
    children: [{
        path: '',
        pathMatch: 'full',
        component: DesktopComponent,
    }, {
        path: ':desktopId',
        component: DesktopComponent,
        data: { title: 'Рабочий стол', showInBreadcrumb: false }
    }]
}, {
    path: 'test',
    component: TestPageComponent,
    data: { title: 'Test page for UI components', showInBreadcrumb: true }
}, {
    path: 'delivery',
    canActivate: [AuthGuard],
    component: DeliveryComponent,
    data: { title: 'delivery page', showInBreadcrumb: true }
}, {
    path: 'rubric',
    canActivate: [AuthGuard],
    component: RubricComponent,
    data: { title: 'rubric page', showInBreadcrumb: true }
}, {
    path: '',
    redirectTo: '/desk',
    pathMatch: 'full',
}, {
    path: '**',
    redirectTo: '/desk',
    pathMatch: 'full',
}];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
