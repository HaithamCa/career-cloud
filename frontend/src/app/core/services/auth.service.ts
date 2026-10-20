import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, forkJoin, map, switchMap, tap } from 'rxjs';
import { CareerCloudApiService } from './career-cloud-api.service';
import { AuthenticatedUser, SecurityLoginPoco } from '../models/career-cloud.models';
import { newGuid } from '../utils/guid.util';

const SESSION_STORAGE_KEY = 'careercloud_active_user';

export interface RegisterAccountInput {
  login: string;
  password: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  prefferredLanguage: string;
  role: 'Applicant' | 'Employer';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(CareerCloudApiService);
  private readonly userSignal = signal<AuthenticatedUser | null>(this.readStoredUser());

  readonly currentUser = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly isApplicant = computed(() => this.userSignal()?.role === 'Applicant');
  readonly isEmployer = computed(() => this.userSignal()?.role === 'Employer');

  signIn(login: string, password: string): Observable<AuthenticatedUser> {
    return this.api.authenticate(login, password).pipe(
      switchMap((authResult) =>
        forkJoin({
          roles: this.api.getRoles(),
          loginRoles: this.api.getLoginRoles()
        }).pipe(
          map(({ roles, loginRoles }) => {
            const assigned = loginRoles.find((lr) => lr.login === authResult.id);
            const matchedRole = assigned ? roles.find((r) => r.id === assigned.role) : undefined;
            const roleName: 'Applicant' | 'Employer' =
              matchedRole?.role?.toLowerCase() === 'employer' ? 'Employer' : 'Applicant';

            const sessionUser: AuthenticatedUser = {
              ...authResult,
              role: roleName
            };
            this.persistUser(sessionUser);
            return sessionUser;
          })
        )
      )
    );
  }

  register(input: RegisterAccountInput): Observable<AuthenticatedUser> {
    const loginId = newGuid();
    const newLogin: SecurityLoginPoco = {
      id: loginId,
      login: input.login.trim(),
      password: input.password,
      fullName: input.fullName.trim(),
      emailAddress: input.emailAddress.trim(),
      phoneNumber: input.phoneNumber.trim(),
      prefferredLanguage: input.prefferredLanguage || 'EN',
      isLocked: false,
      isInactive: false,
      forceChangePassword: false,
      agreementAccepted: new Date().toISOString()
    };

    return this.api.createLogins([newLogin]).pipe(
      switchMap(() => this.api.getRoles()),
      switchMap((roles) => {
        const targetRole = roles.find(
          (r) => r.role?.toLowerCase() === input.role.toLowerCase()
        );
        if (!targetRole) {
          return this.signIn(input.login.trim(), input.password);
        }
        return this.api
          .createLoginRoles([
            {
              id: newGuid(),
              login: loginId,
              role: targetRole.id
            }
          ])
          .pipe(switchMap(() => this.signIn(input.login.trim(), input.password)));
      }),
      tap((user) => this.persistUser(user))
    );
  }

  signOut(): void {
    this.userSignal.set(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  private persistUser(user: AuthenticatedUser): void {
    this.userSignal.set(user);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Ignore storage errors
    }
  }

  private readStoredUser(): AuthenticatedUser | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as AuthenticatedUser;
    } catch {
      return null;
    }
  }
}
