import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { CareerCloudApiService } from './career-cloud-api.service';
import { EnrichedJobView } from '../models/career-cloud.models';

@Injectable({
  providedIn: 'root'
})
export class JobCatalogService {
  private readonly api = inject(CareerCloudApiService);

  loadEnrichedJobs(): Observable<EnrichedJobView[]> {
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

            return {
              job,
              description,
              companyProfile,
              companyDescription: preferredDesc,
              locations: companyLocations,
              skills,
              educations,
              title: description?.jobName || 'Untitled Position',
              summary: description?.jobDescriptions || 'No description provided.',
              companyName,
              locationLabel
            };
          })
          .sort((a, b) => new Date(b.job.profileCreated).getTime() - new Date(a.job.profileCreated).getTime());
      })
    );
  }

  getEnrichedJobById(jobId: string): Observable<EnrichedJobView | null> {
    return this.loadEnrichedJobs().pipe(
      map((items) => items.find((item) => item.job.id === jobId) ?? null)
    );
  }
}
