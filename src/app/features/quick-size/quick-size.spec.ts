import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickSize } from './quick-size';

describe('QuickSize', () => {
  let component: QuickSize;
  let fixture: ComponentFixture<QuickSize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickSize],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickSize);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
