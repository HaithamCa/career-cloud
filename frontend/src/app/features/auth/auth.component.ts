import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CareerCloudApiService } from '../../core/services/career-cloud-api.service';
import { SystemLanguageCodePoco } from '../../core/models/career-cloud.models';
import { extractApiErrorMessage } from '../../core/utils/guid.util';

export const careerCloudPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const val = String(control.value ?? '');
  if (!val) {
    return { required: true };
  }
  if (val.length < 10) {
    return { minLength10: true };
  }
  const hasExtended = ['$', '*', '#', '_', '@'].some((ch) => val.includes(ch));
  return hasExtended ? null : { missingExtendedChar: true };
};

export const careerCloudPhoneValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const val = String(control.value ?? '').trim();
  return /^\d{3}-\d{3}-\d{4}$/.test(val) ? null : { invalidPhoneFormat: true };
};

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page-header">
      <div class="container">
        <h1>Account Access</h1>
        <p>Sign in with your SecurityLogin credentials or register a new Applicant or Employer account.</p>
      </div>
    </section>

    <div class="container" style="padding-bottom: 3rem; max-width: 640px;">
      <div class="tab-switcher" role="tablist" aria-label="Authentication mode">
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="mode() === 'signin'"
          class="tab-btn"
          [class.active]="mode() === 'signin'"
          (click)="switchMode('signin')"
        >
          Sign In
        </button>
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="mode() === 'register'"
          class="tab-btn"
          [class.active]="mode() === 'register'"
          (click)="switchMode('register')"
        >
          Create Account
        </button>
      </div>

      @if (errorMessage()) {
        <div class="alert alert-error" role="alert">
          {{ errorMessage() }}
        </div>
      }
      @if (successMessage()) {
        <div class="alert alert-success" role="status">
          {{ successMessage() }}
        </div>
      }

      @if (mode() === 'signin') {
        <form [formGroup]="signInForm" (ngSubmit)="onSignIn()" class="card" novalidate>
          <div class="form-field" style="margin-bottom: 1rem;">
            <label for="signInLogin">Username (Login)</label>
            <input
              id="signInLogin"
              type="text"
              formControlName="login"
              autocomplete="username"
              placeholder="Enter your username"
            />
            @if (signInForm.controls.login.touched && signInForm.controls.login.invalid) {
              <span class="field-error">Username is required.</span>
            }
          </div>

          <div class="form-field" style="margin-bottom: 1.25rem;">
            <label for="signInPassword">Password</label>
            <input
              id="signInPassword"
              type="password"
              formControlName="password"
              autocomplete="current-password"
              placeholder="Enter your password"
            />
            @if (signInForm.controls.password.touched && signInForm.controls.password.invalid) {
              <span class="field-error">Password is required.</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%;"
            [disabled]="submitting()"
          >
            {{ submitting() ? 'Verifying Credentials...' : 'Sign In' }}
          </button>
        </form>
      } @else {
        <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="card" novalidate>
          <div class="form-grid" style="margin-bottom: 1rem;">
            <div class="form-field">
              <label for="regLogin">Username (Login)</label>
              <input
                id="regLogin"
                type="text"
                formControlName="login"
                autocomplete="username"
                placeholder="e.g. jdoe_dev"
              />
              @if (registerForm.controls.login.touched && registerForm.controls.login.invalid) {
                <span class="field-error">Username is required.</span>
              }
            </div>

            <div class="form-field">
              <label for="regRole">Account Role</label>
              <select id="regRole" formControlName="role">
                <option value="Applicant">Applicant (Job Seeker)</option>
                <option value="Employer">Employer (Company / Recruiter)</option>
              </select>
            </div>
          </div>

          <div class="form-field" style="margin-bottom: 1rem;">
            <label for="regFullName">Full Name</label>
            <input
              id="regFullName"
              type="text"
              formControlName="fullName"
              autocomplete="name"
              placeholder="e.g. Jordan Doe"
            />
            @if (registerForm.controls.fullName.touched && registerForm.controls.fullName.invalid) {
              <span class="field-error">Full name is required (Rule 705).</span>
            }
          </div>

          <div class="form-grid" style="margin-bottom: 1rem;">
            <div class="form-field">
              <label for="regEmail">Email Address</label>
              <input
                id="regEmail"
                type="email"
                formControlName="emailAddress"
                autocomplete="email"
                placeholder="jordan@example.com"
              />
              @if (registerForm.controls.emailAddress.touched && registerForm.controls.emailAddress.invalid) {
                <span class="field-error">Enter a valid email address (Rule 704).</span>
              }
            </div>

            <div class="form-field">
              <label for="regPhone">Phone Number (XXX-XXX-XXXX)</label>
              <input
                id="regPhone"
                type="tel"
                formControlName="phoneNumber"
                placeholder="416-555-0192"
              />
              <span class="field-hint">Required format: 3 digits - 3 digits - 4 digits</span>
              @if (registerForm.controls.phoneNumber.touched && registerForm.controls.phoneNumber.invalid) {
                <span class="field-error">Phone must match XXX-XXX-XXXX (Rules 702/703).</span>
              }
            </div>
          </div>

          <div class="form-grid" style="margin-bottom: 1.25rem;">
            <div class="form-field">
              <label for="regPassword">Password</label>
              <input
                id="regPassword"
                type="password"
                formControlName="password"
                autocomplete="new-password"
                placeholder="Min 10 chars + $, *, #, _, or @"
              />
              <span class="field-hint">At least 10 characters and one of: $ * # _ &#64;</span>
              @if (registerForm.controls.password.touched && registerForm.controls.password.invalid) {
                <span class="field-error">
                  Password must be ≥10 chars and include $, *, #, _, or &#64; (Rules 700/701).
                </span>
              }
            </div>

            <div class="form-field">
              <label for="regLanguage">Preferred Language</label>
              <select id="regLanguage" formControlName="prefferredLanguage">
                @for (lang of languages(); track lang.languageID) {
                  <option [value]="lang.languageID">{{ lang.name }} ({{ lang.languageID }})</option>
                }
                @if (languages().length === 0) {
                  <option value="EN">English (EN)</option>
                }
              </select>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%;"
            [disabled]="submitting()"
          >
            {{ submitting() ? 'Creating Account...' : 'Create Account & Sign In' }}
          </button>
        </form>
      }
    </div>
  `,
  styles: [`
    .tab-switcher {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: var(--bg-muted);
      padding: 0.3rem;
      border-radius: var(--radius-sm);
      margin-bottom: 1.25rem;
      border: 1px solid var(--border-color);
    }
    .tab-btn {
      padding: 0.55rem 1rem;
      font-weight: 600;
      font-size: 0.9rem;
      border: none;
      border-radius: calc(var(--radius-sm) - 2px);
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .tab-btn.active {
      background: var(--bg-surface);
      color: var(--brand);
      box-shadow: var(--shadow-sm);
    }
  `]
})
export class AuthComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly api = inject(CareerCloudApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly mode = signal<'signin' | 'register'>('signin');
  readonly submitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly languages = signal<SystemLanguageCodePoco[]>([]);

  readonly signInForm = this.fb.nonNullable.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  readonly registerForm = this.fb.nonNullable.group({
    login: ['', [Validators.required]],
    role: ['Applicant' as 'Applicant' | 'Employer', [Validators.required]],
    fullName: ['', [Validators.required]],
    emailAddress: ['', [Validators.required, Validators.email]],
    phoneNumber: ['416-555-0100', [Validators.required, careerCloudPhoneValidator]],
    password: ['', [Validators.required, careerCloudPasswordValidator]],
    prefferredLanguage: ['EN', [Validators.required]]
  });

  ngOnInit(): void {
    this.api.getLanguages().subscribe({
      next: (langs) => this.languages.set(langs)
    });
  }

  switchMode(nextMode: 'signin' | 'register'): void {
    this.mode.set(nextMode);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  onSignIn(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    const { login, password } = this.signInForm.getRawValue();

    this.auth.signIn(login.trim(), password).subscribe({
      next: (user) => {
        this.submitting.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate([user.role === 'Employer' ? '/employer' : '/applicant']);
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(extractApiErrorMessage(err));
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    const payload = this.registerForm.getRawValue();

    this.auth.register(payload).subscribe({
      next: (user) => {
        this.submitting.set(false);
        this.router.navigate([user.role === 'Employer' ? '/employer' : '/applicant']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(extractApiErrorMessage(err));
      }
    });
  }
}
