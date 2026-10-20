import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApplicantEducationPoco,
  ApplicantJobApplicationPoco,
  ApplicantProfilePoco,
  ApplicantResumePoco,
  ApplicantSkillPoco,
  ApplicantWorkHistoryPoco,
  AuthenticatedUser,
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

@Injectable({
  providedIn: 'root'
})
export class CareerCloudApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  // System endpoints
  getCountries(): Observable<SystemCountryCodePoco[]> {
    return this.http.get<SystemCountryCodePoco[]>(`${this.baseUrl}/system/v1/countrycode`);
  }

  getLanguages(): Observable<SystemLanguageCodePoco[]> {
    return this.http.get<SystemLanguageCodePoco[]>(`${this.baseUrl}/system/v1/languagecode`);
  }

  // Security endpoints
  getLogins(): Observable<SecurityLoginPoco[]> {
    return this.http.get<SecurityLoginPoco[]>(`${this.baseUrl}/security/v1/login`);
  }

  getLoginById(id: string): Observable<SecurityLoginPoco> {
    return this.http.get<SecurityLoginPoco>(`${this.baseUrl}/security/v1/login/${id}`);
  }

  createLogins(pocos: SecurityLoginPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/security/v1/login`, pocos);
  }

  updateLogins(pocos: SecurityLoginPoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/security/v1/login`, pocos);
  }

  authenticate(login: string, password: string): Observable<Omit<AuthenticatedUser, 'role'>> {
    return this.http.post<Omit<AuthenticatedUser, 'role'>>(
      `${this.baseUrl}/security/v1/login/authenticate`,
      { login, password }
    );
  }

  getRoles(): Observable<SecurityRolePoco[]> {
    return this.http.get<SecurityRolePoco[]>(`${this.baseUrl}/security/v1/role`);
  }

  getLoginRoles(): Observable<SecurityLoginsRolePoco[]> {
    return this.http.get<SecurityLoginsRolePoco[]>(`${this.baseUrl}/security/v1/loginsrole`);
  }

  createLoginRoles(pocos: SecurityLoginsRolePoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/security/v1/loginsrole`, pocos);
  }

  getLoginLogs(): Observable<SecurityLoginsLogPoco[]> {
    return this.http.get<SecurityLoginsLogPoco[]>(`${this.baseUrl}/security/v1/loginslog`);
  }

  // Applicant endpoints
  getApplicantProfiles(): Observable<ApplicantProfilePoco[]> {
    return this.http.get<ApplicantProfilePoco[]>(`${this.baseUrl}/applicant/v1/profile`);
  }

  createApplicantProfiles(pocos: ApplicantProfilePoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/applicant/v1/profile`, pocos);
  }

  updateApplicantProfiles(pocos: ApplicantProfilePoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/applicant/v1/profile`, pocos);
  }

  getApplicantEducations(): Observable<ApplicantEducationPoco[]> {
    return this.http.get<ApplicantEducationPoco[]>(`${this.baseUrl}/applicant/v1/education`);
  }

  createApplicantEducations(pocos: ApplicantEducationPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/applicant/v1/education`, pocos);
  }

  updateApplicantEducations(pocos: ApplicantEducationPoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/applicant/v1/education`, pocos);
  }

  deleteApplicantEducations(pocos: ApplicantEducationPoco[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/applicant/v1/education`, { body: pocos });
  }

  getApplicantSkills(): Observable<ApplicantSkillPoco[]> {
    return this.http.get<ApplicantSkillPoco[]>(`${this.baseUrl}/applicant/v1/skill`);
  }

  createApplicantSkills(pocos: ApplicantSkillPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/applicant/v1/skill`, pocos);
  }

  updateApplicantSkills(pocos: ApplicantSkillPoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/applicant/v1/skill`, pocos);
  }

  deleteApplicantSkills(pocos: ApplicantSkillPoco[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/applicant/v1/skill`, { body: pocos });
  }

  getApplicantWorkHistories(): Observable<ApplicantWorkHistoryPoco[]> {
    return this.http.get<ApplicantWorkHistoryPoco[]>(`${this.baseUrl}/applicant/v1/workhistory`);
  }

  createApplicantWorkHistories(pocos: ApplicantWorkHistoryPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/applicant/v1/workhistory`, pocos);
  }

  updateApplicantWorkHistories(pocos: ApplicantWorkHistoryPoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/applicant/v1/workhistory`, pocos);
  }

  deleteApplicantWorkHistories(pocos: ApplicantWorkHistoryPoco[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/applicant/v1/workhistory`, { body: pocos });
  }

  getApplicantResumes(): Observable<ApplicantResumePoco[]> {
    return this.http.get<ApplicantResumePoco[]>(`${this.baseUrl}/applicant/v1/resume`);
  }

  createApplicantResumes(pocos: ApplicantResumePoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/applicant/v1/resume`, pocos);
  }

  updateApplicantResumes(pocos: ApplicantResumePoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/applicant/v1/resume`, pocos);
  }

  getJobApplications(): Observable<ApplicantJobApplicationPoco[]> {
    return this.http.get<ApplicantJobApplicationPoco[]>(`${this.baseUrl}/applicant/v1/jobapplication`);
  }

  createJobApplications(pocos: ApplicantJobApplicationPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/applicant/v1/jobapplication`, pocos);
  }

  deleteJobApplications(pocos: ApplicantJobApplicationPoco[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/applicant/v1/jobapplication`, { body: pocos });
  }

  // Company & Job endpoints
  getCompanyProfiles(): Observable<CompanyProfilePoco[]> {
    return this.http.get<CompanyProfilePoco[]>(`${this.baseUrl}/company/v1/profile`);
  }

  createCompanyProfiles(pocos: CompanyProfilePoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/company/v1/profile`, pocos);
  }

  updateCompanyProfiles(pocos: CompanyProfilePoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/company/v1/profile`, pocos);
  }

  getCompanyDescriptions(): Observable<CompanyDescriptionPoco[]> {
    return this.http.get<CompanyDescriptionPoco[]>(`${this.baseUrl}/company/v1/description`);
  }

  createCompanyDescriptions(pocos: CompanyDescriptionPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/company/v1/description`, pocos);
  }

  updateCompanyDescriptions(pocos: CompanyDescriptionPoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/company/v1/description`, pocos);
  }

  getCompanyLocations(): Observable<CompanyLocationPoco[]> {
    return this.http.get<CompanyLocationPoco[]>(`${this.baseUrl}/company/v1/location`);
  }

  createCompanyLocations(pocos: CompanyLocationPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/company/v1/location`, pocos);
  }

  updateCompanyLocations(pocos: CompanyLocationPoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/company/v1/location`, pocos);
  }

  deleteCompanyLocations(pocos: CompanyLocationPoco[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/company/v1/location`, { body: pocos });
  }

  getCompanyJobs(): Observable<CompanyJobPoco[]> {
    return this.http.get<CompanyJobPoco[]>(`${this.baseUrl}/company/v1/job`);
  }

  createCompanyJobs(pocos: CompanyJobPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/company/v1/job`, pocos);
  }

  updateCompanyJobs(pocos: CompanyJobPoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/company/v1/job`, pocos);
  }

  deleteCompanyJobs(pocos: CompanyJobPoco[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/company/v1/job`, { body: pocos });
  }

  getCompanyJobDescriptions(): Observable<CompanyJobDescriptionPoco[]> {
    return this.http.get<CompanyJobDescriptionPoco[]>(`${this.baseUrl}/company/v1/jobdescription`);
  }

  createCompanyJobDescriptions(pocos: CompanyJobDescriptionPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/company/v1/jobdescription`, pocos);
  }

  updateCompanyJobDescriptions(pocos: CompanyJobDescriptionPoco[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/company/v1/jobdescription`, pocos);
  }

  getCompanyJobSkills(): Observable<CompanyJobSkillPoco[]> {
    return this.http.get<CompanyJobSkillPoco[]>(`${this.baseUrl}/company/v1/jobskill`);
  }

  createCompanyJobSkills(pocos: CompanyJobSkillPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/company/v1/jobskill`, pocos);
  }

  deleteCompanyJobSkills(pocos: CompanyJobSkillPoco[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/company/v1/jobskill`, { body: pocos });
  }

  getCompanyJobEducations(): Observable<CompanyJobEducationPoco[]> {
    return this.http.get<CompanyJobEducationPoco[]>(`${this.baseUrl}/company/v1/jobeducation`);
  }

  createCompanyJobEducations(pocos: CompanyJobEducationPoco[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/company/v1/jobeducation`, pocos);
  }

  deleteCompanyJobEducations(pocos: CompanyJobEducationPoco[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/company/v1/jobeducation`, { body: pocos });
  }
}
