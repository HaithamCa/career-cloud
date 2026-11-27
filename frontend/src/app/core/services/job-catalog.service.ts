import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { CareerCloudApiService } from './career-cloud-api.service';
import { EnrichedJobView } from '../models/career-cloud.models';

interface RemotiveJobItem {
  id: number;
  url: string;
  title: string;
  company_name: string;
  category: string;
  tags?: string[];
  job_type?: string;
  publication_date: string;
  candidate_required_location?: string;
  salary?: string;
  description: string;
}

interface RemotiveApiResponse {
  jobs?: RemotiveJobItem[];
}

interface ArbeitnowJobItem {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags?: string[];
  job_types?: string[];
  location?: string;
  created_at?: number;
}

interface ArbeitnowApiResponse {
  data?: ArbeitnowJobItem[];
}

function htmlToPlainText(html: string): string {
  if (!html) return '';
  const withLineBreaks = html
    .replace(/<\/(p|div|h1|h2|h3|h4|li|tr)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<br\s*\/?>/gi, '\n');

  if (typeof document !== 'undefined') {
    const tmp = document.createElement('div');
    tmp.innerHTML = withLineBreaks;
    const text = tmp.textContent || tmp.innerText || '';
    return text.replace(/\n{3,}/g, '\n\n').trim();
  }

  return withLineBreaks
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeShortSummary(text: string, maxLen = 240): string {
  const singleLine = text.replace(/\s+/g, ' ').trim();
  if (singleLine.length <= maxLen) {
    return singleLine;
  }
  return singleLine.slice(0, maxLen).trimEnd() + '…';
}

@Injectable({
  providedIn: 'root'
})
export class JobCatalogService {
  private readonly api = inject(CareerCloudApiService);
  private readonly http = inject(HttpClient);
  private readonly externalJobsCache = new Map<string, EnrichedJobView>();

  loadEnrichedJobs(searchQuery = ''): Observable<EnrichedJobView[]> {
    return forkJoin({
      internal: this.loadInternalJobs(),
      remotive: this.fetchRemotiveJobs(searchQuery),
      arbeitnow: this.fetchArbeitnowJobs()
    }).pipe(
      map(({ internal, remotive, arbeitnow }) => {
        const mergedMap = new Map<string, EnrichedJobView>();
        for (const item of [...internal, ...remotive, ...arbeitnow]) {
          mergedMap.set(item.job.id, item);
        }
        for (const ext of this.externalJobsCache.values()) {
          if (!mergedMap.has(ext.job.id)) {
            mergedMap.set(ext.job.id, ext);
          }
        }
        return Array.from(mergedMap.values());
      })
    );
  }

  searchLiveExternalJobs(query: string): Observable<EnrichedJobView[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return of(Array.from(this.externalJobsCache.values()));
    }
    return this.fetchRemotiveJobs(trimmed);
  }

  getEnrichedJobById(jobId: string): Observable<EnrichedJobView | null> {
    const cached = this.externalJobsCache.get(jobId);
    if (cached) {
      return of(cached);
    }
    return this.loadEnrichedJobs().pipe(
      map((items) => items.find((item) => item.job.id === jobId) ?? this.externalJobsCache.get(jobId) ?? null)
    );
  }

  private loadInternalJobs(): Observable<EnrichedJobView[]> {
    return forkJoin({
      jobs: this.api.getCompanyJobs(),
      jobDescriptions: this.api.getCompanyJobDescriptions(),
      jobSkills: this.api.getCompanyJobSkills(),
      jobEducations: this.api.getCompanyJobEducations(),
      companies: this.api.getCompanyProfiles(),
      companyDescriptions: this.api.getCompanyDescriptions(),
      locations: this.api.getCompanyLocations()
    }).pipe(
      map(({ jobs, jobDescriptions, jobSkills, jobEducations, companies, companyDescriptions, locations }) => {
        return jobs
          .map((job): EnrichedJobView => {
            const description = jobDescriptions.find((d) => d.job === job.id) ?? null;
            const companyProfile = companies.find((c) => c.id === job.company) ?? null;
            const companyDescs = companyDescriptions.filter((cd) => cd.company === job.company);
            const preferredDesc =
              companyDescs.find((cd) => cd.languageId?.toUpperCase() === 'EN') ?? companyDescs[0] ?? null;
            const companyLocations = locations.filter((l) => l.company === job.company);
            const skills = jobSkills.filter((s) => s.job === job.id);
            const educations = jobEducations.filter((e) => e.job === job.id);

            const primaryLoc = companyLocations[0];
            const locationLabel = primaryLoc
              ? [primaryLoc.city?.trim(), primaryLoc.province?.trim(), primaryLoc.countryCode?.trim()]
                  .filter(Boolean)
                  .join(', ')
              : 'Remote / Flexible';

            const companyName = job.isCompanyHidden
              ? 'Confidential Employer'
              : preferredDesc?.companyName || companyProfile?.companyWebsite || 'Employer';

            const fullText = description?.jobDescriptions || 'No description provided.';

            return {
              job,
              description,
              companyProfile,
              companyDescription: preferredDesc,
              locations: companyLocations,
              skills,
              educations,
              title: description?.jobName || 'Untitled Position',
              summary: makeShortSummary(fullText, 240),
              fullDescription: fullText,
              companyName,
              locationLabel,
              source: 'CareerCloud'
            };
          })
          .sort((a, b) => new Date(b.job.profileCreated).getTime() - new Date(a.job.profileCreated).getTime());
      }),
      catchError(() => of([]))
    );
  }

  private fetchRemotiveJobs(searchQuery = ''): Observable<EnrichedJobView[]> {
    const qParam = searchQuery.trim()
      ? `&search=${encodeURIComponent(searchQuery.trim())}`
      : '';
    const url = `https://remotive.com/api/remote-jobs?limit=25${qParam}`;

    return this.http.get<RemotiveApiResponse>(url).pipe(
      map((res) => (res.jobs ?? []).map((item) => this.mapRemotiveJob(item))),
      tap((mapped) => {
        for (const item of mapped) {
          this.externalJobsCache.set(item.job.id, item);
        }
      }),
      catchError(() => of([]))
    );
  }

  private fetchArbeitnowJobs(): Observable<EnrichedJobView[]> {
    const url = 'https://www.arbeitnow.com/api/job-board-api';

    return this.http.get<ArbeitnowApiResponse>(url).pipe(
      map((res) => (res.data ?? []).slice(0, 20).map((item) => this.mapArbeitnowJob(item))),
      tap((mapped) => {
        for (const item of mapped) {
          this.externalJobsCache.set(item.job.id, item);
        }
      }),
      catchError(() => of([]))
    );
  }

  private mapRemotiveJob(item: RemotiveJobItem): EnrichedJobView {
    const jobId = `remotive-${item.id}`;
    const companyId = `remotive-company-${item.id}`;
    const plainDescription = htmlToPlainText(item.description);
    const createdIso = item.publication_date
      ? new Date(item.publication_date).toISOString()
      : new Date().toISOString();
    const rawTags = item.tags && item.tags.length > 0 ? item.tags.slice(0, 5) : [item.category || 'Remote'];

    const skills = rawTags.map((tag, idx) => ({
      id: `${jobId}-skill-${idx}`,
      job: jobId,
      skill: tag,
      skillLevel: idx === 0 ? 'Advanced' : 'Intermediate',
      importance: Math.max(6, 10 - idx)
    }));

    const locationLabel = item.candidate_required_location?.trim() || 'Remote Worldwide';

    return {
      job: {
        id: jobId,
        company: companyId,
        profileCreated: createdIso,
        isInactive: false,
        isCompanyHidden: false
      },
      description: {
        id: `${jobId}-desc`,
        job: jobId,
        jobName: item.title,
        jobDescriptions: plainDescription
      },
      companyProfile: {
        id: companyId,
        companyWebsite: item.url,
        contactPhone: 'Remote / Online Application',
        registrationDate: createdIso,
        contactName: `${item.company_name} Talent Team`
      },
      companyDescription: {
        id: `${companyId}-desc`,
        company: companyId,
        languageId: 'EN',
        companyName: item.company_name,
        companyDescription: `${item.company_name} — ${item.category || 'Technology'} employer hiring via Remotive.`
      },
      locations: [
        {
          id: `${companyId}-loc`,
          company: companyId,
          countryCode: 'REM',
          province: item.job_type || 'Remote',
          street: 'Remote Work',
          city: locationLabel,
          postalCode: ''
        }
      ],
      skills,
      educations: [],
      title: item.title,
      summary: makeShortSummary(plainDescription, 240),
      fullDescription: plainDescription,
      companyName: item.company_name,
      locationLabel,
      source: 'Remotive API',
      externalUrl: item.url,
      salary: item.salary
    };
  }

  private mapArbeitnowJob(item: ArbeitnowJobItem): EnrichedJobView {
    const jobId = `arbeitnow-${item.slug}`;
    const companyId = `arbeitnow-company-${item.slug}`;
    const plainDescription = htmlToPlainText(item.description);
    const createdIso = item.created_at
      ? new Date(item.created_at * 1000).toISOString()
      : new Date().toISOString();
    const rawTags = item.tags && item.tags.length > 0 ? item.tags.slice(0, 5) : ['Software & Business'];

    const skills = rawTags.map((tag, idx) => ({
      id: `${jobId}-skill-${idx}`,
      job: jobId,
      skill: tag,
      skillLevel: idx === 0 ? 'Advanced' : 'Intermediate',
      importance: Math.max(6, 10 - idx)
    }));

    const locationLabel = item.remote
      ? `${item.location || 'Europe'} (Remote)`
      : item.location || 'Flexible';

    return {
      job: {
        id: jobId,
        company: companyId,
        profileCreated: createdIso,
        isInactive: false,
        isCompanyHidden: false
      },
      description: {
        id: `${jobId}-desc`,
        job: jobId,
        jobName: item.title,
        jobDescriptions: plainDescription
      },
      companyProfile: {
        id: companyId,
        companyWebsite: item.url,
        contactPhone: 'Online Application',
        registrationDate: createdIso,
        contactName: `${item.company_name} Recruiting`
      },
      companyDescription: {
        id: `${companyId}-desc`,
        company: companyId,
        languageId: 'EN',
        companyDescription: `${item.company_name} — Live opening sourced via Arbeitnow Job Board API.`,
        companyName: item.company_name
      },
      locations: [
        {
          id: `${companyId}-loc`,
          company: companyId,
          countryCode: 'INT',
          province: item.remote ? 'Remote' : 'On-site',
          street: item.location || 'Global Office',
          city: item.location || 'Remote',
          postalCode: ''
        }
      ],
      skills,
      educations: [],
      title: item.title,
      summary: makeShortSummary(plainDescription, 240),
      fullDescription: plainDescription,
      companyName: item.company_name,
      locationLabel,
      source: 'Arbeitnow API',
      externalUrl: item.url
    };
  }
}
