import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { CareerCloudApiService } from '../../core/services/career-cloud-api.service';
import { JobCatalogService } from '../../core/services/job-catalog.service';
import { AuthService } from '../../core/services/auth.service';
import {
  CompanyDescriptionPoco,
  CompanyJobDescriptionPoco,
  CompanyJobEducationPoco,
  CompanyJobPoco,
  CompanyJobSkillPoco,
  CompanyLocationPoco,
  CompanyProfilePoco,
  EnrichedJobView,
  SystemCountryCodePoco,
  SystemLanguageCodePoco
} from '../../core/models/career-cloud.models';
import { extractApiErrorMessage, newGuid } from '../../core/utils/guid.util';

@Component({
  selector: 'app-employer-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <h1>Employer &amp; Recruitment Portal</h1>
        <p>Manage your company profile, office locations, and publish new job openings.</p>
      </div>
    </section>

    <div class="container" style="padding-bottom: 3rem;">
      @if (loading()) {
        <div class="state-box" role="status" aria-live="polite">
          <h3>Loading employer data...</h3>
          <p>Retrieving company profiles, locations, and active job postings from CareerCloud.WebAPI.</p>
        </div>
      } @else {
        @if (statusMessage()) {
          <div class="alert alert-success" role="status">{{ statusMessage() }}</div>
        }
        @if (errorMessage()) {
          <div class="alert alert-error" role="alert">{{ errorMessage() }}</div>
        }

        <!-- Company Selector / Switcher -->
        <section class="card" style="margin-bottom: 1.5rem;" aria-labelledby="company-select-heading">
          <div class="section-header-row">
            <div>
              <h2 id="company-select-heading" class="section-title">1. Active Company Profile</h2>
              <p class="section-subtitle">
                Select an existing company or create a new CompanyProfile + CompanyDescription below.
              </p>
            </div>
            <div style="min-width: 260px;">
              <label for="companySwitcher" style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">
                Switch Company Workspace
              </label>
              <select
                id="companySwitcher"
                [value]="selectedCompanyId() ?? ''"
                (change)="onSelectCompany($any($event.target).value)"
                style="width: 100%; padding: 0.45rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);"
              >
                <option value="">+ Create New Company Profile</option>
                @for (cp of allCompanies(); track cp.id) {
                  <option [value]="cp.id">{{ resolveCompanyName(cp.id) }} ({{ cp.companyWebsite }})</option>
                }
              </select>
            </div>
          </div>

          <form [formGroup]="companyForm" (ngSubmit)="saveCompany()" novalidate>
            <div class="form-grid" style="margin-bottom: 1rem;">
              <div class="form-field">
                <label for="compName">Company Name (&gt;2 chars, Rule 106)</label>
                <input id="compName" type="text" formControlName="companyName" placeholder="MapleCloud Technologies" />
              </div>

              <div class="form-field">
                <label for="compWebsite">Website (.ca, .com, or .biz — Rule 600)</label>
                <input id="compWebsite" type="url" formControlName="companyWebsite" placeholder="https://acme.ca" />
              </div>

              <div class="form-field">
                <label for="compPhone">Contact Phone (XXX-XXX-XXXX — Rule 601)</label>
                <input id="compPhone" type="tel" formControlName="contactPhone" placeholder="416-555-0199" />
              </div>

              <div class="form-field">
                <label for="compContact">Contact Person</label>
                <input id="compContact" type="text" formControlName="contactName" placeholder="Sarah Jenkins" />
              </div>

              <div class="form-field">
                <label for="compLang">Description Language</label>
                <select id="compLang" formControlName="languageId">
                  @for (l of languages(); track l.languageID) {
                    <option [value]="l.languageID">{{ l.name }} ({{ l.languageID }})</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-field" style="margin-bottom: 1rem;">
              <label for="compDesc">Company Description (&gt;2 chars, Rule 107)</label>
              <textarea
                id="compDesc"
                rows="3"
                formControlName="companyDescription"
                placeholder="Describe your organization's mission, products, and engineering culture..."
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="saving()">
              {{ selectedCompanyId() ? 'Update Company Profile' : 'Create Company Profile' }}
            </button>
          </form>
        </section>

        @if (selectedCompanyId()) {
          <!-- 2. Company Location -->
          <section class="card" style="margin-bottom: 1.5rem;" aria-labelledby="loc-heading">
            <h2 id="loc-heading" class="section-title">2. Office Locations ({{ companyLocations().length }})</h2>

            @if (companyLocations().length > 0) {
              <div class="item-list" style="margin-bottom: 1rem;">
                @for (loc of companyLocations(); track loc.id) {
                  <div class="item-row">
                    <div>
                      <strong>{{ loc.city }}, {{ loc.province }}</strong> ({{ loc.countryCode }})
                      <div class="item-meta">{{ loc.street }} · Postal Code: {{ loc.postalCode }}</div>
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" (click)="deleteLocation(loc)">
                      Remove
                    </button>
                  </div>
                }
              </div>
            }

            <form [formGroup]="locationForm" (ngSubmit)="addLocation()" novalidate>
              <div class="form-grid" style="margin-bottom: 1rem;">
                <div class="form-field">
                  <label for="locStreet">Street Address (Rule 502)</label>
                  <input id="locStreet" type="text" formControlName="street" placeholder="200 Bay Street" />
                </div>
                <div class="form-field">
                  <label for="locCity">City (Rule 503)</label>
                  <input id="locCity" type="text" formControlName="city" placeholder="Toronto" />
                </div>
                <div class="form-field">
                  <label for="locProvince">Province / State (Rule 501)</label>
                  <input id="locProvince" type="text" formControlName="province" placeholder="ON" />
                </div>
                <div class="form-field">
                  <label for="locPostal">Postal Code (Rule 504)</label>
                  <input id="locPostal" type="text" formControlName="postalCode" placeholder="M5J 2J5" />
                </div>
                <div class="form-field">
                  <label for="locCountry">Country (Rule 500)</label>
                  <select id="locCountry" formControlName="countryCode">
                    @for (c of countries(); track c.code) {
                      <option [value]="c.code">{{ c.name }} ({{ c.code }})</option>
                    }
                  </select>
                </div>
              </div>
              <button type="submit" class="btn btn-secondary btn-sm" [disabled]="saving()">
                + Add Office Location
              </button>
            </form>
          </section>

          <!-- 3. Post New Job -->
          <section class="card" style="margin-bottom: 1.5rem;" aria-labelledby="post-job-heading">
            <h2 id="post-job-heading" class="section-title">3. Publish a New Job Opening</h2>
            <p class="section-subtitle" style="margin-bottom: 1rem;">
              Creates synchronized records in <code>Company_Jobs</code>, <code>Company_Jobs_Descriptions</code>,
              <code>Company_Job_Skills</code>, and <code>Company_Job_Educations</code>.
            </p>

            <form [formGroup]="jobForm" (ngSubmit)="publishJob()" novalidate>
              <div class="form-grid" style="margin-bottom: 1rem;">
                <div class="form-field">
                  <label for="jobName">Job Title (Rule 300)</label>
                  <input id="jobName" type="text" formControlName="jobName" placeholder="Lead Cloud Engineer" />
                </div>

                <div class="form-field">
                  <label for="jobSkill">Primary Required Skill</label>
                  <input id="jobSkill" type="text" formControlName="skill" placeholder="ASP.NET Core & Azure" />
                </div>

                <div class="form-field">
                  <label for="jobSkillLevel">Skill Level</label>
                  <select id="jobSkillLevel" formControlName="skillLevel">
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div class="form-field">
                  <label for="jobMajor">Required Academic Major (≥2 chars, Rule 200)</label>
                  <input id="jobMajor" type="text" formControlName="major" placeholder="Computer Science" />
                </div>
              </div>

              <div class="form-field" style="margin-bottom: 1rem;">
                <label for="jobDescriptions">Full Job Description (Rule 301)</label>
                <textarea
                  id="jobDescriptions"
                  rows="4"
                  formControlName="jobDescriptions"
                  placeholder="Describe day-to-day responsibilities, architecture stack, and team structure..."
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary" [disabled]="saving()">
                {{ saving() ? 'Publishing Job...' : 'Publish Job Posting' }}
              </button>
            </form>
          </section>

          <!-- 4. Company's Existing Jobs -->
          <section class="card" aria-labelledby="company-jobs-heading">
            <h2 id="company-jobs-heading" class="section-title">
              4. Published Postings for {{ resolveCompanyName(selectedCompanyId()!) }} ({{ companyJobs().length }})
            </h2>

            @if (companyJobs().length === 0) {
              <p class="empty-inline">No job postings published for this company yet.</p>
            } @else {
              <div class="item-list">
                @for (item of companyJobs(); track item.job.id) {
                  <div class="item-row">
                    <div>
                      <strong>
                        <a [routerLink]="['/jobs', item.job.id]">{{ item.title }}</a>
                      </strong>
                      <div class="item-meta">
                        Posted {{ item.job.profileCreated | date:'mediumDate' }} · {{ item.skills.length }} skills · {{ item.educations.length }} education reqs
                      </div>
                    </div>
                    <a [routerLink]="['/jobs', item.job.id]" class="btn btn-secondary btn-sm">
                      View Listing
                    </a>
                  </div>
                }
              </div>
            }
          </section>
        }
      }
    </div>
  `,
  styles: [`
    .section-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .section-title {
      margin: 0 0 0.35rem;
      font-size: 1.15rem;
    }
    .section-subtitle {
      margin: 0;
      font-size: 0.88rem;
      color: var(--text-secondary);
    }
    .empty-inline {
      margin: 0 0 1rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .item-list {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: var(--bg-muted);
      border-radius: var(--radius-sm);
    }
    .item-meta {
      font-size: 0.82rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
    }
  `]
})
export class EmployerPortalComponent implements OnInit {
  private readonly api = inject(CareerCloudApiService);
  private readonly catalog = inject(JobCatalogService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal<boolean>(true);
  readonly saving = signal<boolean>(false);
  readonly statusMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly countries = signal<SystemCountryCodePoco[]>([]);
  readonly languages = signal<SystemLanguageCodePoco[]>([]);
  readonly allCompanies = signal<CompanyProfilePoco[]>([]);
  readonly allDescriptions = signal<CompanyDescriptionPoco[]>([]);
  readonly allLocations = signal<CompanyLocationPoco[]>([]);
  readonly allEnrichedJobs = signal<EnrichedJobView[]>([]);

  readonly selectedCompanyId = signal<string | null>(null);

  readonly companyForm = this.fb.nonNullable.group({
    companyName: ['', [Validators.required, Validators.minLength(3)]],
    companyWebsite: ['https://', [Validators.required]],
    contactPhone: ['416-555-0199', [Validators.required]],
    contactName: ['', [Validators.required]],
    languageId: ['EN', [Validators.required]],
    companyDescription: ['', [Validators.required, Validators.minLength(3)]]
  });

  readonly locationForm = this.fb.nonNullable.group({
    street: ['100 King St W', [Validators.required]],
    city: ['Toronto', [Validators.required]],
    province: ['ON', [Validators.required]],
    postalCode: ['M5X 1A9', [Validators.required]],
    countryCode: ['CAN', [Validators.required]]
  });

  readonly jobForm = this.fb.nonNullable.group({
    jobName: ['', [Validators.required]],
    jobDescriptions: ['', [Validators.required]],
    skill: ['C# / .NET Core', [Validators.required]],
    skillLevel: ['Advanced', [Validators.required]],
    major: ['Computer Science', [Validators.required, Validators.minLength(2)]]
  });

  ngOnInit(): void {
    this.loadEmployerData();
  }

  loadEmployerData(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      countries: this.api.getCountries(),
      languages: this.api.getLanguages(),
      companies: this.api.getCompanyProfiles(),
      descriptions: this.api.getCompanyDescriptions(),
      locations: this.api.getCompanyLocations(),
      jobs: this.catalog.loadEnrichedJobs()
    }).subscribe({
      next: (data) => {
        this.countries.set(data.countries);
        this.languages.set(data.languages);
        this.allCompanies.set(data.companies);
        this.allDescriptions.set(data.descriptions);
        this.allLocations.set(data.locations);
        this.allEnrichedJobs.set(data.jobs);

        const user = this.auth.currentUser();
        const matchedByContact = user
          ? data.companies.find(
              (c) => c.contactName?.toLowerCase() === user.fullName.toLowerCase()
            )
          : undefined;

        const initialId =
          this.selectedCompanyId() ?? matchedByContact?.id ?? data.companies[0]?.id ?? null;
        this.onSelectCompany(initialId ?? '');
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(extractApiErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  onSelectCompany(companyId: string): void {
    if (!companyId) {
      this.selectedCompanyId.set(null);
      const user = this.auth.currentUser();
      this.companyForm.reset({
        companyName: '',
        companyWebsite: 'https://example.ca',
        contactPhone: user?.phoneNumber || '416-555-0199',
        contactName: user?.fullName || 'Hiring Manager',
        languageId: 'EN',
        companyDescription: ''
      });
      return;
    }

    this.selectedCompanyId.set(companyId);
    const comp = this.allCompanies().find((c) => c.id === companyId);
    const desc =
      this.allDescriptions().find((d) => d.company === companyId && d.languageId === 'EN') ??
      this.allDescriptions().find((d) => d.company === companyId);

    if (comp) {
      this.companyForm.patchValue({
        companyName: desc?.companyName ?? '',
        companyWebsite: comp.companyWebsite ?? '',
        contactPhone: comp.contactPhone ?? '',
        contactName: comp.contactName ?? '',
        languageId: desc?.languageId ?? 'EN',
        companyDescription: desc?.companyDescription ?? ''
      });
    }
  }

  companyLocations(): CompanyLocationPoco[] {
    const id = this.selectedCompanyId();
    if (!id) {
      return [];
    }
    return this.allLocations().filter((l) => l.company === id);
  }

  companyJobs(): EnrichedJobView[] {
    const id = this.selectedCompanyId();
    if (!id) {
      return [];
    }
    return this.allEnrichedJobs().filter((j) => j.job.company === id);
  }

  resolveCompanyName(companyId: string): string {
    const desc = this.allDescriptions().find((d) => d.company === companyId);
    return desc?.companyName ?? `Company ${companyId.slice(0, 6)}`;
  }

  saveCompany(): void {
    const raw = this.companyForm.getRawValue();
    this.saving.set(true);
    this.statusMessage.set(null);
    this.errorMessage.set(null);

    const existingId = this.selectedCompanyId();
    const companyId = existingId ?? newGuid();

    const profilePoco: CompanyProfilePoco = {
      id: companyId,
      companyWebsite: raw.companyWebsite.trim(),
      contactPhone: raw.contactPhone.trim(),
      contactName: raw.contactName.trim(),
      registrationDate: new Date().toISOString()
    };

    const existingDesc = this.allDescriptions().find(
      (d) => d.company === companyId && d.languageId === raw.languageId
    );

    const descPoco: CompanyDescriptionPoco = {
      id: existingDesc?.id ?? newGuid(),
      company: companyId,
      languageId: raw.languageId,
      companyName: raw.companyName.trim(),
      companyDescription: raw.companyDescription.trim()
    };

    const saveProfile$ = existingId
      ? this.api.updateCompanyProfiles([profilePoco])
      : this.api.createCompanyProfiles([profilePoco]);

    const saveDesc$ = existingDesc
      ? this.api.updateCompanyDescriptions([descPoco])
      : this.api.createCompanyDescriptions([descPoco]);

    saveProfile$.pipe(switchMap(() => saveDesc$)).subscribe({
      next: () => {
        this.saving.set(false);
        this.selectedCompanyId.set(companyId);
        this.statusMessage.set(
          existingId ? 'Company profile & description updated.' : 'New company profile created.'
        );
        this.loadEmployerData();
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(extractApiErrorMessage(err));
      }
    });
  }

  addLocation(): void {
    const companyId = this.selectedCompanyId();
    if (!companyId) {
      return;
    }
    const raw = this.locationForm.getRawValue();
    const locPoco: CompanyLocationPoco = {
      id: newGuid(),
      company: companyId,
      street: raw.street.trim(),
      city: raw.city.trim(),
      province: raw.province.trim(),
      postalCode: raw.postalCode.trim(),
      countryCode: raw.countryCode
    };

    this.saving.set(true);
    this.statusMessage.set(null);
    this.errorMessage.set(null);

    this.api.createCompanyLocations([locPoco]).subscribe({
      next: () => {
        this.saving.set(false);
        this.allLocations.set([...this.allLocations(), locPoco]);
        this.statusMessage.set('Office location added.');
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(extractApiErrorMessage(err));
      }
    });
  }

  deleteLocation(loc: CompanyLocationPoco): void {
    this.api.deleteCompanyLocations([loc]).subscribe({
      next: () => {
        this.allLocations.set(this.allLocations().filter((l) => l.id !== loc.id));
        this.statusMessage.set('Location removed.');
      },
      error: (err) => this.errorMessage.set(extractApiErrorMessage(err))
    });
  }

  publishJob(): void {
    const companyId = this.selectedCompanyId();
    if (!companyId) {
      return;
    }
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const raw = this.jobForm.getRawValue();
    const jobId = newGuid();

    const jobPoco: CompanyJobPoco = {
      id: jobId,
      company: companyId,
      profileCreated: new Date().toISOString(),
      isInactive: false,
      isCompanyHidden: false
    };

    const descPoco: CompanyJobDescriptionPoco = {
      id: newGuid(),
      job: jobId,
      jobName: raw.jobName.trim(),
      jobDescriptions: raw.jobDescriptions.trim()
    };

    const skillPoco: CompanyJobSkillPoco = {
      id: newGuid(),
      job: jobId,
      skill: raw.skill.trim(),
      skillLevel: raw.skillLevel,
      importance: 9
    };

    const eduPoco: CompanyJobEducationPoco = {
      id: newGuid(),
      job: jobId,
      major: raw.major.trim(),
      importance: 8
    };

    this.saving.set(true);
    this.statusMessage.set(null);
    this.errorMessage.set(null);

    this.api
      .createCompanyJobs([jobPoco])
      .pipe(
        switchMap(() =>
          forkJoin([
            this.api.createCompanyJobDescriptions([descPoco]),
            this.api.createCompanyJobSkills([skillPoco]),
            this.api.createCompanyJobEducations([eduPoco])
          ])
        )
      )
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.jobForm.patchValue({ jobName: '', jobDescriptions: '' });
          this.statusMessage.set(`Published job opening "${descPoco.jobName}".`);
          this.loadEmployerData();
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage.set(extractApiErrorMessage(err));
        }
      });
  }
}
