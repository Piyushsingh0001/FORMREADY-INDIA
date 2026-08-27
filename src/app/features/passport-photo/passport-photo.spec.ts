import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassportPhoto } from './passport-photo';

describe('PassportPhoto', () => {
  let component: PassportPhoto;
  let fixture: ComponentFixture<PassportPhoto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassportPhoto],
    }).compileComponents();

    fixture = TestBed.createComponent(PassportPhoto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
