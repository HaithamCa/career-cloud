import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ApplicantEducationPoco,
  ApplicantJobApplicationPoco,
  ApplicantProfilePoco,
  ApplicantResumePoco,
  ApplicantSkillPoco,
  ApplicantWorkHistoryPoco,
  CompanyDescriptionPoco,
  CompanyJobDescriptionPoco,
  CompanyJobEducationPoco,
  CompanyJobPoco,
  CompanyJobSkillPoco,
  CompanyLocationPoco,
  CompanyProfilePoco,
  SecurityLoginPoco,
  SecurityLoginsLogPoco,
  SecurityLoginsRolePoco,
  SecurityRolePoco,
  SystemCountryCodePoco,
  SystemLanguageCodePoco
} from '../models/career-cloud.models';
import { newGuid } from '../utils/guid.util';

const STORAGE_KEY = 'careercloud_browser_db_v1';

interface BrowserDbState {
  countries: SystemCountryCodePoco[];
  languages: SystemLanguageCodePoco[];
  roles: SecurityRolePoco[];
  logins: SecurityLoginPoco[];
  loginRoles: SecurityLoginsRolePoco[];
  loginLogs: SecurityLoginsLogPoco[];
  applicantProfiles: ApplicantProfilePoco[];
  applicantEducations: ApplicantEducationPoco[];
  applicantSkills: ApplicantSkillPoco[];
  applicantWorkHistories: ApplicantWorkHistoryPoco[];
  applicantResumes: ApplicantResumePoco[];
  jobApplications: ApplicantJobApplicationPoco[];
  companyProfiles: CompanyProfilePoco[];
  companyDescriptions: CompanyDescriptionPoco[];
  companyLocations: CompanyLocationPoco[];
  companyJobs: CompanyJobPoco[];
  companyJobDescriptions: CompanyJobDescriptionPoco[];
  companyJobSkills: CompanyJobSkillPoco[];
  companyJobEducations: CompanyJobEducationPoco[];
}

