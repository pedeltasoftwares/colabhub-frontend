import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SetPasswordComponent } from './pages/set-password/set-password';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
