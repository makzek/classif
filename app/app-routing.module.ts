import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [{
    path: 'spravochniki',
    data: { title: 'Справочники' },
    children: [{
        path: '',
        pathMatch: 'full',
        component: DictionariesComponent,
    }, {
        path: ':dictionaryId',
        data: { title: 'Справочник' },
        children: [{
            path: '',
            pathMatch: 'full',
            component: DictionaryComponent,
        }, {
            path: ':nodeId/edit',
            pathMatch: 'full',
            component: EditComponent,
            data: { title: 'Редактирвание' },
        }],
    }],
}, {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' },
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
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
