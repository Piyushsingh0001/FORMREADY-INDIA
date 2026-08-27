import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoResizer } from './photo-resizer';

describe('PhotoResizer', () => {
  let component: PhotoResizer;
  let fixture: ComponentFixture<PhotoResizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoResizer],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoResizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
