import { uiReducer } from './ui-reducer';
import { onInit } from './test-utils';

describe(uiReducer, () => {
  onInit(uiReducer, (result) => {
    it('should include the current test plan', () => {
      expect(result.currentTestPlan).toBeTruthy();
    });
  });
});
