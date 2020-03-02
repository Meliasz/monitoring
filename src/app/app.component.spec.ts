import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { StubAppService } from './app.service.stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let el: HTMLElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AppService,
          useClass: StubAppService
        }
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    el = fixture.debugElement.nativeElement;
  });



  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'monitoring'`, () => {
    expect(fixture.debugElement.query(By.css('.text-uppercase')).nativeElement.innerText).toEqual('Monitoring');
  });

});
