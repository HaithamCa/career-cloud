import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { App } from './app';
import { CareerCloudApiService } from './core/services/career-cloud-api.service';
import { careerCloudPasswordValidator, careerCloudPhoneValidator } from './features/auth/auth.component';
import { FormControl } from '@angular/forms';

describe('CareerCloud Frontend Suite', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the root App shell with CareerCloud brand', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-logo')?.textContent).toContain('CareerCloud');
  });

  it('should request countries from /system/v1/countrycode in CareerCloudApiService', () => {
    const service = TestBed.inject(CareerCloudApiService);
    const httpMock = TestBed.inject(HttpTestingController);

    service.getCountries().subscribe((countries) => {
      expect(countries.length).toBe(1);
      expect(countries[0].code).toBe('CAN');
    });

    const req = httpMock.expectOne('http://localhost:5115/api/careercloud/system/v1/countrycode');
    expect(req.request.method).toBe('GET');
    req.flush([{ code: 'CAN', name: 'Canada' }]);
    httpMock.verify();
  });

  it('should validate SecurityLogin passwords and phone numbers according to BLL rules', () => {
    const shortPassword = new FormControl('Short$1');
    const noSpecialPassword = new FormControl('LongPassword123');
    const validPassword = new FormControl('SecurePass$2026');

    expect(careerCloudPasswordValidator(shortPassword)).toEqual({ minLength10: true });
    expect(careerCloudPasswordValidator(noSpecialPassword)).toEqual({ missingExtendedChar: true });
    expect(careerCloudPasswordValidator(validPassword)).toBeNull();

    const invalidPhone = new FormControl('4165550199');
    const validPhone = new FormControl('416-555-0199');

    expect(careerCloudPhoneValidator(invalidPhone)).toEqual({ invalidPhoneFormat: true });
    expect(careerCloudPhoneValidator(validPhone)).toBeNull();
  });
});
