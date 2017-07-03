import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [{
    path: 'spravochniki',
    data: { title: 'Справочники', showInBreadcrumb: true  },
    children: [{
        path: '',
        pathMatch: 'full',
        component: DictionariesComponent,
    }, {
        path: ':dictionaryId',
        data: { title: 'Справочник', showInBreadcrumb: true },
        children: [{
            path: ':nodeId/edit',
            pathMatch: 'full',
            component: EditComponent,
            data: { title: 'Редактирвание' },
        }, {
            path: ':nodeId',
            data: { showInBreadcrumb: false },
            component: DictionaryComponent,
        }, {
            path: '',
            component: DictionaryComponent,
            pathMatch: 'full',
        }],
    }],
}, {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home', showInBreadcrumb: true },
}, {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
}, {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
}];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
