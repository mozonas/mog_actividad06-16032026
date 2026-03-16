import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { UserDetailPage } from './pages/user-detail/user-detail.page';
import { UserFormPage } from './pages/user-form/user-form.page';

export const routes: Routes = [
{ path: 'home', component: HomePage },
{ path: 'user-detail/:_id', component: UserDetailPage },
{ path: 'newuser', component: UserFormPage },
{ path: 'updateuser/:_id', component: UserFormPage },
{ path: '**', redirectTo: 'home' }
];
