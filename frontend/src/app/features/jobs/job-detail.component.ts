import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobCatalogService } from '../../core/services/job-catalog.service';
import { CareerCloudApiService } from '../../core/services/career-cloud-api.service';
import { AuthService } from '../../core/services/auth.service';
import { EnrichedJobView } from '../../core/models/career-cloud.models';
import { extractApiErrorMessage, newGuid } from '../../core/utils/guid.util';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <a routerLink="/jobs" class="back-link">← Back to Job Listings</a>
        @if (jobView(); as item) {
          <h1>{{ item.title }}</h1>
          <p>{{ item.companyName }} · {{ item.locationLabel }} · Posted {{ item.job.profileCreated | date:'mediumDate' }}</p>
        } @else {
          <h1>Job Opportunity Details</h1>
        }
      </div>
    </section>

    <div class="container" style="padding-bottom: 3rem;">
      @if (loading()) {
        <div class="state-box" role="status" aria-live="polite">
          <h3>Loading job details...</h3>
          <p>Retrieving position requirements and company overview from CareerCloud.WebAPI.</p>
        </div>
      } @else if (errorMessage()) {
        <div class="alert alert-error" role="alert">
          {{ errorMessage() }}
        </div>
      } @else if (!jobView()) {
        <div class="state-box">
          <h3>Job Posting Not Found</h3>
          <p>This job posting may have been removed or the ID is invalid.</p>
          <a routerLink="/jobs" class="btn btn-primary">Browse All Jobs</a>
        </div>
      } @else if (jobView(); as item) {
        @if (applySuccess()) {
          <div class="alert alert-success" role="status">
            {{ applySuccess() }}
          </div>
        }
        @if (applyError()) {
          <div class="alert alert-error" role="alert">
            {{ applyError() }}
          </div>
        }

        <div class="detail-grid">
          <div class="detail-main">
            <article class="card" style="margin-bottom: 1.25rem;">
              <h2 class="section-heading">Role Description</h2>
              <p class="body-copy">{{ item.summary }}</p>
            </article>

            <article class="card" style="margin-bottom: 1.25rem;">
              <h2 class="section-heading">Required Technical Skills</h2>
              @if (item.skills.length === 0) {
                <p class="muted-copy">No specific skill requirements listed for this position.</p>
              } @else {
                <ul class="req-list">
                  @for (sk of item.skills; track sk.id) {
                    <li>
                      <div>
                        <strong>{{ sk.skill }}</strong>
                        <span class="muted-copy"> · Level: {{ sk.skillLevel }}</span>
                      </div>
                      <span class="badge">Importance {{ sk.importance }}/10</span>
                    </li>
                  }
                </ul>
              }
            </article>

            <article class="card">
              <h2 class="section-heading">Education Requirements</h2>
              @if (item.educations.length === 0) {
                <p class="muted-copy">No specific academic major requirements listed for this position.</p>
              } @else {
                <ul class="req-list">
                  @for (ed of item.educations; track ed.id) {
                    <li>
                      <div>
                        <strong>{{ ed.major }}</strong>
                      </div>
                      <span class="badge badge-neutral">Importance {{ ed.importance }}/10</span>
                    </li>
                  }
                </ul>
              }
            </article>
          </div>

          <aside class="detail-sidebar">
            <div class="card" style="margin-bottom: 1.25rem;">
              <h2 class="section-heading">Apply for this Position</h2>
              <p class="muted-copy" style="margin-bottom: 1rem;">
                Submit your application directly via <code>POST /applicant/v1/jobapplication</code>.
              </p>

              @if (alreadyApplied()) {
                <div class="alert alert-success" style="margin-bottom: 0;">
                  You have already applied to this role. View all submissions in your
                  <a routerLink="/applicant">Applicant Workspace</a>.
                </div>
              } @else {
                <button
                  type="button"
                  class="btn btn-primary"
                  style="width: 100%;"
                  [disabled]="applying() || item.job.isInactive"
                  (click)="applyForJob(item)"
                >
                  @if (applying()) {
                    Submitting Application...
                  } @else if (!auth.isAuthenticated()) {
                    Sign In to Apply
                  } @else {
                    Submit Application Now
                  }
                </button>
              }
            </div>

            <div class="card">
              <h2 class="section-heading">About {{ item.companyName }}</h2>
              @if (item.companyDescription) {
                <p class="body-copy" style="margin-bottom: 1rem;">
                  {{ item.companyDescription.companyDescription }}
                </p>
              }
              @if (item.companyProfile && !item.job.isCompanyHidden) {
                <dl class="meta-dl">
                  <div>
                    <dt>Website</dt>
                    <dd>
                      <a [href]="item.companyProfile.companyWebsite" target="_blank" rel="noopener">
                        {{ item.companyProfile.companyWebsite }}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Contact</dt>
                    <dd>{{ item.companyProfile.contactName || 'HR Team' }} ({{ item.companyProfile.contactPhone }})</dd>
                  </div>
                </dl>
              }
              @if (item.locations.length > 0) {
                <div style="margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1px solid var(--border-color);">
                  <strong style="font-size: 0.85rem;">Office Locations</strong>
                  @for (loc of item.locations; track loc.id) {
                    <p class="muted-copy" style="margin: 0.25rem 0 0;">
                      {{ loc.street }}, {{ loc.city }}, {{ loc.province }} {{ loc.postalCode }} ({{ loc.countryCode }})
                    </p>
                  }
                </div>
              }
            </div>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [`
    .back-link {
      display: inline-block;
      font-size: 0.88rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 1.5rem;
      align-items: start;
    }
    .section-heading {
      margin: 0 0 0.75rem;
      font-size: 1.12rem;
    }
    .body-copy {
      margin: 0;
      color: var(--text-primary);
      white-space: pre-line;
    }
    .muted-copy {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0;
    }
    .req-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .req-list li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 0.85rem;
      background: var(--bg-muted);
      border-radius: var(--radius-sm);
    }
    .meta-dl {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.88rem;
    }
    .meta-dl dt {
      font-weight: 600;
      color: var(--text-secondary);
    }
    .meta-dl dd {
      margin: 0;
      color: var(--text-primary);
    }
    @media (max-width: 840px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalog = inject(JobCatalogService);
  private readonly api = inject(CareerCloudApiService);
  readonly auth = inject(AuthService);

  readonly jobView = signal<EnrichedJobView | null>(null);
  readonly loading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly applying = signal<boolean>(false);
  readonly alreadyApplied = signal<boolean>(false);
  readonly applySuccess = signal<string | null>(null);
  readonly applyError = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }

    this.catalog.getEnrichedJobById(id).subscribe({
      next: (view) => {
        this.jobView.set(view);
        this.loading.set(false);
        this.checkExistingApplication(id);
      },
      error: (err) => {
        this.errorMessage.set(extractApiErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  private checkExistingApplication(jobId: string): void {
    const user = this.auth.currentUser();
    if (!user) {
      return;
    }
    this.api.getApplicantProfiles().subscribe({
      next: (profiles) => {
        const profile = profiles.find((p) => p.login === user.id);
        if (!profile) {
          return;
        }
        this.api.getJobApplications().subscribe({
          next: (apps) => {
            const exists = apps.some((a) => a.applicant === profile.id && a.job === jobId);
            this.alreadyApplied.set(exists);
          }
        });
      }
    });
  }

  applyForJob(item: EnrichedJobView): void {
    this.applySuccess.set(null);
    this.applyError.set(null);

    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: `/jobs/${item.job.id}` } });
      return;
    }

    this.applying.set(true);
    this.api.getApplicantProfiles().subscribe({
      next: (profiles) => {
        const profile = profiles.find((p) => p.login === user.id);
        if (!profile) {
          this.applying.set(false);
          this.applyError.set(
            'Please create your Applicant Profile in the Applicant Workspace before submitting a job application.'
          );
          return;
        }

        const appPoco = {
          id: newGuid(),
          applicant: profile.id,
          job: item.job.id,
          applicationDate: new Date(Date.now() - 60_000).toISOString()
        };

        this.api.createJobApplications([appPoco]).subscribe({
          next: () => {
            this.applying.set(false);
            this.alreadyApplied.set(true);
            this.applySuccess.set(`Application submitted to ${item.companyName} for "${item.title}".`);
          },
          error: (err) => {
            this.applying.set(false);
            this.applyError.set(extractApiErrorMessage(err));
          }
        });
      },
      error: (err) => {
        this.applying.set(false);
        this.applyError.set(extractApiErrorMessage(err));
      }
    });
  }
}
