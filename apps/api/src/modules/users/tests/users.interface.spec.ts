import * as ExportedUser from '../repositories/user-repository.interface';
import * as ExportedUserRole from '../repositories/user-role-repository.interface';

describe('Interfaces', () => {
  it('should have exports', () => {
    expect(typeof ExportedUser).toBe('object');
    expect(typeof ExportedUserRole).toBe('object');
  });

  it('should not have undefined exports', () => {
    Object.keys(ExportedUser).forEach(exportKey =>
      expect(Boolean(ExportedUser[exportKey])).toBe(true),
    );
    Object.keys(ExportedUserRole).forEach(exportKey =>
      expect(Boolean(ExportedUserRole[exportKey])).toBe(true),
    );
  });
});
