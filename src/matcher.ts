import 'vitest';
import type { MatcherState } from '@vitest/expect';
import { printExpected, printReceived } from 'jest-matcher-utils';
import type { ReactMock } from 'react-mock-component';
import type { DeepPartial, IndexedRender, UnknownProps } from './utils.js';
import {
  deepEquals,
  diffProps,
  getMatchingCalls,
  indent,
  printCall,
} from './utils.js';

export interface ReactMockExpect<Props> {
  /**
   * Check that the mock is currently mounted.
   *
   * @see toHaveBeenRendered
   */
  toBeMounted(): void;

  /**
   * Check that the mock has been rendered.
   *
   * If the component was rendered and then unmounted, this expectation will
   * still pass.
   *
   * @param times The exact number of times you expect the mock component
   *   to have been rendered. When not passed it checks that the component was
   *   rendered at least once.
   *
   * @see toBeMounted
   */
  toHaveBeenRendered(times?: number): void;

  /**
   * Check that the mock has been rendered at least once with the expected props.
   *
   * If you want to check only the last render use `toHaveProps`.
   *
   * @see toHaveProps
   *
   * @param expected Will be matched recursively and can support jest matchers.
   *
   * @example
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveBeenRenderedWith({ foo: 1 });
   *
   * @example
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveBeenRenderedWith(
   *   expect.objectContaining({ bar: 23 })
   * );
   *
   * @example
   * const Mock = createReactMock({ foo: { bar: number} });
   * expect(Mock).toHaveBeenRenderedWith({ foo: { bar: 1 } });
   */
  toHaveBeenRenderedWith(expected: DeepPartial<Props>): void;

  /**
   * Check that the last received props match the expected ones.
   *
   * As opposed to `toHaveBeenRenderedWith`, `toHaveProps` only checks the
   * last render.
   *
   * @see toHaveBeenRenderedWith
   *
   * @param expected Will be matched recursively and can support jest matchers.
   *
   * @example
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveProps({ foo: 1 });
   *
   * @example
   * const Mock = createReactMock({ foo: number, bar: number });
   * expect(Mock).toHaveProps(
   *   expect.objectContaining({ bar: 23 })
   * );
   *
   * @example
   * const Mock = createReactMock({ foo: { bar: number} });
   * expect(Mock).toHaveProps({ foo: { bar: 1 } });
   */
  toHaveProps(expected: DeepPartial<Props>): void;
}

type Result = {
  pass: boolean;
  message: () => string;
  actual?: unknown;
  expected?: unknown;
};

type ReactMockMatcher = {
  toBeMounted: (this: MatcherState, mock: ReactMock<unknown>) => Result;
  toHaveBeenRendered: (this: MatcherState, mock: ReactMock<unknown>) => Result;
  toHaveBeenRenderedWith: <Props extends UnknownProps>(
    this: MatcherState,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>,
  ) => Result;
  toHaveProps: <Props extends UnknownProps>(
    this: MatcherState,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>,
  ) => Result;
};

export const reactMockMatcher: ReactMockMatcher = {
  toBeMounted(this: MatcherState, mock: ReactMock<unknown>) {
    const { isNot } = this;
    const { printReceived, matcherHint } = this.utils;

    const hint = matcherHint('toBeMounted', `mock`, '', {
      isNot,
    });
    const expected = !isNot
      ? 'Expected the mock to currently be mounted, but it is not.'
      : `Expected the mock to currently not be mounted, but it is.`;
    const received = printReceived(mock.renderCalls.length);

    return {
      message: () =>
        `${hint}

${expected}
Previous number of renders: ${received}`,
      pass: mock.mounted,
    };
  },

  toHaveBeenRendered(
    this: MatcherState,
    mock: ReactMock<unknown>,
    times?: number,
  ) {
    const { isNot } = this;
    const { printExpected, printReceived, matcherHint } = this.utils;

    const hint = matcherHint('toHaveBeenRendered', `mock`, '', {
      isNot,
    });

    const expected = isNot
      ? times === undefined
        ? `${printExpected(0)}`
        : `!= ${printExpected(times)}`
      : times === undefined
        ? `>= ${printExpected(1)}`
        : ` = ${printExpected(times)}`;

    const received = isNot
      ? times === undefined
        ? printReceived(mock.renderCalls.length)
        : `   ${printReceived(mock.renderCalls.length)}`
      : `   ${printReceived(mock.renderCalls.length)}`;

    return {
      message: () =>
        `${hint}

Expected number of renders: ${expected}
Received number of renders: ${received}`,
      pass:
        times === undefined ? mock.rendered : mock.renderCalls.length === times,
    };
  },

  toHaveBeenRenderedWith<Props extends UnknownProps>(
    this: MatcherState,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>,
  ) {
    const { isNot } = this;
    const { matcherHint, EXPECTED_COLOR, RECEIVED_COLOR } = this.utils;

    const hint = matcherHint('toHaveBeenRenderedWith', `mock`, 'props', {
      isNot,
    });

    const matchingCalls = getMatchingCalls(mock, expected);
    const calls: IndexedRender<Props>[] = mock.renderCalls.map((props, i) => [
      i,
      props,
    ]);

    const pass = matchingCalls.length > 0;

    const intro = `${hint}

Expected: ${isNot ? 'not ' : ''}${printExpected(expected)}
Received:`;

    const outro = `
Total number of renders: ${mock.renderCalls.length}`;

    const isOnlyCall = calls.length === 1;

    const diffNonMatchingCalls = () => {
      if (isOnlyCall) {
        return `${hint}

${EXPECTED_COLOR('- Expected')}
${RECEIVED_COLOR('+ Received')}

${diffProps(calls[0][1], expected)!}
${outro}`;
      }

      return `${intro}
${EXPECTED_COLOR('- Expected')}
${RECEIVED_COLOR('+ Received')}
${indent(
  calls
    .map(
      printCall(
        expected,
        (actual, expected2) => `\n${diffProps(actual, expected2)}`,
      ),
    )
    .join(`\n`),
)}
${outro}`;
    };

    return {
      message: !pass
        ? diffNonMatchingCalls
        : () => `${intro}
${indent(
  matchingCalls
    .map(printCall(expected, (a) => ` ${printReceived(a)}`))
    .join(`\n`),
)}
${outro}`,
      pass,
      actual: isOnlyCall ? calls[0][1] : undefined,
      expected: isOnlyCall ? expected : undefined,
    };
  },

  toHaveProps<Props extends UnknownProps>(
    this: MatcherState,
    mock: ReactMock<Props>,
    expected: DeepPartial<Props>,
  ) {
    const { isNot } = this;
    const { matcherHint, EXPECTED_COLOR, RECEIVED_COLOR } = this.utils;

    const hint = matcherHint('toHaveProps', `mock`, 'props', {
      isNot,
    });

    const pass = deepEquals(mock.lastProps, expected);

    return {
      message: () =>
        !pass
          ? `${hint}

${EXPECTED_COLOR('- Expected')}
${RECEIVED_COLOR('+ Received')}

${diffProps(mock.lastProps, expected)}

Number of renders: ${mock.renderCalls.length}`
          : `${hint}

${EXPECTED_COLOR('Expected: ')}not ${printExpected(expected)}
${RECEIVED_COLOR('Received: ')}${printReceived(mock.lastProps)}

Number of renders: ${mock.renderCalls.length}`,
      pass,
      actual: mock.lastProps,
      expected,
    };
  },
};
