import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { RubricatorComponent } from './rubricator/rubricator.component';
import { RegionsComponent } from './regions/regions.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
    path: 'spravochniki',
    component: DictionariesComponent,
    data: { title: 'Справочники' },
    children: [{
        path: 'rubricator',
        component: RubricatorComponent,
        data: { title: 'Рубрикатор' },
    }, {
        path: 'regions',
        component: RegionsComponent,
        data: { title: 'Регионы' },
    }]
}, {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
}, {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
}, {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
}];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
