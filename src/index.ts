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

// Exporting this to preserve the vitest import,
// so the module augmentation above works if the user is using
// [global mode](https://vitest.dev/config/#globals).
// Without it, the user has to include it via tsconfig#types
// or an explicit import.
export { expect };
