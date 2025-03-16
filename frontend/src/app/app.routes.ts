import { MapContainerComponent } from './map-container/map-container.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'map', 
    component: MapContainerComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'app', 
    component: AppComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];
