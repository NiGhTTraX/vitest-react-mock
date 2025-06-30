import { ReactMock } from 'react-mock-component';
import { expect } from 'vitest';
import { ReactMockExpect, reactMockMatcher } from './matcher';

declare module 'vitest' {
  interface ExpectStatic {
    <Props>(mock: ReactMock<Props>): ReactMockExpect<Props> & {
      not: ReactMockExpect<Props>;
    };
  }

  // noinspection JSUnusedGlobalSymbols
  interface Matchers<T = any> extends ReactMockExpect<T> {}
}

expect.extend(reactMockMatcher);