function createInitialSeedState(): BrowserDbState {
  const applicantRoleId = '11111111-1111-1111-1111-111111111111';
  const employerRoleId = '22222222-2222-2222-2222-222222222222';
  const company1Id = '33333333-3333-3333-3333-333333333333';
  const company2Id = '44444444-4444-4444-4444-444444444444';
  const job1Id = '55555555-5555-5555-5555-555555555555';
  const job2Id = '66666666-6666-6666-6666-666666666666';
  const job3Id = '77777777-7777-7777-7777-777777777777';
  const demoApplicantLoginId = '88888888-8888-8888-8888-888888888888';
  const demoEmployerLoginId = '99999999-9999-9999-9999-999999999999';
  const demoApplicantProfileId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  const now = Date.now();
  const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

  return {
    countries: [
      { code: 'CAN', name: 'Canada' },
      { code: 'USA', name: 'United States' },
      { code: 'GBR', name: 'United Kingdom' }
    ],
    languages: [
      { languageID: 'EN', name: 'English', nativeName: 'English' },
      { languageID: 'FR', name: 'French', nativeName: 'Français' },
      { languageID: 'ES', name: 'Spanish', nativeName: 'Español' }
    ],
    roles: [
      { id: applicantRoleId, role: 'Applicant', isInactive: false },
      { id: employerRoleId, role: 'Employer', isInactive: false }
    ],
    logins: [
      {
        id: demoApplicantLoginId,
        login: 'applicant_demo',
        password: 'Career$2026',
        created: daysAgo(30),
        agreementAccepted: daysAgo(30),
        isLocked: false,
        isInactive: false,
        emailAddress: 'applicant@careercloud.ca',
        phoneNumber: '416-555-0111',
        fullName: 'Alex Rivera',
        forceChangePassword: false,
        prefferredLanguage: 'EN'
      },
      {
        id: demoEmployerLoginId,
        login: 'employer_demo',
        password: 'Career$2026',
        created: daysAgo(60),
        agreementAccepted: daysAgo(60),
        isLocked: false,
        isInactive: false,
        emailAddress: 'recruiter@maplecloud.ca',
        phoneNumber: '416-555-0199',
        fullName: 'Sarah Jenkins',
        forceChangePassword: false,
        prefferredLanguage: 'EN'
      }
    ],
    loginRoles: [
      { id: '12121212-1212-1212-1212-121212121212', login: demoApplicantLoginId, role: applicantRoleId },
      { id: '23232323-2323-2323-2323-232323232323', login: demoEmployerLoginId, role: employerRoleId }
    ],
    loginLogs: [],
    applicantProfiles: [
      {
        id: demoApplicantProfileId,
        login: demoApplicantLoginId,
        currentSalary: 125000,
        currentRate: 65,
        currency: 'CAD',
        country: 'CAN',
        province: 'ON',
        street: '200 Front Street West',
        city: 'Toronto',
        postalCode: 'M5V 3K2'
      }
    ],
    applicantEducations: [
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        applicant: demoApplicantProfileId,
        major: 'Computer Science',
        certificateDiploma: 'B.Sc. Honours',
        startDate: '2018-09-01',
        completionDate: '2022-06-01',
        completionPercent: 100
      }
    ],
    applicantSkills: [
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        applicant: demoApplicantProfileId,
        skill: 'C# / ASP.NET Core & Angular',
        skillLevel: 'Advanced',
        startMonth: 1,
        startYear: 2022,
        endMonth: 12,
        endYear: 2025
      }
    ],
    applicantWorkHistories: [
      {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        applicant: demoApplicantProfileId,
        companyName: 'CloudScale Solutions',
        countryCode: 'CAN',
        location: 'Toronto, ON',
        jobTitle: 'Full-Stack Software Engineer',
        jobDescription: 'Developed enterprise ASP.NET Core REST APIs and Angular web applications.',
        startMonth: 6,
        startYear: 2022,
        endMonth: 11,
        endYear: 2025
      }
    ],
    applicantResumes: [
      {
        id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        applicant: demoApplicantProfileId,
        resume: 'Full-Stack Software Engineer experienced in ASP.NET Core, Entity Framework Core, SQL Server, gRPC, and Angular.',
        lastUpdated: daysAgo(5)
      }
    ],
    jobApplications: [],
    companyProfiles: [
      {
        id: company1Id,
        companyWebsite: 'https://maplecloud.ca',
        contactPhone: '416-555-0199',
        contactName: 'Sarah Jenkins',
        registrationDate: daysAgo(240)
      },
      {
        id: company2Id,
        companyWebsite: 'https://northstarfin.com',
        contactPhone: '647-555-0142',
        contactName: 'David Chen',
        registrationDate: daysAgo(150)
      }
    ],
    companyDescriptions: [
      {
        id: 'f1111111-1111-1111-1111-111111111111',
        company: company1Id,
        languageId: 'EN',
        companyName: 'MapleCloud Technologies',
        companyDescription:
          'Enterprise cloud infrastructure and distributed data platform provider headquartered in Toronto.'
      },
      {
        id: 'f2222222-2222-2222-2222-222222222222',
        company: company2Id,
        languageId: 'EN',
        companyName: 'NorthStar Financial Systems',
        companyDescription:
          'Modern payment rails, treasury analytics, and core banking APIs for North American institutions.'
      }
    ],
    companyLocations: [
      {
        id: 'f3333333-3333-3333-3333-333333333333',
        company: company1Id,
        countryCode: 'CAN',
        province: 'ON',
        street: '100 King Street West',
        city: 'Toronto',
        PostalCode: undefined,
        postalCode: 'M5X 1A9'
      } as CompanyLocationPoco,
      {
        id: 'f4444444-4444-4444-4444-444444444444',
        company: company2Id,
        countryCode: 'CAN',
        province: 'BC',
        street: '455 Granville Street',
        city: 'Vancouver',
        postalCode: 'V6C 1T1'
      }
    ],
    companyJobs: [
      {
        id: job1Id,
        company: company1Id,
        profileCreated: daysAgo(6),
        isInactive: false,
        isCompanyHidden: false
      },
      {
        id: job2Id,
        company: company1Id,
        profileCreated: daysAgo(2),
        isInactive: false,
        isCompanyHidden: false
      },
      {
        id: job3Id,
        company: company2Id,
        profileCreated: daysAgo(1),
        isInactive: false,
        isCompanyHidden: false
      }
    ],
    companyJobDescriptions: [
      {
        id: 'a1111111-1111-1111-1111-111111111111',
        job: job1Id,
        jobName: 'Senior .NET & Cloud Platform Engineer',
        jobDescriptions:
          'Design and scale high-throughput ASP.NET Core microservices, EF Core data pipelines, and gRPC APIs supporting enterprise workloads.'
      },
      {
        id: 'a2222222-2222-2222-2222-222222222222',
        job: job2Id,
        jobName: 'Full-Stack Angular & TypeScript Engineer',
        jobDescriptions:
          'Build accessible, responsive recruitment and analytics applications using Angular standalone components, Reactive Forms, and REST APIs.'
      },
      {
        id: 'a3333333-3333-3333-3333-333333333333',
        job: job3Id,
        jobName: 'Backend Systems Architect (Fintech)',
        jobDescriptions:
          "Lead payment ledger architecture, SQL Server optimization, and API security across NorthStar's core financial platform."
      }
    ],
    companyJobSkills: [
      {
        id: 'b1111111-1111-1111-1111-111111111111',
        job: job1Id,
        skill: 'C# / ASP.NET Core',
        skillLevel: 'Expert',
        importance: 10
      },
      {
        id: 'b2222222-2222-2222-2222-222222222222',
        job: job1Id,
        skill: 'Entity Framework Core & SQL',
        skillLevel: 'Advanced',
        importance: 9
      },
      {
        id: 'b3333333-3333-3333-3333-333333333333',
        job: job2Id,
        skill: 'Angular & TypeScript',
        skillLevel: 'Advanced',
        importance: 10
      },
      {
        id: 'b4444444-4444-4444-4444-444444444444',
        job: job2Id,
        skill: 'REST APIs & RxJS',
        skillLevel: 'Intermediate',
        importance: 8
      },
      {
        id: 'b5555555-5555-5555-5555-555555555555',
        job: job3Id,
        skill: 'Distributed Systems & C#',
        skillLevel: 'Expert',
        importance: 10
      }
    ],
    companyJobEducations: [
      {
        id: 'c1111111-1111-1111-1111-111111111111',
        job: job1Id,
        major: 'Computer Science',
        importance: 8
      },
      {
        id: 'c2222222-2222-2222-2222-222222222222',
        job: job2Id,
        major: 'Software Engineering',
        importance: 7
      },
      {
        id: 'c3333333-3333-3333-3333-333333333333',
        job: job3Id,
        major: 'Computer Engineering',
        importance: 9
      }
    ]
  };
}

