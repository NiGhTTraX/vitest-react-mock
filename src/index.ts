import type { ReactMock } from 'react-mock-component';
import { expect } from 'vitest';
import type { ReactMockExpect } from './matcher.js';
import { reactMockMatcher } from './matcher.js';

declare module 'vitest' {
  interface ExpectStatic {
    <Props>(mock: ReactMock<Props>): ReactMockExpect<Props> & {
      not: ReactMockExpect<Props>;
    };
  }
}

expect.extend(reactMockMatcher);

// Exporting this so the vitest import is preserved,
// so the module augmentation above works.
// Without it, the user has to include it via tsconfig#types
// or an explicit import.
export { expect };
