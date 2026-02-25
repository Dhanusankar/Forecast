import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { authGuard } from './core/auth.guard';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './features/home.component';
import { ForecastComponent } from './features/forecast-page.component';
import { ExpensesComponent } from './features/expenses-page.component';
import { LocalLoginComponent } from './local-login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'local-login', component: LocalLoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'forecasts', component: ForecastComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
