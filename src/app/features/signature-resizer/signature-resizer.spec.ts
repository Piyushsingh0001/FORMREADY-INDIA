import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignatureResizer } from './signature-resizer';

describe('SignatureResizer', () => {
  let component: SignatureResizer;
  let fixture: ComponentFixture<SignatureResizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignatureResizer],
    }).compileComponents();

    fixture = TestBed.createComponent(SignatureResizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
