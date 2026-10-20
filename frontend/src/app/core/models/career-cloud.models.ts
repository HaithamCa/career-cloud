export interface SystemCountryCodePoco {
  code: string;
  name: string;
}

export interface SystemLanguageCodePoco {
  languageID: string;
  name: string;
  nativeName: string;
}

export interface SecurityRolePoco {
  id: string;
  role: string;
  isInactive: boolean;
}

export interface SecurityLoginPoco {
  id: string;
  login: string;
  password?: string;
  created?: string;
  passwordUpdate?: string | null;
  agreementAccepted?: string | null;
  isLocked: boolean;
  isInactive: boolean;
  emailAddress: string;
  phoneNumber: string;
  fullName: string;
  forceChangePassword: boolean;
  prefferredLanguage?: string | null;
}

export interface SecurityLoginsRolePoco {
  id: string;
  login: string;
  role: string;
}

export interface SecurityLoginsLogPoco {
  id: string;
  login: string;
  sourceIP: string;
  logonDate: string;
  isSuccesful: boolean;
}

export interface ApplicantProfilePoco {
  id: string;
  login: string;
  currentSalary: number | null;
  currentRate: number | null;
  currency: string | null;
  country: string | null;
  province: string | null;
  street: string | null;
  city: string | null;
  postalCode: string | null;
}

export interface ApplicantEducationPoco {
  id: string;
  applicant: string;
  major: string;
  certificateDiploma: string | null;
  startDate: string | null;
  completionDate: string | null;
  completionPercent: number | null;
}

export interface ApplicantSkillPoco {
  id: string;
  applicant: string;
  skill: string;
  skillLevel: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
}

export interface ApplicantWorkHistoryPoco {
  id: string;
  applicant: string;
  companyName: string;
  countryCode: string;
  location: string;
  jobTitle: string;
  jobDescription: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
}

export interface ApplicantResumePoco {
  id: string;
  applicant: string;
  resume: string;
  lastUpdated: string | null;
}

export interface ApplicantJobApplicationPoco {
  id: string;
  applicant: string;
  job: string;
  applicationDate: string;
}

export interface CompanyProfilePoco {
  id: string;
  companyWebsite: string;
  contactPhone: string;
  registrationDate: string;
  contactName: string | null;
  companyLogo?: string | null;
}

export interface CompanyDescriptionPoco {
  id: string;
  company: string;
  languageId: string;
  companyName: string;
  companyDescription: string;
}

export interface CompanyLocationPoco {
  id: string;
  company: string;
  countryCode: string;
  province: string;
  street: string;
  city: string;
  postalCode: string;
}

export interface CompanyJobPoco {
  id: string;
  company: string;
  profileCreated: string;
  isInactive: boolean;
  isCompanyHidden: boolean;
}

export interface CompanyJobDescriptionPoco {
  id: string;
  job: string;
  jobName: string;
  jobDescriptions: string;
}

export interface CompanyJobSkillPoco {
  id: string;
  job: string;
  skill: string;
  skillLevel: string;
  importance: number;
}

export interface CompanyJobEducationPoco {
  id: string;
  job: string;
  major: string;
  importance: number;
}

export interface EnrichedJobView {
  job: CompanyJobPoco;
  description: CompanyJobDescriptionPoco | null;
  companyProfile: CompanyProfilePoco | null;
  companyDescription: CompanyDescriptionPoco | null;
  locations: CompanyLocationPoco[];
  skills: CompanyJobSkillPoco[];
  educations: CompanyJobEducationPoco[];
  title: string;
  summary: string;
  companyName: string;
  locationLabel: string;
}

export interface AuthenticatedUser {
  id: string;
  login: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  prefferredLanguage?: string | null;
  role: 'Applicant' | 'Employer';
}
