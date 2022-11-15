import * as ExportedOfferCourse from '../repositories/offer-course-repository.interface';
import * as ExportedOffer from '../repositories/offer-repository.interface';

describe('Interfaces', () => {
  it('should have exports', () => {
    expect(typeof ExportedOfferCourse).toBe('object');
    expect(typeof ExportedOffer).toBe('object');
  });

  it('should not have undefined exports', () => {
    Object.keys(ExportedOfferCourse).forEach(exportKey =>
      expect(Boolean(ExportedOfferCourse[exportKey])).toBe(true),
    );
    Object.keys(ExportedOffer).forEach(exportKey =>
      expect(Boolean(ExportedOffer[exportKey])).toBe(true),
    );
  });
});
