import { Routes } from '@angular/router';
import { JobListComponent } from './features/jobs/job-list.component';
import { JobDetailComponent } from './features/jobs/job-detail.component';
import { AuthComponent } from './features/auth/auth.component';
import { ApplicantPortalComponent } from './features/applicant/applicant-portal.component';
import { EmployerPortalComponent } from './features/employer/employer-portal.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobListComponent, title: 'Open Positions · CareerCloud' },
  { path: 'jobs/:id', component: JobDetailComponent, title: 'Job Details · CareerCloud' },
  { path: 'auth', component: AuthComponent, title: 'Sign In or Register · CareerCloud' },
  {
    path: 'applicant',
    component: ApplicantPortalComponent,
    canActivate: [authGuard],
    title: 'Applicant Workspace · CareerCloud'
  },
  {
    path: 'employer',
    component: EmployerPortalComponent,
    canActivate: [authGuard],
    title: 'Employer Portal · CareerCloud'
  },
  { path: '**', redirectTo: 'jobs' }
];
