import { TestBed } from '@angular/core/testing';
import { ImageProcessing } from './image-processing';

describe('ImageProcessing', () => {
  let service: ImageProcessing;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageProcessing);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
