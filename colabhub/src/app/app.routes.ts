import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SetPasswordComponent } from './pages/set-password/set-password';
import {AdminDashboard} from './pages/admin-dashboard/admin-dashboard';
import { PmoDashboard } from './pages/pmo-dashboard/pmo-dashboard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'pmo-dashboard', component: PmoDashboard },
  { path: 'set-password', component: SetPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
