import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="container nav-inner">
        <a routerLink="/jobs" class="brand-logo" aria-label="CareerCloud Home">
          <span class="brand-mark">CC</span>
          <span>CareerCloud</span>
        </a>

        <nav class="main-nav" aria-label="Primary navigation">
          <a routerLink="/jobs" routerLinkActive="active-link">Browse Jobs</a>

          @if (auth.isAuthenticated()) {
            <a routerLink="/applicant" routerLinkActive="active-link">Applicant Workspace</a>
            <a routerLink="/employer" routerLinkActive="active-link">Employer Portal</a>
          }
        </nav>

        <div class="nav-auth">
          @if (auth.currentUser(); as user) {
            <span class="user-pill">
              <strong>{{ user.fullName }}</strong>
              <span class="badge" style="margin-left: 0.4rem;">{{ user.role }}</span>
            </span>
            <button type="button" class="btn btn-secondary btn-sm" (click)="logout()">
              Sign Out
            </button>
          } @else {
            <a routerLink="/auth" class="btn btn-primary btn-sm">Sign In / Register</a>
          }
        </div>
      </div>
    </header>

    <main id="main-content">
      <router-outlet />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <span>CareerCloud Recruitment Portal · Connected to ASP.NET Core WebAPI</span>
        <a href="http://localhost:5115/swagger/index.html" target="_blank" rel="noopener">
          API Swagger Docs ↗
        </a>
      </div>
    </footer>
  `,
  styles: [`
    .site-header {
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 64px;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .brand-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      font-weight: 700;
      font-size: 1.15rem;
      color: var(--text-primary);
      text-decoration: none;
    }
    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--brand);
      color: #ffffff;
      font-size: 0.85rem;
      font-weight: 800;
    }
    .main-nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .main-nav a {
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--text-secondary);
      padding: 0.35rem 0;
      border-bottom: 2px solid transparent;
      text-decoration: none;
    }
    .main-nav a.active-link,
    .main-nav a:hover {
      color: var(--brand);
      border-bottom-color: var(--brand);
    }
    .nav-auth {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-pill {
      font-size: 0.86rem;
      color: var(--text-secondary);
    }
    .site-footer {
      border-top: 1px solid var(--border-color);
      background: var(--bg-surface);
      padding: 1.25rem 0;
      margin-top: 3rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
  `]
})
export class App {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.signOut();
    this.router.navigate(['/jobs']);
  }
}
