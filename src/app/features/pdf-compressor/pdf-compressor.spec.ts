import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfCompressor } from './pdf-compressor';

describe('PdfCompressor', () => {
  let component: PdfCompressor;
  let fixture: ComponentFixture<PdfCompressor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfCompressor],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfCompressor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
