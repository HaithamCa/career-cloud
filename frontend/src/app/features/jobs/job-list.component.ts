import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobCatalogService } from '../../core/services/job-catalog.service';
import { EnrichedJobView } from '../../core/models/career-cloud.models';
import { extractApiErrorMessage } from '../../core/utils/guid.util';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-header">
      <div class="container">
        <h1>Explore Open Positions</h1>
        <p>Search verified engineering, finance, and enterprise roles directly from the CareerCloud API.</p>
      </div>
    </section>

    <div class="container" style="padding-bottom: 3rem;">
      <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" class="card filter-bar" aria-label="Filter jobs">
        <div class="form-grid">
          <div class="form-field">
            <label for="searchQuery">Keyword, Title, or Skill</label>
            <input
              id="searchQuery"
              type="search"
              formControlName="query"
              placeholder="e.g. .NET, Angular, Architect..."
              (input)="applyFilters()"
            />
          </div>

          <div class="form-field">
            <label for="locationFilter">Location</label>
            <select id="locationFilter" formControlName="location" (change)="applyFilters()">
              <option value="">All locations</option>
              @for (loc of availableLocations(); track loc) {
                <option [value]="loc">{{ loc }}</option>
              }
            </select>
          </div>

          <div class="form-field">
            <label for="skillFilter">Required Skill</label>
            <select id="skillFilter" formControlName="skill" (change)="applyFilters()">
              <option value="">All skills</option>
              @for (sk of availableSkills(); track sk) {
                <option [value]="sk">{{ sk }}</option>
              }
            </select>
          </div>

          <div class="form-field">
            <label for="statusFilter">Listing Status</label>
            <select id="statusFilter" formControlName="includeInactive" (change)="applyFilters()">
              <option value="active">Active roles only</option>
              <option value="all">Include inactive roles</option>
            </select>
          </div>
        </div>

        <div class="filter-actions">
          <span class="results-summary" aria-live="polite">
            Showing {{ pagedJobs().length }} of {{ filteredJobs().length }} matching roles
          </span>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn btn-secondary btn-sm" (click)="resetFilters()">
              Clear Filters
            </button>
            <button type="button" class="btn btn-secondary btn-sm" (click)="loadJobs()">
              Refresh
            </button>
          </div>
        </div>
      </form>

      @if (loading()) {
        <div class="state-box" role="status" aria-live="polite">
          <h3>Loading job postings...</h3>
          <p>Fetching live jobs, descriptions, skills, and company locations from CareerCloud.WebAPI.</p>
        </div>
      } @else if (errorMessage()) {
        <div class="alert alert-error" role="alert">
          <strong>Unable to load jobs:</strong> {{ errorMessage() }}
          <div style="margin-top: 0.75rem;">
            <button type="button" class="btn btn-secondary btn-sm" (click)="loadJobs()">Retry Request</button>
          </div>
        </div>
      } @else if (filteredJobs().length === 0) {
        <div class="state-box">
          <h3>No matching job postings found</h3>
          <p>Try broadening your keyword search, clearing filters, or posting a new role in the Employer portal.</p>
          <button type="button" class="btn btn-secondary btn-sm" (click)="resetFilters()">Reset Filters</button>
        </div>
      } @else {
        <div class="jobs-stack">
          @for (item of pagedJobs(); track item.job.id) {
            <article class="card job-card">
              <div class="job-card-main">
                <div class="job-meta-top">
                  <span class="company-label">{{ item.companyName }}</span>
                  <span class="meta-dot">•</span>
                  <span>{{ item.locationLabel }}</span>
                  <span class="meta-dot">•</span>
                  <span>Posted {{ item.job.profileCreated | date:'mediumDate' }}</span>
                  @if (item.job.isInactive) {
                    <span class="badge badge-neutral">Inactive</span>
                  } @else {
                    <span class="badge">Active</span>
                  }
                </div>

                <h2 class="job-title">
                  <a [routerLink]="['/jobs', item.job.id]">{{ item.title }}</a>
                </h2>

                <p class="job-summary">{{ item.summary }}</p>

                @if (item.skills.length > 0 || item.educations.length > 0) {
                  <div class="tag-row" aria-label="Requirements">
                    @for (sk of item.skills; track sk.id) {
                      <span class="badge">{{ sk.skill }} ({{ sk.skillLevel }})</span>
                    }
                    @for (ed of item.educations; track ed.id) {
                      <span class="badge badge-neutral">Major: {{ ed.major }}</span>
                    }
                  </div>
                }
              </div>

              <div class="job-card-aside">
                <a [routerLink]="['/jobs', item.job.id]" class="btn btn-primary">
                  View Details
                </a>
              </div>
            </article>
          }
        </div>

        @if (totalPages() > 1) {
          <nav class="pagination-bar" aria-label="Job results pagination">
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              [disabled]="currentPage() <= 1"
              (click)="goToPage(currentPage() - 1)"
            >
              Previous
            </button>
            <span class="page-indicator">
              Page {{ currentPage() }} of {{ totalPages() }}
            </span>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              [disabled]="currentPage() >= totalPages()"
              (click)="goToPage(currentPage() + 1)"
            >
              Next
            </button>
          </nav>
        }
      }
    </div>
  `,
  styles: [`
    .filter-bar {
      margin-bottom: 1.5rem;
    }
    .filter-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 0.85rem;
      border-top: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .results-summary {
      font-size: 0.86rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .jobs-stack {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .job-card {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .job-card:hover {
      border-color: var(--brand);
      box-shadow: var(--shadow-md);
    }
    .job-card-main {
      flex: 1;
    }
    .job-meta-top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.84rem;
      color: var(--text-secondary);
      margin-bottom: 0.35rem;
    }
    .company-label {
      font-weight: 600;
      color: var(--text-primary);
    }
    .meta-dot {
      color: var(--text-muted);
    }
    .job-title {
      margin: 0 0 0.45rem;
      font-size: 1.2rem;
    }
    .job-title a {
      color: var(--text-primary);
    }
    .job-title a:hover {
      color: var(--brand);
    }
    .job-summary {
      margin: 0 0 0.9rem;
      color: var(--text-secondary);
      font-size: 0.94rem;
    }
    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }
    .job-card-aside {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .pagination-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .page-indicator {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    @media (max-width: 680px) {
      .job-card {
        flex-direction: column;
      }
      .job-card-aside,
      .job-card-aside .btn {
        width: 100%;
      }
    }
  `]
})
export class JobListComponent implements OnInit {
  private readonly catalog = inject(JobCatalogService);
  private readonly fb = inject(FormBuilder);

  readonly allJobs = signal<EnrichedJobView[]>([]);
  readonly loading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly currentPage = signal<number>(1);
  readonly pageSize = 5;

  readonly filterForm = this.fb.nonNullable.group({
    query: [''],
    location: [''],
    skill: [''],
    includeInactive: ['active']
  });

  private readonly filterState = signal(this.filterForm.getRawValue());

  readonly availableLocations = computed(() => {
    const set = new Set<string>();
    for (const item of this.allJobs()) {
      if (item.locationLabel) {
        set.add(item.locationLabel);
      }
    }
    return Array.from(set).sort();
  });

  readonly availableSkills = computed(() => {
    const set = new Set<string>();
    for (const item of this.allJobs()) {
      for (const sk of item.skills) {
        if (sk.skill) {
          set.add(sk.skill);
        }
      }
    }
    return Array.from(set).sort();
  });

  readonly filteredJobs = computed(() => {
    const f = this.filterState();
    const q = f.query.trim().toLowerCase();

    return this.allJobs().filter((item) => {
      if (f.includeInactive === 'active' && item.job.isInactive) {
        return false;
      }
      if (f.location && item.locationLabel !== f.location) {
        return false;
      }
      if (f.skill && !item.skills.some((s) => s.skill === f.skill)) {
        return false;
      }
      if (q) {
        const haystack = [
          item.title,
          item.summary,
          item.companyName,
          item.locationLabel,
          ...item.skills.map((s) => s.skill),
          ...item.educations.map((e) => e.major)
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) {
          return false;
        }
      }
      return true;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredJobs().length / this.pageSize))
  );

  readonly pagedJobs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredJobs().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.catalog.loadEnrichedJobs().subscribe({
      next: (jobs) => {
        this.allJobs.set(jobs);
        this.loading.set(false);
        this.currentPage.set(1);
      },
      error: (err) => {
        this.errorMessage.set(extractApiErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.filterState.set(this.filterForm.getRawValue());
    this.currentPage.set(1);
  }

  resetFilters(): void {
    this.filterForm.reset({
      query: '',
      location: '',
      skill: '',
      includeInactive: 'active'
    });
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
