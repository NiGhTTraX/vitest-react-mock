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
