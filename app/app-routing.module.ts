import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { RubricatorComponent } from './rubricator/rubricator.component';
import { RegionsComponent } from './regions/regions.component';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [{
    path: 'spravochniki',
    data: { title: 'Справочники' },
    children: [{
        path: '',
        component: DictionariesComponent,
        pathMatch: 'full',
    }, {
        path: 'regions',
        component: RegionsComponent,
        data: { title: 'Регионы' },
    }, {
        path: 'rubricator',
        component: RubricatorComponent,
        data: { title: 'Рубрикатор' },
    }, {
        path: ':dictionaryName/:nodeId/edit',
        component: EditComponent,
        data: { title: 'Редактирвание' },
        pathMatch: 'full',
    }],
}, /* {
    path: 'spravochniki/rubricator',
    component: RubricatorComponent,
    data: { title: 'Рубрикатор' },
},*/
{
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' },
    pathMatch: 'full',
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
