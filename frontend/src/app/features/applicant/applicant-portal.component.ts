import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CareerCloudApiService } from '../../core/services/career-cloud-api.service';
import { JobCatalogService } from '../../core/services/job-catalog.service';
import { AuthService } from '../../core/services/auth.service';
import {
  ApplicantEducationPoco,
  ApplicantJobApplicationPoco,
  ApplicantProfilePoco,
  ApplicantResumePoco,
  ApplicantSkillPoco,
  ApplicantWorkHistoryPoco,
  EnrichedJobView,
  SystemCountryCodePoco
} from '../../core/models/career-cloud.models';
import { extractApiErrorMessage, newGuid } from '../../core/utils/guid.util';

@Component({
  selector: 'app-applicant-portal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <h1>Applicant Workspace</h1>
        <p>
          Manage your candidate profile, academic credentials, technical skills, work history, resume, and job applications.
        </p>
      </div>
    </section>

    <div class="container" style="padding-bottom: 3rem;">
      @if (loading()) {
        <div class="state-box" role="status" aria-live="polite">
          <h3>Loading your applicant records...</h3>
          <p>Fetching profile, education, skills, work history, and applications from CareerCloud.WebAPI.</p>
        </div>
      } @else {
        @if (statusMessage()) {
          <div class="alert alert-success" role="status">{{ statusMessage() }}</div>
        }
        @if (errorMessage()) {
          <div class="alert alert-error" role="alert">{{ errorMessage() }}</div>
        }

        <!-- 1. Applicant Profile -->
        <section class="card" style="margin-bottom: 1.5rem;" aria-labelledby="profile-heading">
          <div class="section-header-row">
            <div>
              <h2 id="profile-heading" class="section-title">1. Candidate Profile</h2>
              <p class="section-subtitle">
                {{ profile() ? 'Update your compensation expectations and mailing address.' : 'Create your ApplicantProfile record first to unlock Education, Skills, Work History, and Job Applications.' }}
              </p>
            </div>
            @if (profile()) {
              <span class="badge">Profile Active</span>
            } @else {
              <span class="badge badge-neutral">Not Created Yet</span>
            }
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" novalidate>
            <div class="form-grid" style="margin-bottom: 1rem;">
              <div class="form-field">
                <label for="profSalary">Current / Target Salary (Annual)</label>
                <input id="profSalary" type="number" min="0" formControlName="currentSalary" />
              </div>

              <div class="form-field">
                <label for="profRate">Hourly Rate</label>
                <input id="profRate" type="number" min="0" formControlName="currentRate" />
              </div>

              <div class="form-field">
                <label for="profCurrency">Currency (e.g. CAD, USD)</label>
                <input id="profCurrency" type="text" maxlength="10" formControlName="currency" />
              </div>

              <div class="form-field">
                <label for="profCountry">Country</label>
                <select id="profCountry" formControlName="country">
                  @for (c of countries(); track c.code) {
                    <option [value]="c.code">{{ c.name }} ({{ c.code }})</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-grid" style="margin-bottom: 1rem;">
              <div class="form-field">
                <label for="profStreet">Street Address</label>
                <input id="profStreet" type="text" formControlName="street" placeholder="123 Queen St W" />
              </div>

              <div class="form-field">
                <label for="profCity">City / Town</label>
                <input id="profCity" type="text" formControlName="city" placeholder="Toronto" />
              </div>

              <div class="form-field">
                <label for="profProvince">Province / State Code</label>
                <input id="profProvince" type="text" maxlength="10" formControlName="province" placeholder="ON" />
              </div>

              <div class="form-field">
                <label for="profPostal">Postal / Zip Code</label>
                <input id="profPostal" type="text" maxlength="20" formControlName="postalCode" placeholder="M5H 2N2" />
              </div>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="saving()">
              {{ profile() ? 'Update Profile' : 'Create Applicant Profile' }}
            </button>
          </form>
        </section>

        @if (profile()) {
          <!-- 2. Resume -->
          <section class="card" style="margin-bottom: 1.5rem;" aria-labelledby="resume-heading">
            <h2 id="resume-heading" class="section-title">2. Resume Summary</h2>
            <form [formGroup]="resumeForm" (ngSubmit)="saveResume()" novalidate>
              <div class="form-field" style="margin-bottom: 1rem;">
                <label for="resumeText">Resume Text / Summary (Required by Rule 113)</label>
                <textarea
                  id="resumeText"
                  rows="4"
                  formControlName="resume"
                  placeholder="Paste your professional summary, achievements, and links..."
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving()">
                {{ resumeRecord() ? 'Update Resume' : 'Save Resume' }}
              </button>
            </form>
          </section>

          <!-- 3. Education -->
          <section class="card" style="margin-bottom: 1.5rem;" aria-labelledby="edu-heading">
            <h2 id="edu-heading" class="section-title">3. Education ({{ educations().length }})</h2>

            @if (educations().length === 0) {
              <p class="empty-inline">No education entries added yet.</p>
            } @else {
              <div class="item-list" style="margin-bottom: 1.25rem;">
                @for (ed of educations(); track ed.id) {
                  <div class="item-row">
                    <div>
                      <strong>{{ ed.major }}</strong>
                      @if (ed.certificateDiploma) {
                        <span> · {{ ed.certificateDiploma }}</span>
                      }
                      <div class="item-meta">
                        {{ ed.startDate | date:'mediumDate' }} – {{ ed.completionDate | date:'mediumDate' }}
                        ({{ ed.completionPercent ?? 100 }}% complete)
                      </div>
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" (click)="deleteEducation(ed)">
                      Remove
                    </button>
                  </div>
                }
              </div>
            }

            <form [formGroup]="educationForm" (ngSubmit)="addEducation()" novalidate>
              <div class="form-grid" style="margin-bottom: 1rem;">
                <div class="form-field">
                  <label for="eduMajor">Major (≥3 chars, Rule 107)</label>
                  <input id="eduMajor" type="text" formControlName="major" placeholder="Computer Science" />
                </div>
                <div class="form-field">
                  <label for="eduCert">Certificate / Diploma</label>
                  <input id="eduCert" type="text" formControlName="certificateDiploma" placeholder="B.Sc. Honours" />
                </div>
                <div class="form-field">
                  <label for="eduStart">Start Date (≤ Today, Rule 108)</label>
                  <input id="eduStart" type="date" formControlName="startDate" />
                </div>
                <div class="form-field">
                  <label for="eduEnd">Completion Date (≥ Start, Rule 109)</label>
                  <input id="eduEnd" type="date" formControlName="completionDate" />
                </div>
                <div class="form-field">
                  <label for="eduPct">Completion %</label>
                  <input id="eduPct" type="number" min="0" max="100" formControlName="completionPercent" />
                </div>
              </div>
              <button type="submit" class="btn btn-secondary btn-sm" [disabled]="saving()">
                + Add Education
              </button>
            </form>
          </section>

          <!-- 4. Skills -->
          <section class="card" style="margin-bottom: 1.5rem;" aria-labelledby="skill-heading">
            <h2 id="skill-heading" class="section-title">4. Technical Skills ({{ skills().length }})</h2>

            @if (skills().length === 0) {
              <p class="empty-inline">No skills recorded yet.</p>
            } @else {
              <div class="item-list" style="margin-bottom: 1.25rem;">
                @for (sk of skills(); track sk.id) {
                  <div class="item-row">
                    <div>
                      <strong>{{ sk.skill }}</strong>
                      <span class="badge" style="margin-left: 0.5rem;">{{ sk.skillLevel }}</span>
                      <div class="item-meta">
                        {{ sk.startMonth }}/{{ sk.startYear }} – {{ sk.endMonth }}/{{ sk.endYear }}
                      </div>
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" (click)="deleteSkill(sk)">
                      Remove
                    </button>
                  </div>
                }
              </div>
            }

            <form [formGroup]="skillForm" (ngSubmit)="addSkill()" novalidate>
              <div class="form-grid" style="margin-bottom: 1rem;">
                <div class="form-field">
                  <label for="skName">Skill Name</label>
                  <input id="skName" type="text" formControlName="skill" placeholder="C# / .NET Core" />
                </div>
                <div class="form-field">
                  <label for="skLevel">Proficiency Level</label>
                  <select id="skLevel" formControlName="skillLevel">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div class="form-field">
                  <label for="skStartMonth">Start Month (1–12)</label>
                  <input id="skStartMonth" type="number" min="1" max="12" formControlName="startMonth" />
                </div>
                <div class="form-field">
                  <label for="skStartYear">Start Year (≥1900)</label>
                  <input id="skStartYear" type="number" min="1900" formControlName="startYear" />
                </div>
                <div class="form-field">
                  <label for="skEndMonth">End Month (1–12)</label>
                  <input id="skEndMonth" type="number" min="1" max="12" formControlName="endMonth" />
                </div>
                <div class="form-field">
                  <label for="skEndYear">End Year (≥Start Year)</label>
                  <input id="skEndYear" type="number" min="1900" formControlName="endYear" />
                </div>
              </div>
              <button type="submit" class="btn btn-secondary btn-sm" [disabled]="saving()">
                + Add Skill
              </button>
            </form>
          </section>

          <!-- 5. Work History -->
          <section class="card" style="margin-bottom: 1.5rem;" aria-labelledby="work-heading">
            <h2 id="work-heading" class="section-title">5. Work History ({{ workHistories().length }})</h2>

            @if (workHistories().length === 0) {
              <p class="empty-inline">No work history entries added yet.</p>
            } @else {
              <div class="item-list" style="margin-bottom: 1.25rem;">
                @for (wh of workHistories(); track wh.id) {
                  <div class="item-row">
                    <div>
                      <strong>{{ wh.jobTitle }}</strong> at <strong>{{ wh.companyName }}</strong>
                      <div class="item-meta">
                        {{ wh.location }} ({{ wh.countryCode }}) · {{ wh.startMonth }}/{{ wh.startYear }} – {{ wh.endMonth }}/{{ wh.endYear }}
                      </div>
                      <p style="margin: 0.3rem 0 0; font-size: 0.88rem; color: var(--text-secondary);">
                        {{ wh.jobDescription }}
                      </p>
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" (click)="deleteWorkHistory(wh)">
                      Remove
                    </button>
                  </div>
                }
              </div>
            }

            <form [formGroup]="workForm" (ngSubmit)="addWorkHistory()" novalidate>
              <div class="form-grid" style="margin-bottom: 1rem;">
                <div class="form-field">
                  <label for="whCompany">Company Name (&gt;2 chars, Rule 105)</label>
                  <input id="whCompany" type="text" formControlName="companyName" placeholder="MapleCloud Corp" />
                </div>
                <div class="form-field">
                  <label for="whTitle">Job Title</label>
                  <input id="whTitle" type="text" formControlName="jobTitle" placeholder="Software Developer" />
                </div>
                <div class="form-field">
                  <label for="whLocation">City / Location</label>
                  <input id="whLocation" type="text" formControlName="location" placeholder="Toronto, ON" />
                </div>
                <div class="form-field">
                  <label for="whCountry">Country</label>
                  <select id="whCountry" formControlName="countryCode">
                    @for (c of countries(); track c.code) {
                      <option [value]="c.code">{{ c.name }} ({{ c.code }})</option>
                    }
                  </select>
                </div>
                <div class="form-field">
                  <label for="whStartMonth">Start Month (1–12)</label>
                  <input id="whStartMonth" type="number" min="1" max="12" formControlName="startMonth" />
                </div>
                <div class="form-field">
                  <label for="whStartYear">Start Year</label>
                  <input id="whStartYear" type="number" min="1950" formControlName="startYear" />
                </div>
                <div class="form-field">
                  <label for="whEndMonth">End Month (1–12)</label>
                  <input id="whEndMonth" type="number" min="1" max="12" formControlName="endMonth" />
                </div>
                <div class="form-field">
                  <label for="whEndYear">End Year</label>
                  <input id="whEndYear" type="number" min="1950" formControlName="endYear" />
                </div>
              </div>
              <div class="form-field" style="margin-bottom: 1rem;">
                <label for="whDesc">Role Responsibilities</label>
                <textarea id="whDesc" rows="2" formControlName="jobDescription" placeholder="Key accomplishments..."></textarea>
              </div>
              <button type="submit" class="btn btn-secondary btn-sm" [disabled]="saving()">
                + Add Work History
              </button>
            </form>
          </section>

          <!-- 6. Submitted Job Applications -->
          <section class="card" aria-labelledby="apps-heading">
            <h2 id="apps-heading" class="section-title">6. Submitted Job Applications ({{ applications().length }})</h2>
            @if (applications().length === 0) {
              <p class="empty-inline">
                You have not applied to any positions yet. <a routerLink="/jobs">Browse open roles</a> to apply.
              </p>
            } @else {
              <div class="item-list">
                @for (app of applications(); track app.id) {
                  <div class="item-row">
                    <div>
                      <strong>
                        <a [routerLink]="['/jobs', app.job]">{{ resolveJobTitle(app.job) }}</a>
                      </strong>
                      <div class="item-meta">
                        {{ resolveJobCompany(app.job) }} · Applied {{ app.applicationDate | date:'medium' }}
                      </div>
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" (click)="withdrawApplication(app)">
                      Withdraw
                    </button>
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
export class ApplicantPortalComponent implements OnInit {
  private readonly api = inject(CareerCloudApiService);
  private readonly catalog = inject(JobCatalogService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal<boolean>(true);
  readonly saving = signal<boolean>(false);
  readonly statusMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly countries = signal<SystemCountryCodePoco[]>([]);
  readonly profile = signal<ApplicantProfilePoco | null>(null);
  readonly resumeRecord = signal<ApplicantResumePoco | null>(null);
  readonly educations = signal<ApplicantEducationPoco[]>([]);
  readonly skills = signal<ApplicantSkillPoco[]>([]);
  readonly workHistories = signal<ApplicantWorkHistoryPoco[]>([]);
  readonly applications = signal<ApplicantJobApplicationPoco[]>([]);
  readonly jobCatalogMap = signal<Map<string, EnrichedJobView>>(new Map());

  readonly profileForm = this.fb.nonNullable.group({
    currentSalary: [85000, [Validators.required, Validators.min(0)]],
    currentRate: [55, [Validators.required, Validators.min(0)]],
    currency: ['CAD', [Validators.required]],
    country: ['CAN', [Validators.required]],
    province: ['ON', [Validators.required]],
    street: ['100 Queen St W', [Validators.required]],
    city: ['Toronto', [Validators.required]],
    postalCode: ['M5H 2N2', [Validators.required]]
  });

  readonly resumeForm = this.fb.nonNullable.group({
    resume: ['', [Validators.required]]
  });

  readonly educationForm = this.fb.nonNullable.group({
    major: ['', [Validators.required, Validators.minLength(3)]],
    certificateDiploma: ['Bachelor of Science'],
    startDate: ['2019-09-01', [Validators.required]],
    completionDate: ['2023-05-15', [Validators.required]],
    completionPercent: [100, [Validators.min(0), Validators.max(100)]]
  });

  readonly skillForm = this.fb.nonNullable.group({
    skill: ['', [Validators.required]],
    skillLevel: ['Advanced', [Validators.required]],
    startMonth: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    startYear: [2021, [Validators.required, Validators.min(1900)]],
    endMonth: [12, [Validators.required, Validators.min(1), Validators.max(12)]],
    endYear: [2025, [Validators.required, Validators.min(1900)]]
  });

  readonly workForm = this.fb.nonNullable.group({
    companyName: ['', [Validators.required, Validators.minLength(3)]],
    jobTitle: ['', [Validators.required]],
    location: ['Toronto, ON', [Validators.required]],
    countryCode: ['CAN', [Validators.required]],
    startMonth: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    startYear: [2022, [Validators.required]],
    endMonth: [12, [Validators.required, Validators.min(1), Validators.max(12)]],
    endYear: [2025, [Validators.required]],
    jobDescription: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadWorkspace();
  }

  loadWorkspace(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      countries: this.api.getCountries(),
      profiles: this.api.getApplicantProfiles(),
      resumes: this.api.getApplicantResumes(),
      educations: this.api.getApplicantEducations(),
      skills: this.api.getApplicantSkills(),
      workHistories: this.api.getApplicantWorkHistories(),
      applications: this.api.getJobApplications(),
      jobs: this.catalog.loadEnrichedJobs()
    }).subscribe({
      next: (data) => {
        this.countries.set(data.countries);
        const map = new Map<string, EnrichedJobView>();
        for (const j of data.jobs) {
          map.set(j.job.id, j);
        }
        this.jobCatalogMap.set(map);

        const myProfile = data.profiles.find((p) => p.login === user.id) ?? null;
        this.profile.set(myProfile);

        if (myProfile) {
          this.profileForm.patchValue({
            currentSalary: myProfile.currentSalary ?? 0,
            currentRate: myProfile.currentRate ?? 0,
            currency: myProfile.currency ?? 'CAD',
            country: myProfile.country ?? 'CAN',
            province: myProfile.province ?? '',
            street: myProfile.street ?? '',
            city: myProfile.city ?? '',
            postalCode: myProfile.postalCode ?? ''
          });

          const myResume = data.resumes.find((r) => r.applicant === myProfile.id) ?? null;
          this.resumeRecord.set(myResume);
          if (myResume) {
            this.resumeForm.patchValue({ resume: myResume.resume });
          }

          this.educations.set(data.educations.filter((e) => e.applicant === myProfile.id));
          this.skills.set(data.skills.filter((s) => s.applicant === myProfile.id));
          this.workHistories.set(data.workHistories.filter((w) => w.applicant === myProfile.id));
          this.applications.set(data.applications.filter((a) => a.applicant === myProfile.id));
        }

        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(extractApiErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  saveProfile(): void {
    const user = this.auth.currentUser();
    if (!user) {
      return;
    }
    this.saving.set(true);
    this.statusMessage.set(null);
    this.errorMessage.set(null);

    const existing = this.profile();
    const raw = this.profileForm.getRawValue();
    const poco: ApplicantProfilePoco = {
      id: existing?.id ?? newGuid(),
      login: user.id,
      currentSalary: Number(raw.currentSalary),
      currentRate: Number(raw.currentRate),
      currency: raw.currency.trim(),
      country: raw.country,
      province: raw.province.trim(),
      street: raw.street.trim(),
      city: raw.city.trim(),
      postalCode: raw.postalCode.trim()
    };

    const req$ = existing
      ? this.api.updateApplicantProfiles([poco])
      : this.api.createApplicantProfiles([poco]);

    req$.subscribe({
      next: () => {
        this.saving.set(false);
        this.profile.set(poco);
        this.statusMessage.set(existing ? 'Applicant profile updated.' : 'Applicant profile created.');
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(extractApiErrorMessage(err));
      }
    });
  }

  saveResume(): void {
    const prof = this.profile();
    if (!prof) {
      return;
    }
    const existing = this.resumeRecord();
    const text = this.resumeForm.getRawValue().resume.trim();

    this.saving.set(true);
    this.statusMessage.set(null);
    this.errorMessage.set(null);

    const poco: ApplicantResumePoco = {
      id: existing?.id ?? newGuid(),
      applicant: prof.id,
      resume: text,
      lastUpdated: new Date().toISOString()
    };

    const req$ = existing
      ? this.api.updateApplicantResumes([poco])
      : this.api.createApplicantResumes([poco]);

    req$.subscribe({
      next: () => {
        this.saving.set(false);
        this.resumeRecord.set(poco);
        this.statusMessage.set('Resume saved.');
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(extractApiErrorMessage(err));
      }
    });
  }

  addEducation(): void {
    const prof = this.profile();
    if (!prof) {
      return;
    }
    const raw = this.educationForm.getRawValue();
    const poco: ApplicantEducationPoco = {
      id: newGuid(),
      applicant: prof.id,
      major: raw.major.trim(),
      certificateDiploma: raw.certificateDiploma.trim(),
      startDate: raw.startDate ? new Date(raw.startDate).toISOString() : null,
      completionDate: raw.completionDate ? new Date(raw.completionDate).toISOString() : null,
      completionPercent: Number(raw.completionPercent)
    };

    this.saving.set(true);
    this.statusMessage.set(null);
    this.errorMessage.set(null);

    this.api.createApplicantEducations([poco]).subscribe({
      next: () => {
        this.saving.set(false);
        this.educations.set([...this.educations(), poco]);
        this.educationForm.patchValue({ major: '' });
        this.statusMessage.set('Education credential added.');
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(extractApiErrorMessage(err));
      }
    });
  }

  deleteEducation(ed: ApplicantEducationPoco): void {
    this.api.deleteApplicantEducations([ed]).subscribe({
      next: () => {
        this.educations.set(this.educations().filter((item) => item.id !== ed.id));
        this.statusMessage.set('Education entry removed.');
      },
      error: (err) => this.errorMessage.set(extractApiErrorMessage(err))
    });
  }

  addSkill(): void {
    const prof = this.profile();
    if (!prof) {
      return;
    }
    const raw = this.skillForm.getRawValue();
    const poco: ApplicantSkillPoco = {
      id: newGuid(),
      applicant: prof.id,
      skill: raw.skill.trim(),
      skillLevel: raw.skillLevel,
      startMonth: Number(raw.startMonth),
      startYear: Number(raw.startYear),
      endMonth: Number(raw.endMonth),
      endYear: Number(raw.endYear)
    };

    this.saving.set(true);
    this.statusMessage.set(null);
    this.errorMessage.set(null);

    this.api.createApplicantSkills([poco]).subscribe({
      next: () => {
        this.saving.set(false);
        this.skills.set([...this.skills(), poco]);
        this.skillForm.patchValue({ skill: '' });
        this.statusMessage.set('Technical skill added.');
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(extractApiErrorMessage(err));
      }
    });
  }

  deleteSkill(sk: ApplicantSkillPoco): void {
    this.api.deleteApplicantSkills([sk]).subscribe({
      next: () => {
        this.skills.set(this.skills().filter((item) => item.id !== sk.id));
        this.statusMessage.set('Skill removed.');
      },
      error: (err) => this.errorMessage.set(extractApiErrorMessage(err))
    });
  }

  addWorkHistory(): void {
    const prof = this.profile();
    if (!prof) {
      return;
    }
    const raw = this.workForm.getRawValue();
    const poco: ApplicantWorkHistoryPoco = {
      id: newGuid(),
      applicant: prof.id,
      companyName: raw.companyName.trim(),
      jobTitle: raw.jobTitle.trim(),
      location: raw.location.trim(),
      countryCode: raw.countryCode,
      startMonth: Number(raw.startMonth),
      startYear: Number(raw.startYear),
      endMonth: Number(raw.endMonth),
      endYear: Number(raw.endYear),
      jobDescription: raw.jobDescription.trim()
    };

    this.saving.set(true);
    this.statusMessage.set(null);
    this.errorMessage.set(null);

    this.api.createApplicantWorkHistories([poco]).subscribe({
      next: () => {
        this.saving.set(false);
        this.workHistories.set([...this.workHistories(), poco]);
        this.workForm.patchValue({ companyName: '', jobTitle: '', jobDescription: '' });
        this.statusMessage.set('Work history entry added.');
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(extractApiErrorMessage(err));
      }
    });
  }

  deleteWorkHistory(wh: ApplicantWorkHistoryPoco): void {
    this.api.deleteApplicantWorkHistories([wh]).subscribe({
      next: () => {
        this.workHistories.set(this.workHistories().filter((item) => item.id !== wh.id));
        this.statusMessage.set('Work history removed.');
      },
      error: (err) => this.errorMessage.set(extractApiErrorMessage(err))
    });
  }

  withdrawApplication(app: ApplicantJobApplicationPoco): void {
    this.api.deleteJobApplications([app]).subscribe({
      next: () => {
        this.applications.set(this.applications().filter((item) => item.id !== app.id));
        this.statusMessage.set('Job application withdrawn.');
      },
      error: (err) => this.errorMessage.set(extractApiErrorMessage(err))
    });
  }

  resolveJobTitle(jobId: string): string {
    return this.jobCatalogMap().get(jobId)?.title ?? `Job #${jobId.slice(0, 8)}`;
  }

  resolveJobCompany(jobId: string): string {
    return this.jobCatalogMap().get(jobId)?.companyName ?? 'Employer';
  }
}
