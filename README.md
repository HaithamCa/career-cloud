# CareerCloud — Full-Stack Job Portal (ASP.NET Core + Angular)

CareerCloud is a multi-tier enterprise recruitment and job portal application built with **ASP.NET Core 6** (POCOs, ADO.NET, Entity Framework Core, Business Logic Layer, REST WebAPI, and gRPC) and a modern **Angular 20** frontend (`frontend/`).

---

## Architecture Overview

| Layer / Folder | Purpose |
| :--- | :--- |
| `CareerCloud.Pocos` | Domain entities (`IPoco` implementations) with EF/DataAnnotations metadata |
| `CareerCloud.DataAccessLayer` | Generic `IDataRepository<T>` interface |
| `CareerCloud.ADODataAccessLayer` | Raw SQL / `SqlCommand` repository implementations |
| `CareerCloud.EntityFrameworkDataAccess` | `CareerCloudContext` & `EFGenericRepository<T>` (supports SQL Server via `CAREERCLOUD_CONNECTION_STRING` and automatic local SQLite fallback) |
| `CareerCloud.BusinessLogicLayer` | Domain validation rules (`BaseLogic<T>`, `SecurityLoginLogic`, password hashing/salting, `ValidationException` rules) |
| `CareerCloud.WebAPI` | ASP.NET Core REST API (`http://localhost:5115/api/careercloud/...`) + Swagger UI (`/swagger`) |
| `CareerCloud.gRPC` | gRPC protobuf service layer |
| `frontend/` | Standalone **Angular 20** Job Portal (`http://localhost:4200`) |

---

## Running the Full-Stack Application Locally

### 1. Start the ASP.NET Core WebAPI Backend
```bash
dotnet run --project CareerCloud.WebAPI/CareerCloud.WebAPI.csproj --urls "http://localhost:5115"
```
- **API Base URL:** `http://localhost:5115/api/careercloud`
- **Swagger UI:** `http://localhost:5115/swagger`
- **Database Configuration:**
  - If `CAREERCLOUD_CONNECTION_STRING` is set in your environment, `CareerCloudContext` connects to **SQL Server**.
  - Otherwise, it automatically creates and seeds a local **SQLite** database (`careercloud.db`) with reference data (`System_Country_Codes`, `System_Language_Codes`, `Security_Roles`, and sample company/job listings) so the app runs out-of-the-box on macOS/Linux/Windows.

### 2. Start the Angular Frontend (`frontend/`)
```bash
cd frontend
npm install
npm start
```
- Open **`http://localhost:4200`** in your browser.
- Environment configuration lives in `frontend/src/environments/environment.ts` (`apiBaseUrl: 'http://localhost:5115/api/careercloud'`).

---

## Frontend Features (`frontend/`)

1. **Public Job Board (`/jobs`)**
   - Joins `Company_Jobs`, `Company_Jobs_Descriptions`, `Company_Job_Skills`, `Company_Job_Educations`, `Company_Profiles`, `Company_Descriptions`, and `Company_Locations`.
   - Real-time filtering by keyword/title, office location, required skill, and active status, plus pagination.
2. **Job Details & One-Click Application (`/jobs/:id`)**
   - Full role description, required skills with importance scores, academic requirements, company overview, and office addresses.
   - Authenticated candidates can submit applications directly via `POST /api/careercloud/applicant/v1/jobapplication`.
3. **Authentication & Registration (`/auth`)**
   - Sign in against `POST /api/careercloud/security/v1/login/authenticate` (`SecurityLoginLogic.Authenticate` with PBKDF2/SHA-512 salted hashes and `SecurityLoginsLog` audit entries).
   - Register new Applicant or Employer accounts with client-side Reactive Forms validators enforcing Business Logic Layer rules (Rules 700–705).
4. **Applicant Workspace (`/applicant`)**
   - Full CRUD for `ApplicantProfile`, `ApplicantResume`, `ApplicantEducation`, `ApplicantSkill`, `ApplicantWorkHistory`, and `ApplicantJobApplication`.
5. **Employer & Recruitment Portal (`/employer`)**
   - Switch between company workspaces or create a new `CompanyProfile` + `CompanyDescription` (enforcing website `.ca`/`.com`/`.biz` Rule 600 and phone format `XXX-XXX-XXXX` Rule 601).
   - Manage `CompanyLocation` records and publish new multi-table job postings (`CompanyJob`, `CompanyJobDescription`, `CompanyJobSkill`, `CompanyJobEducation`).

---

## Running Tests

### Backend Unit Tests (.NET)
```bash
dotnet test CareerCloudCore.UnitTests.Assignment1/CareerCloudCore.UnitTests.Assignment1/CareerCloudCore.UnitTests.Assignment1.csproj
dotnet test CareerCloudCore.UnitTests.Assignment3/CareerCloudCore.UnitTests.Assignment3.csproj
```

### Frontend Build & Unit Tests (Angular)
```bash
cd frontend
npm run build
npx ng test --watch=false --browsers=ChromeHeadless
```
