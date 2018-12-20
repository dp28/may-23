import { reducer } from './reducer';
import { onInit } from './test-utils';

describe(reducer, () => {
  onInit(reducer, (result) => {
    it('should create domain state', () => {
      expect(result.domain).toBeTruthy();
    });

    it('should create ui state for components with intermediate state', () => {
      expect(result.ui).toBeTruthy();
    });
  });
});