function loadDb(): BrowserDbState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as BrowserDbState;
    }
  } catch {
    // Ignore storage read errors
  }
  const initial = createInitialSeedState();
  saveDb(initial);
  return initial;
}

function saveDb(state: BrowserDbState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage write errors
  }
}

function upsertById<T extends { id: string }>(collection: T[], incoming: T[]): T[] {
  const map = new Map(collection.map((item) => [item.id, item]));
  for (const item of incoming) {
    map.set(item.id || newGuid(), { ...item, id: item.id || newGuid() });
  }
  return Array.from(map.values());
}

function removeById<T extends { id: string }>(collection: T[], toRemove: T[]): T[] {
  const removeIds = new Set(toRemove.map((item) => item.id));
  return collection.filter((item) => !removeIds.has(item.id));
}

function handleLocalApiRequest(
  method: string,
  url: string,
  body: unknown
): Observable<HttpResponse<unknown>> {
  const db = loadDb();
  const normalizedUrl = url.split('?')[0];
  const apiMatch = normalizedUrl.match(/\/api\/careercloud\/(.+)$/i);
  const path = apiMatch ? apiMatch[1].replace(/\/+$/, '') : '';

  const ok = (data: unknown = null, status = 200) =>
    of(new HttpResponse({ status, body: data, url }));

  const badRequest = (message: string) =>
    throwError(
      () =>
        new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request',
          url,
          error: { message }
        })
    );

  const unauthorized = (message: string) =>
    throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          url,
          error: { message }
        })
    );

  // System endpoints
  if (path === 'system/v1/countrycode' && method === 'GET') {
    return ok(db.countries);
  }
  if (path === 'system/v1/languagecode' && method === 'GET') {
    return ok(db.languages);
  }

  // Security endpoints
  if (path === 'security/v1/login/authenticate' && method === 'POST') {
    const creds = (body ?? {}) as { login?: string; password?: string };
    const loginName = (creds.login ?? '').trim();
    const password = creds.password ?? '';
    const matched = db.logins.find(
      (u) => u.login.toLowerCase() === loginName.toLowerCase() && u.password === password
    );

    if (!matched || matched.isInactive || matched.isLocked) {
      return unauthorized(
        'Invalid username or password. Tip: try demo account "applicant_demo" or "employer_demo" with password "Career$2026", or create a new account.'
      );
    }

    db.loginLogs.push({
      id: newGuid(),
      login: matched.id,
      sourceIP: '127.0.0.1',
      logonDate: new Date().toISOString(),
      isSuccesful: true
    });
    saveDb(db);

    return ok({
      id: matched.id,
      login: matched.login,
      fullName: matched.fullName,
      emailAddress: matched.emailAddress,
      phoneNumber: matched.phoneNumber,
      prefferredLanguage: matched.prefferredLanguage
    });
  }

  if (path === 'security/v1/login') {
    if (method === 'GET') {
      return ok(db.logins);
    }
    if (method === 'POST' || method === 'PUT') {
      const items = (Array.isArray(body) ? body : []) as SecurityLoginPoco[];
      for (const item of items) {
        if (!item.login?.trim()) {
          return badRequest('Login username cannot be empty.');
        }
        if (method === 'POST') {
          const duplicate = db.logins.some(
            (existing) =>
              existing.id !== item.id &&
              existing.login.toLowerCase() === item.login.trim().toLowerCase()
          );
          if (duplicate) {
            return badRequest(`Username "${item.login}" is already registered.`);
          }
        }
      }
      db.logins = upsertById(db.logins, items);
      saveDb(db);
      return ok();
    }
  }

  if (path.startsWith('security/v1/login/') && method === 'GET') {
    const id = path.split('/').pop() ?? '';
    const found = db.logins.find((l) => l.id === id) ?? null;
    return ok(found);
  }

  if (path === 'security/v1/role' && method === 'GET') {
    return ok(db.roles);
  }

  if (path === 'security/v1/loginsrole') {
    if (method === 'GET') {
      return ok(db.loginRoles);
    }
    if (method === 'POST' || method === 'PUT') {
      db.loginRoles = upsertById(db.loginRoles, (body as SecurityLoginsRolePoco[]) ?? []);
      saveDb(db);
      return ok();
    }
  }

  if (path === 'security/v1/loginslog' && method === 'GET') {
    return ok(db.loginLogs);
  }

  // Applicant endpoints
  if (path === 'applicant/v1/profile') {
    if (method === 'GET') return ok(db.applicantProfiles);
    if (method === 'POST' || method === 'PUT') {
      db.applicantProfiles = upsertById(db.applicantProfiles, (body as ApplicantProfilePoco[]) ?? []);
      saveDb(db);
      return ok();
    }
  }

  if (path === 'applicant/v1/education') {
    if (method === 'GET') return ok(db.applicantEducations);
    if (method === 'POST' || method === 'PUT') {
      db.applicantEducations = upsertById(
        db.applicantEducations,
        (body as ApplicantEducationPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
    if (method === 'DELETE') {
      db.applicantEducations = removeById(
        db.applicantEducations,
        (body as ApplicantEducationPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
  }

  if (path === 'applicant/v1/skill') {
    if (method === 'GET') return ok(db.applicantSkills);
    if (method === 'POST' || method === 'PUT') {
      db.applicantSkills = upsertById(db.applicantSkills, (body as ApplicantSkillPoco[]) ?? []);
      saveDb(db);
      return ok();
    }
    if (method === 'DELETE') {
      db.applicantSkills = removeById(db.applicantSkills, (body as ApplicantSkillPoco[]) ?? []);
      saveDb(db);
      return ok();
    }
  }

  if (path === 'applicant/v1/workhistory') {
    if (method === 'GET') return ok(db.applicantWorkHistories);
    if (method === 'POST' || method === 'PUT') {
      db.applicantWorkHistories = upsertById(
        db.applicantWorkHistories,
        (body as ApplicantWorkHistoryPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
    if (method === 'DELETE') {
      db.applicantWorkHistories = removeById(
        db.applicantWorkHistories,
        (body as ApplicantWorkHistoryPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
  }

  if (path === 'applicant/v1/resume') {
    if (method === 'GET') return ok(db.applicantResumes);
    if (method === 'POST' || method === 'PUT') {
      db.applicantResumes = upsertById(db.applicantResumes, (body as ApplicantResumePoco[]) ?? []);
      saveDb(db);
      return ok();
    }
  }

  if (path === 'applicant/v1/jobapplication') {
    if (method === 'GET') return ok(db.jobApplications);
    if (method === 'POST' || method === 'PUT') {
      db.jobApplications = upsertById(
        db.jobApplications,
        (body as ApplicantJobApplicationPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
    if (method === 'DELETE') {
      db.jobApplications = removeById(
        db.jobApplications,
        (body as ApplicantJobApplicationPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
  }

  // Company & Job endpoints
  if (path === 'company/v1/profile') {
    if (method === 'GET') return ok(db.companyProfiles);
    if (method === 'POST' || method === 'PUT') {
      db.companyProfiles = upsertById(db.companyProfiles, (body as CompanyProfilePoco[]) ?? []);
      saveDb(db);
      return ok();
    }
  }

  if (path === 'company/v1/description') {
    if (method === 'GET') return ok(db.companyDescriptions);
    if (method === 'POST' || method === 'PUT') {
      db.companyDescriptions = upsertById(
        db.companyDescriptions,
        (body as CompanyDescriptionPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
  }

  if (path === 'company/v1/location') {
    if (method === 'GET') return ok(db.companyLocations);
    if (method === 'POST' || method === 'PUT') {
      db.companyLocations = upsertById(
        db.companyLocations,
        (body as CompanyLocationPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
    if (method === 'DELETE') {
      db.companyLocations = removeById(
        db.companyLocations,
        (body as CompanyLocationPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
  }

  if (path === 'company/v1/job') {
    if (method === 'GET') return ok(db.companyJobs);
    if (method === 'POST' || method === 'PUT') {
      db.companyJobs = upsertById(db.companyJobs, (body as CompanyJobPoco[]) ?? []);
      saveDb(db);
      return ok();
    }
    if (method === 'DELETE') {
      db.companyJobs = removeById(db.companyJobs, (body as CompanyJobPoco[]) ?? []);
      saveDb(db);
      return ok();
    }
  }

  if (path === 'company/v1/jobdescription') {
    if (method === 'GET') return ok(db.companyJobDescriptions);
    if (method === 'POST' || method === 'PUT') {
      db.companyJobDescriptions = upsertById(
        db.companyJobDescriptions,
        (body as CompanyJobDescriptionPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
  }

  if (path === 'company/v1/jobskill') {
    if (method === 'GET') return ok(db.companyJobSkills);
    if (method === 'POST' || method === 'PUT') {
      db.companyJobSkills = upsertById(
        db.companyJobSkills,
        (body as CompanyJobSkillPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
    if (method === 'DELETE') {
      db.companyJobSkills = removeById(
        db.companyJobSkills,
        (body as CompanyJobSkillPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
  }

  if (path === 'company/v1/jobeducation') {
    if (method === 'GET') return ok(db.companyJobEducations);
    if (method === 'POST' || method === 'PUT') {
      db.companyJobEducations = upsertById(
        db.companyJobEducations,
        (body as CompanyJobEducationPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
    if (method === 'DELETE') {
      db.companyJobEducations = removeById(
        db.companyJobEducations,
        (body as CompanyJobEducationPoco[]) ?? []
      );
      saveDb(db);
      return ok();
    }
  }

  return ok([]);
}

export const careerCloudFallbackInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/careercloud/')) {
    return next(req);
  }

  const isStaticHost =
    typeof window !== 'undefined' &&
    (window.location.hostname.endsWith('github.io') ||
      window.location.hostname.endsWith('.pages.dev') ||
      window.location.hostname.endsWith('.netlify.app') ||
      window.location.hostname.endsWith('.vercel.app'));

  if (isStaticHost) {
    return handleLocalApiRequest(req.method, req.url, req.body);
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Fall back to local browser DB if the .NET server is unreachable (status 0, 404, 405, 502, 503, 504)
      if ([0, 404, 405, 502, 503, 504].includes(err.status)) {
        return handleLocalApiRequest(req.method, req.url, req.body);
      }
      return throwError(() => err);
    })
  );
};
