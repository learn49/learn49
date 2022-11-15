import * as Exported from '../repositories/tag-repositories.interface';

describe('Interfaces', () => {
  it('should have exports', () => {
    expect(typeof Exported).toBe('object');
  });

  it('should not have undefined exports', () => {
    Object.keys(Exported).forEach(exportKey =>
      expect(Boolean(Exported[exportKey])).toBe(true),
    );
  });
});
