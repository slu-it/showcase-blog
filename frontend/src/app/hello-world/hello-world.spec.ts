import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

import {HelloWorld} from './hello-world';

describe('HelloWorld', () => {
  let component: HelloWorld;
  let fixture: ComponentFixture<HelloWorld>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelloWorld],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HelloWorld);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should have default name value', () => {
      expect(component.form.value.name).toBe('World!');
    });

    it('should have initial message', () => {
      expect(component.message).toBe('-');
    });
  });

  describe('form validation', () => {
    it('should be valid with default value', () => {
      expect(component.form.valid).toBe(true);
    });

    it('should be invalid when name is empty', () => {
      component.form.controls.name.setValue('');
      expect(component.form.valid).toBe(false);
    });

    it('should disable submit button when form is invalid', () => {
      component.form.controls.name.setValue('');
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('[data-testid="submit-button"]');
      expect(button.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      const button = fixture.nativeElement.querySelector('[data-testid="submit-button"]');
      expect(button.disabled).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    it('should set message to loading when called', () => {
      component.handleSubmit();

      expect(component.message).toBe('loading ...');

      httpMock.expectOne('/api/hello').flush({message: 'response'});
    });

    it('should call backend with form name value', () => {
      component.form.controls.name.setValue('Test');
      component.handleSubmit();

      const req = httpMock.expectOne('/api/hello');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({name: 'Test'});
      req.flush({message: 'response'});
    });

    it('should update message on successful response', () => {
      component.handleSubmit();

      const req = httpMock.expectOne('/api/hello');
      req.flush({message: 'Hello World!'});

      expect(component.message).toBe('Hello World!');
    });

    it('should set error message on request failure', () => {
      component.handleSubmit();

      const req = httpMock.expectOne('/api/hello');
      req.error(new ProgressEvent('error'));

      expect(component.message).toBe('Error loading message');
    });
  });

  describe('template rendering', () => {
    it('should display the message', () => {
      component.message = 'Test message';
      fixture.detectChanges();

      const messageDiv = fixture.nativeElement.querySelector('[data-testid="message"]');
      expect(messageDiv.textContent).toContain('Test message');
    });

    it('should display input with form value', () => {
      const input = fixture.nativeElement.querySelector('[data-testid="name-input"]');
      expect(input.value).toBe('World!');
    });
  });
});
